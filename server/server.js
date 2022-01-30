const Room = require("./Room.js")
const Client = require("./Client.js")

//Note that these native modules will be empty objects in the browser!
const path = require("path")
const fs = require("fs")
const crypto = require("crypto")

const {i18n} = require("../src/i18nHelper.js")

function getMessage(type, message, status) {
	return JSON.stringify({
		type, message, status
	})
}



let staticMessageBar;

function getMessageBarText() {
	let timeStamp = staticMessageBar?.timeStamp
	let message = staticMessageBar?.message
	if (message && timeStamp) {
		//Substitute in remainingTime (if it is included in the string)
		//This allows for dynamic messages ("Maintenance in X minutes"), and can help prevent time zone confusion.
		let stringToReplace = "${remainingTime}"
		let substitutionString = ""
		if (timeStamp) {
			let deltaTime = new Date(timeStamp).getTime() - Date.now() //Positive - time in future that timeStamp is.
			let deltaTimeMinutes = deltaTime / 1000 / 60
			let deltaTimeHours = deltaTimeMinutes / 60
			let deltaTimeDays = deltaTimeHours / 24

			deltaTimeMinutes %= 60
			deltaTimeHours %= 24

			deltaTimeMinutes = Math.floor(deltaTimeMinutes)
			deltaTimeHours = Math.floor(deltaTimeHours)
			deltaTimeDays = Math.floor(deltaTimeDays)

			if (deltaTimeDays) {
				substitutionString += `${deltaTimeDays} ${deltaTimeDays > 1 ? "days":"day"}`
			}

			if (deltaTimeHours) {
				if (substitutionString) {substitutionString += ", "}
				substitutionString += `${deltaTimeHours} ${deltaTimeHours > 1 ? "hours":"hour"}`
			}

			if (deltaTimeMinutes) {
				if (substitutionString) {substitutionString += " and "}
				substitutionString += `${deltaTimeMinutes} ${deltaTimeMinutes > 1 ? "minutes":"minute"}`
			}

			substitutionString = substitutionString.trim()
		}
		let composedMessage = message.replace(stringToReplace, substitutionString)
		return composedMessage
	}
	else {
		return message
	}
}



function onConnection(websocket) {
	let clientId;

	let lastMessageBarText = ""; //The last message bar text sent to this user.

	websocket.on('message', function incoming(message) {
		try {
			let obj;
			try {
				obj = JSON.parse(message)
			}
			catch(e) {
				return websocket.send(getMessage("error", "Message must be valid JSON"))
			}


			try {
				//Update the message bar if it has changed.
				//This is used for announcing maintenances, etc.
				let newMessageBarText = getMessageBarText()
				if (lastMessageBarText !== newMessageBarText) {
					websocket.send(getMessage("setStaticMessageBar", newMessageBarText))
					lastMessageBarText = newMessageBarText
				}
			}
			catch (e) {
				console.error(e)
			}


			//Admin actions:

			//let auth = "" //Insert real password.

			//Set static message bar - useful for scheduling events like maintenance, or other important info to users.
			//${remainingTime} is substituted with the time remaining before timeStamp (if passed).
			//Pass an empty string as message to clear static message bar.
			//stateManager.setStaticMessageBar({auth, message: "Maintenance in ${remainingTime} - online games will be lost", timeStamp: MaintenanceTime})

			//Send a message to all users currently in online games.
			//stateManager.messageAllServerClients({onlineOnly: true, auth, title: "Server Update", body: "Mahjong 4 Friends is entering maintenance in a few minutes to perform a server update. Online games will be unavailable for about 30 seconds (offline unaffected). Feel free to continue playing - all games will be restored after the update (assuming all goes well)"})

			//Call a server save.
			//stateManager.callServerSave(auth, "update")


			//TODO: callServerSave is basically useless now - we don't have a system to load from a state.
			if (obj.type === "callServerSave" || obj.type === "messageAllServerClients" || obj.type === "setStaticMessageBar") {
				if (!obj.auth) {
					return websocket.send(getMessage("displayMessage", {title: "Auth Error", body: "This command must be authed"}))
				}

				let hash = crypto.createHash("sha256").update(obj.auth).digest("hex")
				if (hash !== "014eea3157474ede4dccc818d1a84efff650b82b8d67d3470f46e4ecc2f5d829") {
					return websocket.send(getMessage("displayMessage", {title: "Auth Error", body: "Invalid Admin Password"}))
				}

				if (obj.type === "callServerSave") {
					return websocket.send(getMessage("displayMessage", {title: "Server Save", body: globalThis.saveServerState(obj.saveName)}))
				}
				else if (obj.type === "messageAllServerClients") {
					globalThis.serverStateManager.getAllClients().forEach((client) => {
						client.message("displayMessage", {title: obj.title, body: obj.body, onlineOnly: obj.onlineOnly})
					})
				}
				else if (obj.type === "setStaticMessageBar") {
					//TODO: We should send the updated staticMessageBar text to all clients immediently,
					//rather than waiting for them to send a message to the server before checking.
					staticMessageBar = {message: obj.message, timeStamp: obj.timeStamp}
				}
				return;
			}

			if (obj.type === "uploadOfflineSave") {
				let sdd = globalThis.serverStateManager.serverDataDirectory
				let src = path.join(sdd, obj.saveId + ".server.json")
				if (src.startsWith(sdd)) {
					//Don't process anything with ../, etc.
					fs.promises.writeFile(src, obj.message)
				}
				return
			}

			console.log('received: ' + JSON.stringify(obj));


			let client;
			if (!clientId && !obj.clientId) {
				return websocket.send(getMessage("error", "No clientId specified"))
			}
			else {
				clientId = obj.clientId
				if (!globalThis.serverStateManager.getClient(clientId)) {
					if (clientId.startsWith("bot")) {
						//Intended for dev use.
						client = globalThis.serverStateManager.createBot(clientId, websocket)
					}
					else {
						client = globalThis.serverStateManager.createClient(clientId, websocket)
					}
				}
				else {
					client = globalThis.serverStateManager.getClient(clientId)
					client.setWebsocket(websocket)
				}
			}

			if (obj.locale) {
				client.setLocale(obj.locale)
			}

			if (obj.type === "createRoom") {
				if (typeof obj.roomId !== "string") {
					return websocket.send(getMessage("createRoom", "roomId must be a string", "error"))
				}
				else if (globalThis.serverStateManager.getRoom(obj.roomId)) {
					return websocket.send(getMessage("createRoom", "Room Already Exists", "error"))
				}
				else {
					client.setNickname(obj.nickname)
					globalThis.serverStateManager.createRoom(obj.roomId).addClient(clientId)
					return websocket.send(getMessage("createRoom", client.getRoomId(), "success"))
				}
			}
			else if (obj.type === "joinRoom") {

				if (!globalThis.serverStateManager.getRoom(obj.roomId)) {

					return websocket.send(getMessage("joinRoom", i18n.__({ phrase: "Room %s does not exist. You can click the Create Room button to create it!",
																															   locale: obj.locale}, obj.roomId), "error"))
				}
				client.setNickname(obj.nickname)
				return globalThis.serverStateManager.getRoom(obj.roomId).addClient(clientId)
			}
			else if (obj.type === "getCurrentRoom") {
				let roomId = client.getRoomId()
				client.message(obj.type, roomId, "success")
				return websocket.send(getMessage(obj.type, roomId, "success"))
			}
			else if (obj.type === "createRoomFromState") {
				//Intended for developer use.
				try {
					let roomFilePath = path.join(globalThis.serverStateManager.serverDataDirectory, obj.saveId)

					if (fs.existsSync(roomFilePath)) {
						//Technically roomPath could be a ../ path, however this kind of "hacking" shouldn't do any damage here. We don't write or expose non-mahjong data.
						let room = Room.fromJSON(fs.readFileSync(roomFilePath, {encoding: "utf8"}))
						let roomId = room.roomId
						if (!globalThis.serverStateManager.createRoom(roomId, room)) {return console.warn("Room already exists. ")}
						room.init()
					}
					else {console.warn("Invalid save path. Make sure to include file extension. ")}
				}
				catch(e) {console.error(e)}
				return;
			}
			else if (obj.type.includes("roomAction")) {
				//The user is in a room, and this action will be handled by the room.
				let room = globalThis.serverStateManager.getRoom(obj.roomId) || client.getRoom()
				if (!room) {
					//The user did not specify a valid room to use, and was not in a room.
					return websocket.send(getMessage(obj.type, "Room Does Not Exist", "error"))
				}
				//console.log(room)
				try {
					return room.onIncomingMessage(clientId, obj)
				}
				catch(e) {
					console.error(e)
					console.error(e.stack)
					return;
				}
			}

			console.log("Nothing happened. ")
		}
		catch(e) {
			//Uncaught exceptions now cause server to crash since NodeJS update.
			console.error(e)
		}
	});
}

module.exports = onConnection
