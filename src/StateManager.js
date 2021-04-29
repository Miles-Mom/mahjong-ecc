const Popups = require("./Popups.js")

class StateManager {
	constructor(websocketURL) {

		//This function is referenced in createWebsocket, so DO NOT move it downwards. You will get burned by a lack of function hoisting.
		let onmessage = (function onmessage(message) {
			let obj = JSON.parse(message.data)
			console.log(obj)
			if (obj.type === "joinRoom") {
				onJoinRoom(obj)
			}
			else if (obj.type === "createRoom") {
				onCreateRoom(obj)
			}
			else if (obj.type === "roomActionState") {
				onStateUpdate(obj)
			}
			else if (obj.type === "roomActionKickFromRoom") {
				//We kicked somebody else. Should probably show an error message or success.
			}
			else if (obj.type === "roomActionLeaveRoom") {
				onLeaveRoom(obj)
			}
			else if (obj.type === "getCurrentRoom") {
				onGetCurrentRoom(obj)
			}
			else if (obj.type === "displayMessage") {
				new Popups.Notification(obj.message.title, obj.message.body).show()
			}
			else if (obj.type === "roomActionStartGame") {
				onStartGame(obj)
				window.scrollTo(0,0)
			}
			else if (obj.type === "roomActionEndGame") {
				onEndGame(obj)
			}
			else if (obj.type === "roomActionPlaceTiles") {
				if (this.onPlaceTiles instanceof Function) {this.onPlaceTiles(obj)}
			}
			else if (obj.type === "roomActionGameplayAlert") {
				if (this.onGameplayAlert instanceof Function) {this.onGameplayAlert(obj)}
			}
			else if (obj.type === "roomActionGetMessageHistory") {
				if (this.onGetMessageHistory instanceof Function) {this.onGetMessageHistory(obj)}
			}
			else {
				console.log("Unknown Type " + obj.type)
			}
		}).bind(this)

		let popup;
		this.createWebsocket = (async function createWebsocket() {
			this.websocket = new WebSocket(websocketURL)
			this.websocket.addEventListener("message", onmessage)

			this.websocket.addEventListener("open", function() {
				if (window.setConnectionStatus) {window.setConnectionStatus({connected: true})}
				if (popup) {popup.dismiss();popup = null}
			})

			//Error events also result in a close, so we end up with exponential blowup if reconnect on both. We'll only reconnect on close.
			this.websocket.addEventListener("close", (async function(e) {
				if (window.setConnectionStatus) {window.setConnectionStatus({connected: false})}
				console.warn(e)
				if (e.code !== 1000) {
					if (stateManager.offlineMode === false) {
						if (popup) {popup.dismiss();popup = null}
						popup = new Popups.MessageBar("You Disconnected from the Server. Attempting to Reconnect...")
						popup.show(8000)
					}

					//If not a normal closure, reestablish and sync.
					await new Promise((resolve, reject) => {setTimeout(resolve, 1000)}) //1 second delay on reconnects.
					this.createWebsocket()
					if (!stateManager.offlineMode) {
						this.getCurrentRoom() //Syncs state.
					}
				}
			}).bind(this))

			class FakeWebsocket {
				on(listener, func) {
					console.log(listener)
					this.onmessage = func
				}

				send(message) {
					onmessage({data: message})
				}
			}

			let fakeSocket = new FakeWebsocket()

			if (!globalThis.serverStateManager) {
				const ServerStateManager = require("../server/StateManager.js")
				globalThis.serverStateManager = new ServerStateManager()
			}

			this.sendMessage = async function(message) {
				if (this.offlineMode) {
					if (!this.localServer) {
						this.localServer = require("../server/server.js")
						console.log(this.localServer)

						this.localServer(fakeSocket)
					}

					console.log(fakeSocket)

					if (!fakeSocket.onmessage) {
						console.log(fakeSocket)
						this.localServer(fakeSocket)
					}

					fakeSocket.onmessage(message)
				}
				else {
					//Send message once socket opens.
					if (this.websocket.readyState === 0) {
						await new Promise((resolve, reject) => {
							this.websocket.onopen = resolve
							this.websocket.onerror = reject //TODO: Handle error.
						})
					}
					console.log(message)
					this.websocket.send(message)
				}
			}
		}).bind(this)
		this.createWebsocket()

		this.inRoom = false
		this.isHost = false
		this.inGame = false

		this.joinRoom = function(roomId, nickname) {
			this.sendMessage(JSON.stringify({
				type: "joinRoom",
				clientId: window.clientId,
				roomId,
				nickname
			}))
		}

		this.createRoom = function(roomId, nickname) {
			this.sendMessage(JSON.stringify({
				type: "createRoom",
				clientId: window.clientId,
				roomId,
				nickname
			}))
		}

		this.kickUser = function(roomId, userId) {
			this.sendMessage(JSON.stringify({
				type: "roomActionKickFromRoom",
				clientId: window.clientId,
				id: userId ///id of user to kick.
			}))
		}

		this.leaveRoom = function(roomId) {
			this.sendMessage(JSON.stringify({
				type: "roomActionLeaveRoom",
				clientId: window.clientId,
			}))
		}

		this.closeRoom = function(roomId) {
			this.sendMessage(JSON.stringify({
				type: "roomActionCloseRoom",
				clientId: window.clientId,
			}))
		}

		this.startGame = function(settings = {}) {
			this.sendMessage(JSON.stringify({
				type: "roomActionStartGame",
				clientId: window.clientId,
				settings: settings
			}))
		}

		this.endGame = function() {
			this.sendMessage(JSON.stringify({
				type: "roomActionEndGame",
				clientId: window.clientId,
			}))
		}

		this.placeTiles = function(tiles, mahjong, obj = {}) {
			this.sendMessage(JSON.stringify({
				type: "roomActionPlaceTiles",
				clientId: window.clientId,
				mahjong, //Undefined is equivalent to false.
				message: tiles,
				swapJoker: obj.swapJoker
			}))
		}

		this.addBot = function(botName) {
			this.sendMessage(JSON.stringify({
				type: "roomActionAddBot",
				clientId: window.clientId,
				botName: botName
			}))
		}

		this.setNickname = function(nickname, targetId = window.clientId) {
			this.sendMessage(JSON.stringify({
				type: "roomActionChangeNickname",
				clientId: window.clientId,
				nickname,
				targetId
			}))
		}

		this.getCurrentRoom = (function() {
			//Get our room.
			this.sendMessage(JSON.stringify({
				"type": "getCurrentRoom",
				clientId: window.clientId
			}))
		}).bind(this)

		this.getMessageHistory = (function() {
			return new Promise((resolve) => {
				this.onGetMessageHistory = resolve

				this.sendMessage(JSON.stringify({
					"type": "roomActionGetMessageHistory",
					clientId: window.clientId
				}))
			})
		}).bind(this)

		this.revertState = (function(turnNumber) {
			this.sendMessage(JSON.stringify({
				type: "roomActionRevertState",
				message: turnNumber,
				clientId: window.clientId
			}))
		}).bind(this)

		this.createRoomFromState = (function(saveId) {
			//Intended for developer use.
			this.sendMessage(JSON.stringify({
				type: "createRoomFromState",
				saveId: saveId,
				clientId: window.clientId
			}))
		}).bind(this)


		this.getState = function(roomId) {
			console.log("Getting state...")
			this.sendMessage(JSON.stringify({
				type: "roomActionState",
				clientId: window.clientId,
			}))
		}

		//These are authed for admin use only.
		this.callServerSave = function(auth, saveName) {
			this.sendMessage(JSON.stringify({
				type: "callServerSave",
				auth,
				saveName,
			}))
			console.warn("You will need to manually kill the server on reboot and reload from save. ")
		}

		this.messageAllServerClients = function(auth, title, body) {
			this.sendMessage(JSON.stringify({
				type: "messageAllServerClients",
				auth,
				title,
				body,
			}))
		}


		let onCreateRoom = (function onCreateRoom(obj) {
			if (obj.status === "success") {
				this.inRoom = obj.message
				this.isHost = true
			}
			if (this.onCreateRoom instanceof Function) {this.onCreateRoom(obj)}
		}).bind(this)

		let onJoinRoom = (function onJoinRoom(obj) {
			if (obj.status === "success") {
				this.inRoom = obj.message
			}
			if (this.onJoinRoom instanceof Function) {this.onJoinRoom(obj)}
		}).bind(this)

		let onLeaveRoom = (function onLeaveRoom(obj) {
			if (obj.status === "success") {
				this.inRoom = false
				this.isHost = false

				if (this.inGame === true) {
					this.inGame = false
					onEndGame({status: "success", message: "State Sync"})
				}
			}
			if (this.onLeaveRoom instanceof Function) {this.onLeaveRoom(obj)}
		}).bind(this)

		//We'll allow multiple listeners for some events.
		this.listeners = {
			onStartGame: [],
			onEndGame: [],
			onStateUpdate: [],
		}

		this.addEventListener = (function addEventListener(type, listener) {
			if (!this.listeners[type]) {throw type + " is not supported by this addEventListener"}
			this.listeners[type].push(listener)
		}).bind(this)

		this.removeEventListener = (function addEventListener(type, listener) {
			if (!this.listeners[type]) {throw type + " is not supported by this addEventListener"}
			if (this.listeners.indexOf(listener) === -1) {throw "Unable to find listener"}
			this.listeners[type].splice(this.listeners.indexOf(listener), 1)
		}).bind(this)


		let onStartGame = (function onStartGame(obj) {
			if (obj.status === "success") {
				this.inGame = true
			}
			if (this.onStartGame instanceof Function) {this.onStartGame(obj)}
			this.listeners.onStartGame.forEach((listener) => {
				listener(obj)
			})
		}).bind(this)

		let onEndGame = (function onEndGame(obj) {
			if (obj.status === "success") {
				this.inGame = false
			}
			if (this.onEndGame instanceof Function) {this.onEndGame(obj)}
			this.listeners.onEndGame.forEach((listener) => {
				listener(obj)
			})
		}).bind(this)


		let onStateUpdate = (function onStateUpdate(obj) {
			this.lastState = obj
			this.isHost = obj.message.isHost

			if (this.inGame === false && obj.message.inGame === true) {
				if (stateManager.offlineMode === undefined) {stateManager.offlineMode = false}
				onStartGame({status: "success", message: "State Sync"})
			}
			else if (this.inGame === true && obj.message.inGame === false) {
				onEndGame({status: "success", message: "State Sync"})
			}

			this.currentTurn = obj.message.currentTurn

			if (this.onStateUpdate instanceof Function) {this.onStateUpdate(obj)}
			this.listeners.onStateUpdate.forEach((listener) => {
				listener(obj)
			})
		}).bind(this)

		let onGetCurrentRoom = (function onGetCurrentRoom(obj) {
			this.inRoom = obj.message || false
			//Now, if we are in a room, we should sync state with the room.
			if (this.inRoom) {
				onJoinRoom(obj)
				this.getState(this.inRoom)
			}
		}).bind(this)
	}

	static setClientId(newId) {
		window.clientId = newId
		localStorage.setItem("clientId", window.clientId)

		//Development use only. Warnings should be shown.
		//This will only change the clientId for the session. It will not change localStorage.
		let params = new URLSearchParams("?" + window.location.hash.slice(1))
		if (params.has("clientId")) {
			window.clientId = params.get("clientId")
		}
	}

	static createNewClientId() {
		return "user" + (Math.random() * 2**53)
	}

	static getClientId() {
		//Get the users clientId, or create a new one.
		let clientId = localStorage.getItem("clientId")
		if (clientId === null) {
			clientId = StateManager.createNewClientId()
		}

		return clientId
	}
}

StateManager.setClientId(StateManager.getClientId())

module.exports = StateManager
