const Wall = require("../src/Wall.js")
const Hand = require("../src/Hand.js")
const Tile = require("../src/Tile.js")
const Match = require("../src/Match.js")
const Pretty = require("../src/Pretty.js")
const Sequence = require("../src/Sequence.js")
const TileContainer = require("../src/TileContainer.js")

class Room {
	constructor(roomId, state = {}) {
		//Note: If loading from state, this.init() must be called.
		this.state = state
		this.roomId = this.state.roomId = roomId
		this.state.settings = this.state.settings || {}

		console.log(state)
		//TODO: Currently, clientId of other users in the same room can be found in DevTools, allowing for impersonation. This needs to be fixed by using different identifiers internally and externally, or with auth.

		this.clientIds = this.state.clientIds = this.state.clientIds || []
		this.inGame = false
		this.gameData = {}

		this.setInstructions = (function(clientId, instructions) {
			if (!this?.gameData?.instructions) {
				this.gameData.instructions = {}
			}
			this.gameData.instructions[clientId] = instructions
		}).bind(this)

		this.setAllInstructions = (function(excludeClientIds, instructions) {
			this.clientIds.forEach((clientId) => {
				if (!excludeClientIds.includes(clientId)) {
					this.setInstructions(clientId, instructions)
				}
			})
		}).bind(this)


		let _hostClientId;
		Object.defineProperty(this, "hostClientId", {
			set: function(id) {
				_hostClientId = id
				this.state.hostClientId = id
			},
			get: function() {return _hostClientId}
		})
		this.hostClientId = this.state.hostClientId

		this.state.moves = this.state.moves || []


		let loadState = (function loadState() {
			if (this.state.seed) {
				console.time("Loading Room State... ")

				//Make sure we don't blast all the clients with repeat messages.
				this.clientIds.forEach(((clientId) => {
					let client = globalThis.serverStateManager.getClient(clientId)
					client.suppress()
					if (client.getRoomId() === undefined) {client.setRoomId(this.roomId)}
				}).bind(this))

				let _moves = this.state.moves.slice(0)

				this.startGame({type: "roomActionStartGame", settings: this.state.settings})
				console.log(_moves)
				//These moves are going to get added back in...

				_moves.forEach((move) => {
					this.onPlace(...move)
				})

				this.clientIds.forEach((clientId) => {
					globalThis.serverStateManager.getClient(clientId).unsuppress()
				})

				this.sendStateToClients()
				delete this.init
				console.timeEnd("Loading Room State... ")
			}
		}).bind(this)

		this.init = loadState

		this.startGame = (require("./Room/startGame.js")).bind(this)
		this.addBot = (require("./Room/addBot.js")).bind(this)

		//Directs incoming message to the proper handlers, in some cases applying checks.
		this.onIncomingMessage = (require("./Room/onIncomingMessage.js")).bind(this)

		//Generates summary for game end.
		this.getSummary = (require("./Room/getSummary.js")).bind(this)

		this.turnChoicesProxyHandler = {
			set: (require("./Room/turnChoicesProxyHandler.js")).bind(this)
		}

		//Creates state visible to a specific client. Used by room.sendStateToClients
		this.getState = (require("./Room/getState.js")).bind(this)

		//For kicking players and leaving the room.
		this.removeClient = (require("./Room/removeClient.js")).bind(this)

		this.drawTile = (require("./Room/drawTile.js")).bind(this)
		this.goMahjong = (require("./Room/goMahjong.js")).bind(this)


		//We don't want to rotate until the game is actually ended - otherwise, we mess up state if the game is reverted.
		//Therefore, we use a flag shouldRotateWinds. It defaults to true, and can be overridden by room.goMahjong
		this.shouldRotateWinds = true
		this.rotateWinds = function() {
			let winds = ["north", "east", "south", "west"].reverse()
			for (let clientId in this.state.settings.windAssignments) {
				let wind = this.state.settings.windAssignments[clientId]
				this.state.settings.windAssignments[clientId] = winds[(winds.indexOf(wind) + 1) % 4] //Next in order
			}
		}

		this.revertState = (function(client, turnNumber) {
			//Reverts state, returning to turn turnNumber
			turnNumber = Number(turnNumber)
			if (isNaN(turnNumber) || turnNumber < 0) {
				return client.message("roomActionGameplayAlert", "Revert Error: Invalid Revert turnNumber", "success")
			}

			this.messageAll([], "roomActionGameplayAlert", `${client.getNickname()} reverted to move ${turnNumber} (${this.state.moves.length - 1 - turnNumber} moves)`)

			globalThis.serverStateManager.deleteRoom(this.roomId)
			this.state.moves = this.state.moves.slice(0, turnNumber)
			let room = new Room(this.roomId, this.state)
			globalThis.serverStateManager.createRoom(this.roomId, room)
			room.init()
		}).bind(this)

		this.sendStateToClients = (function sendStateToClients() {
			this.clientIds.forEach((clientId) => {
				let client = globalThis.serverStateManager.getClient(clientId)
				let state = this.getState(clientId)
				client.message("roomActionState", state, "success")
			})
		}).bind(this)

		this.addClient = (function(clientId) {
			let client = globalThis.serverStateManager.getClient(clientId)

			if (this.clientIds.includes(clientId)) {return client.message("joinRoom", "Already In Room", "error")}

			client.setRoomId(this.roomId)
			client.message("joinRoom", this.roomId, "success")

			if (!this.hostClientId) {this.hostClientId = clientId}
			this.clientIds.push(clientId)
			this.sendStateToClients()
			return true
		}).bind(this)

		this.messageAll = (function(exclude = [], ...args) {
			this.clientIds.forEach((clientId) => {
				if (exclude.includes(clientId)) {return}
				let client = globalThis.serverStateManager.getClient(clientId)
				client.message(...args)
			})
		}).bind(this)

		this.endGame = (function endGame(obj, clientId) {
			let gameEndMessage = "The Game Has Ended";
			if (clientId) {
				let client = globalThis.serverStateManager.getClient(clientId)
				//Tell players who ended the game.
				gameEndMessage = "The game has been ended by " + client.getNickname() + "."
			}
			if (this.shouldRotateWinds) {this.rotateWinds()}
			this.shouldRotateWinds = true
			this.inGame = false
			delete this.state.seed
			delete this.state.wall
			//Without a seed, moves won't be evaluated, as no wall can be constructed.
			this.state.moves = []
			this.gameData = {}
			this.messageAll([clientId], obj.type, gameEndMessage, "success")
			this.sendStateToClients()
		}).bind(this)

		let placerMahjongOverride = false
		let placerSequenceOverride = false
		this.onPlace = (function(obj, clientId) {
			//Obj.message - a Tile, Match, or Sequence
			let move = [obj, clientId]
			//TODO: Now that bot moves should be deterministic, we no longer need to store the moves the bots made.
			//For American Mahjong, it probably still makes sense as it can take a bit of time to analyze the card.
			this.state.moves.push(move)
			if (this.logFile) {
				try {
					this.logFile.write(JSON.stringify(move) + "\n")
				}
				catch (e) {console.error("ERROR WRITING TO ROOM LOGFILE: ", e)}
			}

			let client = globalThis.serverStateManager.getClient(clientId)
			let hand = this.gameData.playerHands[clientId]

			if (this.gameData.isMahjong) {
				return client.message("displayMessage", {title: "Mahjong!", body: this.lastSummary})
			}
			else if (this.gameData.wall.isEmpty) {
				return client.message("displayMessage", {title: "Game Over - Wall Empty", body: this.lastSummary})
			}

			if (!hand) {
				return client.message("displayMessage", {title: "Access Denied", body: "It appears that you spectating. "})
			}

			let placement = obj?.message;
			try {
				if (placement === "Claim") {
					this.gameData.currentTurn.turnChoices[clientId] = placement
					return
				}
				placement = Hand.convertStringsToTiles(placement)

				if (this.state.settings.charleston.length > 0 && this.gameData.charleston === undefined && placement.length !== 1 && hand.wind === "east") {
					if (placement.length === 3) {
						this.gameData.charleston = {
							directions: this.state.settings.charleston.slice(0)
						}

						let direction = this.gameData.charleston.directions[0][0].direction
						this.setAllInstructions([], "Welcome to the Charleston. Select 3 tiles you would like to pass " + direction + ", then hit Proceed. " , "success")
						this.messageAll([clientId], "roomActionGameplayAlert", "The first Charleston pass is " + direction , "success")
					}
					else if (!obj.mahjong) {
						return client.message(obj.type, "The very first throw must be either 1 tile, to initiate the game, or 3 tiles, to initiate charleston. ", "error")
					}
					else if (obj.mahjong) {
						placement = undefined
					}
				}
				else if (this.gameData.charleston) {}
				else if (placement.length > 1) {
					if (this.state.settings.gameStyle === "american") {
						//TileContainers bypass everything, which American Mahjong needs right now.
						placement = new TileContainer({tiles: placement})
					}
					else if (Match.isValidMatch(placement)) {
						placement = new Match({exposed: true, amount: placement.length, type: placement[0].type, value: placement[0].value})
					}
					else if (Sequence.isValidSequence(placement)) {
						placement = new Sequence({exposed: true, tiles: placement})
					}
					else {
						return client.message(obj.type, "Unable to create a sequence, or match. Please check your tiles. ", "error")
					}
				}
				else {
					placement = placement[0]
					this.gameData.charleston = this.gameData.charleston || false
				}
			}
			catch (e) {
				return client.message(obj.type, "Error: " + e.message, "error")
			}
			//The users wishes to place down tiles.
			//If it is not their turn, we will hold until all other players have either attempted to place or nexted.
			//Then we will apply priority.

			if (placement instanceof Array) {
				//This should only happen if we are in a charleston. Remove the charleston tiles from their hand.
				if (this.gameData.currentTurn.turnChoices[clientId]) {
					return client.message(obj.type, "You have already passed tiles for this charleston round. ", "error")
				}

				this.gameData.currentTurn.turnChoices[clientId] = placement
				this.sendStateToClients()
			}
			else if (this.gameData.currentTurn.thrown === false || this.gameData.currentTurn.thrown === undefined) {
				if (clientId !== this.gameData.currentTurn.userTurn) {
					//This player is not allowed to perform any actions at this stage.
					return client.message(obj.type, "Can't place after draw before throw", "error")
				}
				if (placement instanceof Tile) {
					if (obj.mahjong) {
						return client.message(obj.type, "You can't discard and go mahjong. ", "error")
					}

					if (hand.removeMatchingTilesFromHand(placement)) {
						//If this is the 4th tile for an exposed pong in this hand, we will turn it into a kong and draw another tile.
						//TODO: Note that it is remotely possible players will want to throw the 4th tile instead, as it is a very safe (if honor, entirely safe), throw.
						//This would mean sacraficing points and a draw in order to get a safe throw, and I have never seen it done, but there are scenarios where it may
						//actually be the best idea. We should probably allow this at some point.
						if (hand.contents.some(((item) => {
							if (item instanceof Match && item.type === placement.type && item.value === placement.value) {
								item.amount = 4
								this.drawTile(clientId)
								return true
							}
							return false
						}).bind(this))) {
							this.messageAll([clientId], "roomActionGameplayAlert", client.getNickname() + " has upgraded an exposed pong into a kong. ", {clientId, speech: "Make that a kong", durationMultiplier: 1.1}) //Add duation. Long speech.
							this.sendStateToClients()
							return;
						}

						if (obj.swapJoker) {
							//We're going to try to swap this discard out for a joker if possible.
							//Bots can pass true to auto-detect and not receive errors on fail.
							let clientIds;
							if (obj.swapJoker === true) {
								clientIds = [clientId].concat(this.clientIds) //This is 5 clientIds - but it doesn't matter since we'll short circuit.
							}
							else if (this.clientIds.indexOf(obj.swapJoker) !== -1) {
								clientIds = [obj.swapJoker]
							}
							else {
								return client.message(obj.type, "Unable to identify which player you want to swap with. ", "error")
							}

							let res = clientIds.some((clientId) => {
								let swapWithHand = this.gameData.playerHands[clientId]
								return swapWithHand.contents.some((item) => {
									if (item.exposed) {
										//In American Mahjong, the only tiles that can be called for are pongs, kongs, quints, and sextets.
										//Therefore, the jokers must match the other tiles exposed.
										let tile = item.tiles.find((tile) => {
											return tile.type !== "joker"
										})

										let jokerIndex = item.tiles.findIndex((tile) => {
											return tile.type === "joker"
										})

										if (jokerIndex !== -1 && tile.matches(placement)) {
											//Swap the joker for this tile
											hand.add(item.tiles[jokerIndex])
											item.tiles.splice(jokerIndex, 1)
											item.tiles.push(placement)
											return true
										}
									}
								})
							})

							if (res) {
								//Swapped for a joker
								client.message("roomActionGameplayAlert", "Successfully Swapped", {clientId, speech: "Swapped", durationMultiplier: 0.5})
								this.messageAll([clientId], "roomActionGameplayAlert", client.getNickname() + " swapped a " + placement.getTileName(this.state.settings.gameStyle) + " for a joker", {clientId, speech: "Swap", durationMultiplier: 1})
								return this.sendStateToClients()
							}
							else {
								if (obj.swapJoker !== true) {
									hand.add(placement) //Restore the hand.
									//Couldn't swap - send error.
									return client.message(obj.type, "Could not find a joker to swap with. ", "error")
								}
							}
						}


						//Bots can pass true to auto-detect and not receive errors on fail.
						//Confirm this is either a bot or a normal discard - if a person fails to joker swap, we refund their tile.
						if (!obj.swapJoker || obj.swapJoker === true) {
							let tileName = placement.getTileName(this.state.settings.gameStyle)
							let discardMessage = client.getNickname() + " threw a " + tileName
							//We're also going to check if the discarder is calling.
							let durationMultiplier = 1;
							if (this.state.settings.checkForCalling && !hand.calling && hand.isCalling(this.gameData.discardPile, this.state.settings.maximumSequences)) {
								hand.calling = true
								discardMessage += ", and is calling"
								durationMultiplier = 1.5
							}

							//Discard tile.
							this.gameData.currentTurn.thrown = placement
							delete this.lastDrawn
							this.gameData.currentTurn.turnChoices[clientId] = "Next"
							placerMahjongOverride = false

							this.messageAll([clientId], "roomActionGameplayAlert", discardMessage, {clientId, speech: tileName, durationMultiplier, optional: !hand.calling})
							this.setAllInstructions([clientId], discardMessage + ". To skip, press Proceed. To claim this tile, select the tiles you are placing it with, and press Proceed (or Mahjong if this tile makes you Mahjong). ")

							client.addMessageToHistory(discardMessage) //Make discards appear in history menu.

							this.sendStateToClients()
						}
					}
					else {
						return client.message(obj.type, "You can't place a tile you do not possess - try reloading the page or restarting the app", "error")
					}
				}
				else if (placement instanceof Match && placement.amount === 4) {
					if (obj.mahjong) {
						return client.message(obj.type, "You can't go mahjong while placing a kong. ", "error")
					}
					if (hand.removeMatchingTilesFromHand(placement.getComponentTile(), 4)) {
						//Place Kong. Turn remains the same, thrown false.
						hand.contents.push(placement)
						//This must be an in hand kong, therefore we do not expose, although in hand kongs will be shown.
						placement.exposed = false
						//Draw them another tile.
						this.drawTile(clientId)
						this.sendStateToClients()
						this.messageAll([clientId], "roomActionGameplayAlert", client.getNickname() + " has placed an in-hand kong of " + placement.getTileName(this.state.settings.gameStyle) + "s", {clientId, speech: "kong"})
						console.log("Kong")
						return
					}
					else {
						return client.message(obj.type, "You can't place tiles you do not possess - try reloading the page or restarting the app", "error")
					}
				}
				else if (obj.mahjong) {
					this.goMahjong(clientId, {drewOwnTile: !this.gameData.previousTurnPickedUp, override: placerMahjongOverride})
					if (globalThis.serverStateManager.getClient(clientId).isBot) {
						console.log("Bots are not allowed to obtain override power")
					}
					else {
						placerMahjongOverride = true
					}
				}
				else if (!obj.mahjong && placement instanceof Match || placement instanceof Sequence) {
					return client.message(obj.type, "Can't expose in hand pong, sequence, or pair, except for mahjong.", "error")
				}
				else {
					//TODO: This triggers attempting to place an in hand sequence. This is the wrong error message, although it is an error.
					return client.message(obj.type, "Invalid placement attempt for current game status", "error")
				}
			}
			else if (placement === undefined) {
				if (this.gameData.charleston) {
					return globalThis.serverStateManager.getClient(clientId).message("roomActionPlaceTiles", "You must choose 3 tiles to pass during charleston. ", "error")
				}
				this.gameData.currentTurn.turnChoices[clientId] = "Next"
				this.sendStateToClients()
			}
			else {
				//This is not a discard, and it related to a throw, so must either be a pong, kong, sequence, or a pair if the user is going mahjong.
				if (obj.mahjong) {
					//Naked Mahjong
					placement.mahjong = obj.mahjong
				}
				else if (!(placement instanceof Match || placement instanceof Sequence || placement instanceof TileContainer)) {
					return client.message(obj.type, "You can't discard when it is not your turn", "error")
				}
				else if (placement instanceof Sequence && !placerSequenceOverride) {
					let sequenceCount = hand.contents.reduce((amount, item) => {
						if (item instanceof Sequence) {return ++amount}
						return amount
					}, 0)


					if (sequenceCount >= this.state.settings.maximumSequences) {
						placerSequenceOverride = true //TODO: We should probably turn this override off at some point.
						return client.message(obj.type, "Host game settings allow only " + this.state.settings.maximumSequences + " sequence(s). Repeat your same move to ignore this setting, and place this sequence. Overriding this setting may cause minor issues in scoring, and may require a Mahjong override. ", "error")
					}
				}

				//Schedule the order. It's validity will be checked later.
				this.gameData.currentTurn.turnChoices[clientId] = placement
				this.sendStateToClients()
			}
		}).bind(this)
	}

	toJSON() {
		let moves = this.state.moves
		delete this.state.moves
		let str = JSON.stringify(this.state)
		this.state.moves = moves
		str += "\n"
		this.state.moves.forEach((move) => {str += JSON.stringify(move) + "\n"})
		return str
	}

	//Files have the moves after - they aren't all in one place.
	static fromJSON(str) {
		let lines = str.trim().split("\n")
		let obj = JSON.parse(lines[0])
		let moves = lines.slice(1)
		moves = moves.map((str) => {return JSON.parse(str)})
		obj.moves = moves

		return new Room(obj.roomId, obj)
	}
}


module.exports = Room
