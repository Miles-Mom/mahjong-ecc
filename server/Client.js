let Bot; //Don't want both scripts importing each other.

class Client {
	constructor(clientId, websocket) {
		this.clientId = clientId
		this.nickname = clientId.slice(0,7)
		this.websocket = websocket

		this.setWebsocket = (function(websocket) {
			this.websocket = websocket
		}).bind(this)

		this.setNickname = (function(nickname) {
			//Leave their name as their client id if they don't pick a real one!
			if (nickname.trim()) {
				this.nickname = nickname.slice(0, 14) //Limit nicknames to 14 characters.
			}
		}).bind(this)

		this.getNickname = function() {return this.nickname}

		this.suppressed = false
		this.suppress = function() {this.suppressed = true}
		this.unsuppress = function() {this.suppressed = false}

		this.message = (function message(type, message, status) {
			if (this.suppressed) {return}


			/*
			globalThis.avoidFSWrites = true
			if (!this.lastSent) {this.lastSent = Date.now()}
			if (message?.isGameOver) {
				if (this.getRoom().logFileSaveId === this.lastSaveId) {return}
				else {this.lastSaveId = this.getRoom().logFileSaveId}

				//console.log(message)
				if (!this.total) {this.total = 0}
				if (!this.tilesLeft) {this.tilesLeft = []}

				this.tilesLeft.push(message.wallTiles.length ?? message.wallTiles) //TODO: Some zero might be mahjong, others wall empty. Apply that distinction.
				this.total++

				console.error(message.wallTiles.length, this.tilesLeft, this.total, this.tilesLeft.reduce((s, t) => s + t) / this.total)

				if (this.total > 500) {require("process").exit("Bye!")}
				setTimeout((function() {
					this.endGame({})
					this.startGame({type: "roomActionStartGame", settings: this.state.settings})
				}).bind(this.getRoom()), 300)
			}
			else if (type === "roomActionState") {
				require("./Bot/handleMessage.js").call(this, {type, message, status})
				 //Suppress most messages. 5 second delay between real messages, so you can actually load the game to analyze.
				if (Math.random() < 1 && this.getRoom().inGame && Date.now() - this.lastSent < 5000) {return}
				else {this.lastSent = Date.now()}
			}*/

			if (!this.websocket) {
				//This should only happen if we loaded from state, as we would for testing.
				return
			}
			try {
				//Handle errors where the websocket connection has closed.
				//We can probably do this simply by not sending the message, as the client should sync state if they disconnected.
				return this.websocket.send(JSON.stringify({
					type, message, status
				}))
			}
			catch (e) {
				console.error(e)
			}
		}).bind(this)


		this.delete = (function(message) {
			try {
				websocket.close(1000) //Status code: Normal close.
			}
			catch(e) {}
			globalThis.serverStateManager.deleteClient(clientId)
		}).bind(this)

		//roomId should be removed once this client is removed from a room. Probably moot due to getRoomId checks though.
		this.setRoomId = function(roomId) {
			this.roomId = roomId
		}

		this.getRoomId = function() {
			//Validate that the client is actually in the room...
			let room = globalThis.serverStateManager.getRoom(this.roomId)
			if (room && room.clientIds.includes(this.clientId)) {
				return this.roomId
			}
		}

		this.getRoom = function() {
			return globalThis.serverStateManager.getRoom(this.getRoomId())
		}

		this.toJSON = (function() {
			let obj = {
				clientId: this.clientId,
				nickname: this.nickname,
				roomId: this.roomId,
				isBot: this.isBot
			}
			return JSON.stringify(obj)
		}).bind(this)
	}

	static fromJSON(str) {
		//Create client from a string.

		let obj = JSON.parse(str)
		let client;
		if (obj.isBot) {
			if (!Bot) {Bot = require("./Bot.js")}
			client = new Bot(obj.clientId)
		}
		else {
			client = new Client(obj.clientId)
		}
		client.setNickname(obj.nickname)

		client.setRoomId(obj.roomId)

		return client
	}
}

module.exports = Client
