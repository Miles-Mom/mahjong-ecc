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

			//The bot client is only used for development testing and generating guaranteed hands.
			if (globalThis.runBotClientAutoPlay) {
				//Remember to pass --avoidFSWrites to the server
				let fs, path;
				try {
					fs = require("fs")
					path = require("path")
				}
				catch (e) {console.warn(e)}

				if (!this.lastSent) {this.lastSent = Date.now()}
				if (message?.isGameOver) {
					if (this.getRoom().logFileSaveId === this.lastSaveId) {return}
					else {this.lastSaveId = this.getRoom().logFileSaveId}

					//console.log(message)
					if (!this.games) {this.games = []}

					let game = {
						tilesLeft: message.wallTiles.length ?? message.wallTiles,
						mahjongPlayer: (message.isGameOver === 1)?message.currentTurn.userTurn:undefined,
						runTime: Date.now() - this.startedLastGame
					}
					console.error(game)
					this.games.push(game)

					let weWon = game.mahjongPlayer === this.clientId
					game.weWon = weWon

					let guaranteedDir = path.join(globalThis.serverStateManager.serverDataDirectory, this.getRoom().gameData.card.name)
					if (!fs.existsSync(guaranteedDir)) {fs.mkdirSync(guaranteedDir, {recursive: true})}

					if (weWon) {
						const americanUtilities = require("./american/utilities.js")
						let analysis = americanUtilities.getTileDifferential(this.getRoom().gameData.card, this.getRoom().gameData.playerHands[this.clientId].contents)
						game.analysis = analysis

						let cards = game.analysis.filter((item) => {return item.diff === 0})
						cards = cards.map((item) => {return {section: item.handOption.section, index: item.handOption.cardIndex + 1}})
						game.cards = cards

						game.cards.forEach((cardInfo) => {
							let outputDir = path.join(guaranteedDir, cardInfo.section, String(cardInfo.index))
							if (!fs.existsSync(outputDir)) {fs.mkdirSync(outputDir, {recursive: true})}

							for (let i=1;true;i++) {
								//TODO: Is there a good way to speed this up? I don't think it's a problem, but checking hundreds of paths might be slow.
								let writePath = path.join(outputDir, i + ".server.json")
								if (!fs.existsSync(writePath)) {
									fs.writeFileSync(writePath, globalThis.serverStateManager.toJSON())
									break;
								}
							}
						})
					}

					//Eliminate the first game from stats. We do not win the first game, and it is run every time.
					let logFile = path.join(guaranteedDir, "log.txt")
					fs.appendFileSync(logFile, "Game: " + (this.games.length - 1) + "\n")
					fs.appendFileSync(logFile, "Average Runtime: " + ((this.games.slice(1).reduce((total, item) => {return total + item.runTime}, 0)) / (this.games.length - 1)) + "\n")
					fs.appendFileSync(logFile, "Win Percentage: " + ((this.games.slice(1).reduce((total, item) => {return total + Number(item.weWon)}, 0)) / (this.games.length - 1)) + "\n")
					fs.appendFileSync(logFile, "Any Win Percentage: " + ((this.games.slice(1).reduce((total, item) => {return total + Number(!!item.mahjongPlayer)}, 0)) / (this.games.length - 1)) + "\n")

					if (this.games.length > (globalThis.simulatedGamesToRun || 500)) {
						console.error(this.games) //Stop running and log games.
					}
					else {
						this.startedLastGame = Date.now()
						setTimeout((function() {
							this.endGame({})
							this.startGame({type: "roomActionStartGame", settings: this.state.settings})
						}).bind(this.getRoom()), 300)
					}
				}
				else if (type === "roomActionState") {
					//Suppress most messages. 5 second delay between real messages, so you can actually load the game to analyze.
					if (Math.random() < 1 && this.getRoom().inGame && Date.now() - this.lastSent < 5000) {}
					else {
						console.log("Sent")
						this.lastSent = Date.now()
						if (this.websocket) {
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
						}
					}

					return require("./Bot/handleMessage.js").call(this, {type, message, status, botConfig: {botDifficulty: 100}})
				}
				else if (type === "roomActionGameplayAlert") {
					return;
				}
			}
			//End of bot client code.


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
