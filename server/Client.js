const {i18n} = require("../src/i18nHelper.js")
const vsprintf = require('sprintf-js').vsprintf

let Bot; //Don't want both scripts importing each other.

class Client {
	constructor(clientId, websocket) {
		this.clientId = clientId
		this.nickname = clientId.slice(0,7)
		this.websocket = websocket

		this.locale = "en";

		this.clearMessageHistory()
	}

	// massage message object: translate per client's locale & flatten object with locale info to plain string
	// note this is used by Room.Instruction too.
	localizeMessage(message) {

		if (typeof message === "string" ) {
			// plain simple text: client.message(.., "this is a test to be xlated")
			message = i18n.__({phrase:message, locale:this.locale})
		}
		else if (typeof message === "object" && message.format) {
			// * text with runtime data supplied - use the object notation.
			let fmt = message.format

			if (typeof fmt === "string" ) {
				// client.message(.., {format: "this is a test for %s", args: varData})
				// client.message(.., {format: "this is a test for %{namedVar}s", args:{namedVar: varData}})
				fmt = i18n.__({phrase:fmt, locale:this.locale})
			}
			else if (fmt instanceof Array ) {
				// concatenated multiple sentences, w/ or w/o runtime data. - note the object notation, and array format.
				// client.message(.., {foramt: ["first with %(param1)s.", "second with %(param2)s."], args: {param1:Xxx, param2: Yyy})
				fmt = fmt.map((item) => {return i18n.__({phrase:item, locale: this.locale})} )
				fmt = fmt.join("")
			}
			else {
				console.error(`internal error bad format ${fmt}`)
				return message
			}

			// let's make a copy of the arg before we set out to modify it
			let args = {}		// assume named value
			if (typeof message.args === "string") {
				args = []		// positional
				args.push(message.args)		// to avoid turning string into an array of chars via next method
			}
			else if (typeof message.args === "object") {
				args = Object.assign({}, message.args)
			}

			// some of the dynamic data itself need to be localized first
			// eg: message(.., {format:"test %(param1)s, %(param2)s", args:{param1:Xxx}, argsI18n:{param2:Yyy-toBeLocalized}})
			// note that mixing positional and named placeholders is not supported in sprintf therefore us
			if (typeof message.argsI18n === "object") {
				let argsI18n = message.argsI18n
				for (let key in argsI18n) {
					// save the localized data to the new combined args
					args[key] = i18n.__({phrase:argsI18n[key], locale: this.locale})
				}
			}
			else if (typeof message.argsI18n === "string" ) {
				// eg: message(.., {format:"test %s", argsI18n:var_to_be_localized})
				// if argsI18n is provided, but is not a named object, then, it has to be a single value, used in lieu of args.
				if (typeof message.args === "undefined") {
					args = []
					args.push(i18n.__({phrase:message.argsI18n, locale: this.locale}))
				}
				else {
					console.warn("internal error bad args: " + message.args + " " + message.argsI18n)
				}
			}

			// "2 bamboo" case: if args themselves need to be handled, provide additional callback functions as option
			// client.message(.., {foramt: "test %(tile)s.", args: {tile: tileJsonObj}, argsOption: {tile:localizeTileName_CallBackFunction} }
			if (typeof message.argsOption === "object") {
				// additional processing callback option are specified, let's run it on the correponding args
				let callbackFunctions = message.argsOption
				for (let key in callbackFunctions) {
					try {
						args[key] = callbackFunctions[key].call(this, args[key])	// late bind to this client
					}
					catch (e) {
						console.error(e)
					}
				}
			}

			if (fmt.includes("%") && typeof args === "undefined") {
				console.error(`internal error: bad format ${fmt}`)
			}
			else {
				// options here
				// A) vsprintf() which supports %(name)s, does not support {{name}}, does not support mixed-position-named
				// B) or i18n.__ which does NOT support %(name)s, does {{name}}, no mixed. we can request fixing i18n...
				// like A) for now, less cycle, even though consistency with B) is appealing.
				try {
					message = vsprintf(fmt, args)
					// message = i18n.__(fmt, args)
				}
				catch(e) {
					console.error(e)	// gotta be internal error
					message = fmt  	// try to get something back
				}
			}
		}

		return message
	}

	// client message usages:
	// plain, concat, printf with data, data itself needs handling, callback function on args aka 3-bamboo handling
	/* plain:
					message(type, "plain message", status)
			printf with data:
					message(.., {format:"msg sprintf format %(var1)s etc", args: {var1, var2}}, ..)
					message(.., {format:"this is a test for %{namedVar}s", args:{namedVar: varData}})
			concat:
					message(.., {foramt:["test %(param1)s.", "concat with %(param2)s."], args: {param1:Xxx, param2: Yyy})
			data itself needs generic translation:
					message(.., {format:"test %(param1)s, %(param2)s", args:{param1:Xxx}, args_i18n:{param2:Yyy-toBeLocalized}})
			data itself needs special handling via callback functions, aka "3-bamboo" handling:
				message(.., {foramt:"test %(tile)s.", args: {tile: tileJsonObj}, argsOption: {tile:localizeTile_CallBackFunc} }
	*/
	message(type, message, status) {

		// our changes shall do NO harm to existing code
		// Here, getCurrentRoom, joinRoom:  the message is the room name, we must not toich that.
		if (type !== "getCurrentRoom" && type !== "joinRoom" && !globalThis.runBotClientAutoPlay) {
			if (type === "displayMessage") {
					if (typeof message.title !== "undefined") {
						message.title = this.localizeMessage(message.title)
					}
					if (typeof message.body !== "undefined") {
						message.body = this.localizeMessage(message.body)
					}
			}
			else {
				message = this.localizeMessage(message)
			}
		}

		//Add these to message history so that we can revert based on them.
		if (type === "roomActionGameplayAlert") {
			this.addMessageToHistory(message)
		}

		if (type === "roomActionStartGame") {
			this.clearMessageHistory()
		}

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

				let guaranteedDir = path.join(globalThis.serverStateManager.serverDataDirectory, "../guaranteed", this.getRoom().gameData.card.name)
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
	}

	clearMessageHistory() {
		this.messageHistory = []
		let msg = this.localizeMessage("Game Started")
		this.messageHistory.push({message: msg, move: 0})
	}
	addMessageToHistory(message, offset = 0) {

		// yes, msg needs to be localized before putting to history
		message = this.localizeMessage(message)

		//Offset can be used if the message is for the previous turn, etc.
		this.messageHistory.push({message, move: this?.getRoom()?.state?.moves?.length + offset})
	}

	setWebsocket(websocket) {
		this.websocket = websocket
	}

	setNickname(nickname) {
		//Leave their name as their client id if they don't pick a real one!
		if (nickname.trim()) {
			this.nickname = nickname.slice(0, 14) //Limit nicknames to 14 characters.
		}
	}

	getNickname() {return this.nickname}

	setLocale(locale) {this.locale = locale}
	getLocale() {return this.locale}

	suppressed = false
	suppress() {this.suppressed = true}
	unsuppress() {this.suppressed = false}

	//roomId should be removed once this client is removed from a room. Probably moot due to getRoomId checks though.
	setRoomId(roomId) {
		this.roomId = roomId
	}

	getRoomId() {
		//Validate that the client is actually in the room...
		let room = globalThis.serverStateManager.getRoom(this.roomId)
		if (room && room.clientIds.includes(this.clientId)) {
			return this.roomId
		}
	}

	getRoom() {
		return globalThis.serverStateManager.getRoom(this.getRoomId())
	}

	delete(message) {
		try {
			this.websocket.close(1000) //Status code: Normal close.
		}
		catch(e) {}
		globalThis.serverStateManager.deleteClient(this.clientId)
	}

	toJSON() {
		let obj = {
			clientId: this.clientId,
			nickname: this.nickname,
			locale: this.locale,
			roomId: this.roomId,
			isBot: this.isBot
		}
		return JSON.stringify(obj)
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

		if (obj.locale) {
			//Old save files do not contain locale. 
			client.setLocale(obj.locale)
		}

		client.setRoomId(obj.roomId)

		return client
	}
}

module.exports = Client
