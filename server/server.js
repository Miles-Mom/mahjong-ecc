const Room = require("./Room.js")
const Client = require("./Client.js")

let path, fs, crypto;

try {
	path = require("path")
	fs = require("fs")
	crypto = require("crypto")
}
catch (e) {
	console.warn(e)
}

function getMessage(type, message, status) {
	return JSON.stringify({
		type, message, status
	})
}

function onConnection(websocket) {
	let clientId;

	websocket.on('message', function incoming(message) {
		try {
			let obj;
			try {
				obj = JSON.parse(message)
			}
			catch(e) {
				return websocket.send(getMessage("error", "Message must be valid JSON"))
			}

			//Admin actions for triggering maintenance.
			//A Warning! If the server is killed, you only have 60 seconds to bring it back up before the server will reboot.
			//restartServer.js will not reboot again for 90 minutes. 

			//Example:
			//var auth = "" //Insert real password.
			//stateManager.messageAllServerClients({onlineOnly: true, auth, title: "Server Update", body: "Mahjong 4 Friends is entering maintenance in a few minutes to perform a server update. Online games will be unavailable for about 30 seconds (offline unaffected). Feel free to continue playing - all games will be restored after the update (assuming all goes well)"})

			//stateManager.callServerSave(auth, "update")

			//Then apply the update, and start the server loading from the state.
			//That should probably be done by editing crontab before reboot, then editing back.

			//stateManager.messageAllServerClients({onlineOnly: true, auth, title: "Reconnected", body: "Mahjong 4 Friends is online. Please report any issues to support@mahjong4friends.com"})

			if (obj.type === "callServerSave" || obj.type === "messageAllServerClients") {
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

			if (obj.type === "createRoom") {
				if (typeof obj.roomId !== "string" || obj.roomId.trim().length === 0) {
					return websocket.send(getMessage("createRoom", "roomId must be a string with at least one character", "error"))
				}
				else if (globalThis.serverStateManager.getRoom(obj.roomId)) {
					return websocket.send(getMessage("createRoom", "Room Already Exists", "error"))
				}
				else {
					client.setNickname(obj.nickname)
					globalThis.serverStateManager.createRoom(obj.roomId).addClient(clientId)
					client.setRoomId(obj.roomId)
					return websocket.send(getMessage("createRoom", obj.roomId, "success"))
				}
			}
			else if (obj.type === "joinRoom") {
				if (!globalThis.serverStateManager.getRoom(obj.roomId)) {
					return websocket.send(getMessage("joinRoom", "Room Does Not Exist", "error"))
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
					let roomFilePath = path.join(globalThis.serverStateManager.serverDataDirectory, obj.saveId + ".room")

					if (fs.existsSync(roomFilePath)) {
						//Technically roomPath could be a ../ path, however this kind of "hacking" shouldn't do any damage here. We don't write or expose non-mahjong data.
						let room = Room.fromJSON(fs.readFileSync(roomFilePath, {encoding: "utf8"}))
						let roomId = room.roomId
						if (!globalThis.serverStateManager.createRoom(roomId, room)) {return console.warn("Room already exists. ")}
						room.init()
					}
					else {console.warn("Invalid save path")}
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
