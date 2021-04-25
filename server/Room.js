const Wall = require("../src/Wall.js")
const Hand = require("../src/Hand.js")
const Tile = require("../src/Tile.js")
const Match = require("../src/Match.js")
const Pretty = require("../src/Pretty.js")
const Sequence = require("../src/Sequence.js")
const TileContainer = require("../src/TileContainer.js")
const americanUtilities = require("./american/utilities.js")

class Room {
	constructor(roomId, state = {}) {
		//Note: If loading from state, this.init() must be called.
		this.state = state
		this.roomId = this.state.roomId = roomId
		this.state.settings = this.state.settings || {}

		console.log(state)
		//TODO: Currently, clientId of other users is shown to users in the same room, allowing for impersonation. This needs to be fixed by using different identifiers.

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

		let lastSummary;
		this.getSummary = (function(mahjongClientId, options = {}) {
			let summary = []

			let res = {}

			for (let id in this.gameData.playerHands) {
				let hand = this.gameData.playerHands[id]

				res[id] = {netpoints: 0, points: 0}

				res[id].text = globalThis.serverStateManager.getClient(id).getNickname() + ": " + hand.wind

				if (this.state.settings.gameStyle === "chinese") {
					if (hand.wind === "east") {res[id].text += " (pay(s) double)"}
					if (id === mahjongClientId) {
						res[id].points += hand.score({isMahjong: true, drewOwnTile: !this.gameData.previousTurnPickedUp})
					}
					else {
						res[id].points += hand.score()
					}
					res[id].text += `, ${res[id].points} points`
				}
				else if (this.state.settings.gameStyle === "american") {
					if (id === mahjongClientId) {
						let hands, maxPossibleJokers;
						try {
							//We don't want to crash if the hand is dead.
							hands = americanUtilities.getTileDifferential(this.gameData.card, hand.contents)
							maxPossibleJokers = americanUtilities.getTileDifferential([hands[0].handOption], [])[0].canFillJoker.length
						}
						catch (e) {
							console.error(e)
						}
						if (hands?.[0]?.diff === 0) {
							let handOption = hands[0].handOption
							res[id].points += handOption.score

							res[id].text += " - " + handOption.section + " #" + (handOption.cardIndex + 1) + `, ${res[id].points} points`

							//Double for no jokers, except where jokers can't be used (like for Singles and Pairs)
							if (hands[0].jokerCount === 0 && maxPossibleJokers > 0) {
								res[id].points *= 2
								res[id].text += " - No Jokers (Double)"
							}
						}
						else {
							res[id].text += " - Unable to Score"
						}
					}
				}

				if (id === mahjongClientId) {
					res[id].text += " - Mahjong"

					if (!this.gameData.previousTurnPickedUp) {
						res[id].text += " - Drew Own Tile"
						if (this.state.settings.gameStyle === "american") {
							res[id].text += " (double)"
							res[id].points *= 2 //Drawing own tile is a double.
						}
					}
					else {
						res[id].text += " - With " + this.gameData.previousTurnPickedUp.getTileName(this.state.settings.gameStyle)
					}
				}
			}


			for (let id in this.gameData.playerHands) {
				if (this.state.settings.gameStyle === "chinese") {
					if (id === this.gameData.previousTurnThrower) {
						res[id].text += " - Threw Last Tile"
					}

					//We can simply iterate twice - we pay them, then they pay us.
					for (let opponentId in this.gameData.playerHands) {
						let playerMultiplier = 1

						//Everything with East is doubled.
						if (this.gameData.playerHands[id].wind === "east" || this.gameData.playerHands[opponentId].wind === "east") {
							playerMultiplier *= 2
						}

						//We only pay if we are not Mahjong
						if (id !== mahjongClientId) {
							res[id].netpoints -= res[opponentId].points * playerMultiplier
							res[opponentId].netpoints += res[opponentId].points * playerMultiplier
						}
					}
				}
				else if (this.state.settings.gameStyle === "american") {
					let playerMultiplier = 1

					if (id === this.gameData.previousTurnThrower) {
						res[id].text += " - Threw Last Tile (Pay Double)"
						playerMultiplier *= 2
					}

					//Pay mahjong player their points.
					res[id].netpoints -= res[mahjongClientId].points * playerMultiplier
					res[mahjongClientId].netpoints += res[mahjongClientId].points * playerMultiplier
				}
				if (id !== mahjongClientId) {
					summary.push(res[id])
				}
				else {
					summary.splice(0, 0, res[id]) //Insert at end.
				}
			}

			for (let id in this.gameData.playerHands) {
				res[id].text += " (Net " + (res[id].netpoints > 0?"+":"") + res[id].netpoints + " points)"
			}

			lastSummary = summary.map((item) => {return item.text}).join("\n")
			return lastSummary;
		}).bind(this)

		let shouldRotateWinds = true
		this.rotateWinds = function() {
			//We don't want to rotate until the game is actually ended - otherwise, we mess up state if the game is reverted.
			let winds = ["north", "east", "south", "west"].reverse()
			for (let clientId in this.state.settings.windAssignments) {
				let wind = this.state.settings.windAssignments[clientId]
				this.state.settings.windAssignments[clientId] = winds[(winds.indexOf(wind) + 1) % 4] //Next in order
			}
		}

		this.goMahjong = (function goMahjong(clientId, options = {}) {
			//options.override

			//First, verify the user can go mahjong.
			let client = globalThis.serverStateManager.getClient(clientId)
			let hand = this.gameData.playerHands[clientId]

			if (this.state.settings.gameStyle === "chinese") {
				//On override, always allow unlimited (4) sequences, as if the overrides are purely sequence limits (forgot to change the setting,
				//the scoring will now be correct, not incorrect)
				let isMahjong = hand.isMahjong(options.override?4:this.state.settings.maximumSequences, {thrownTile: this.gameData.previousTurnPickedUp})
				if (isMahjong instanceof Hand) {
					hand.contents = isMahjong.contents //Autocomplete the mahjong.
				}
				if (!isMahjong && !options.override) {
					return client.message("roomActionPlaceTiles", "Unable to go mahjong with this hand. If you play by different rules, try again to override. ", "error")
				}
			}
			else if (this.state.settings.gameStyle === "american") {

			}

			//The game is over.
			this.gameData.currentTurn.userTurn = clientId
			this.gameData.isMahjong = true

			this.sendStateToClients()
			//If East wins, do not rotate.
			if (this.state.settings.windAssignments[clientId] === "east") {
				shouldRotateWinds = false
			}

			this.messageAll([clientId], "roomActionGameplayAlert", client.getNickname() + " has gone mahjong" , {clientId, speech: "Mahjong"})

			this.setAllInstructions([this.hostClientId], client.getNickname() + " has gone mahjong!\nPress End Game to return everybody to the room screen. ")
			this.setInstructions(this.hostClientId, client.getNickname() + " has gone mahjong!\nPress End Game to return everybody to the room screen. ")

			this.messageAll([], "displayMessage", {title: "Mahjong!", body: this.getSummary(clientId, options)}, "success")
			this.sendStateToClients()
		}).bind(this)

		this.revertState = (function(moveCount) {
			//Reverts state, removing moveCount moves
			//TODO: We probably want to save state here. Can we simply change the save ID or something?
			if (moveCount < 1) {return} //Block revert by zero or negative numbers.
			globalThis.serverStateManager.deleteRoom(this.roomId)
			this.state.moves = this.state.moves.slice(0, -moveCount)
			let room = new Room(this.roomId, this.state)
			globalThis.serverStateManager.createRoom(this.roomId, room)
			room.init()
		}).bind(this)

		this.turnChoicesProxyHandler = {
			set: (require("./Room/turnChoicesProxyHandler.js")).bind(this)
		}

		let getState = (function getState(requestingClientId) {
			//Generate the game state visible to requestingClientId
			let state = {}
			state.inGame = this.inGame
			state.isHost = (requestingClientId === this.hostClientId);
			if (this.gameData.wall) {
				//Pass tiles if mahjong, else number of tiles.
				state.wallTiles = this.gameData.wall.tiles
				if (!this.gameData.isMahjong) {
					state.wallTiles = state.wallTiles.length
				}
			}

			state.isGameOver = 0
			if (this?.gameData?.isMahjong) {
				state.isGameOver = 1
			}
			else if (this?.gameData?.wall?.isEmpty) {
				state.isGameOver = 2
			}

			state.settings = this.state.settings

			state.instructions = this?.gameData?.instructions?.[requestingClientId] || ""
			state.discardPile = this.gameData.discardPile

			if (this.gameData.currentTurn) {
				state.currentTurn = {
					thrown: this.gameData.currentTurn.thrown,
					userTurn: this.gameData.currentTurn.userTurn,
					playersReady: Object.keys(this.gameData.currentTurn.turnChoices || {})
				}

				//Pass the last drawn tile to the person requesting.
				//Last drawn tile is cleared every throw to avoid leaking information and stop showing the tile as drawn.
				if (requestingClientId === this.gameData.currentTurn.userTurn) {
					state.currentTurn.lastDrawn = this.lastDrawn
				}


				if (this.gameData.charleston) {
					state.currentTurn.charleston = true
				}
			}

			state.clients = []
			this.clientIds.slice(0, state.inGame?4:Infinity).forEach((currentClientId) => {
				let visibleClientState = {
					id: currentClientId,
					nickname: globalThis.serverStateManager.getClient(currentClientId).getNickname(),
					isHost: (currentClientId === this.hostClientId)
				}
				if (this.inGame) {
					let hand = this.gameData.playerHands[currentClientId]
					if (requestingClientId === currentClientId) {
						//One can see all of their own tiles.
						visibleClientState.hand = hand
					}
					else {
						if (!this.gameData.isMahjong && !this.gameData.wall.isEmpty) {
							//One can only see exposed tiles of other players. True says to include other tiles as face down.
							visibleClientState.visibleHand = hand.getExposedTiles(true)
						}
						else {
							//Game over. Show all.
							visibleClientState.visibleHand = hand.contents
						}
						visibleClientState.wind = hand.wind
					}
				}
				state.clients.push(visibleClientState)
			})

			return state
		}).bind(this)

		this.sendStateToClients = (function sendStateToClients() {
			this.clientIds.forEach((clientId) => {
				let client = globalThis.serverStateManager.getClient(clientId)
				let state = getState(clientId)
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

		this.removeClient = (function(clientId, explaination = "You left the room. ") {
			let clientIdIndex = this.clientIds.findIndex((currentClientId) => {return currentClientId === clientId})
			if (clientIdIndex === -1) {
				return "Client Not Found"
			}
			else {
				this.clientIds.splice(clientIdIndex, 1)
				if (this.hostClientId === clientId) {
					//Choose a new host client. Make sure NOT to pick a bot.
					this.hostClientId = null;
					this.clientIds.forEach(((clientId) => {
						if (this.hostClientId) {return}
						if (!globalThis.serverStateManager.getClient(clientId).isBot) {
							this.hostClientId = clientId
						}
					}).bind(this))
				}
				this.sendStateToClients()

				let clientBeingKicked = globalThis.serverStateManager.getClient(clientId)
				if (clientBeingKicked) {
					clientBeingKicked.message("roomActionLeaveRoom", explaination, "success")
					//The client is going to change their client Id. We can now delete the old client.
					globalThis.serverStateManager.deleteClient(clientId)
				}
				if (this.hostClientId === null) {
					//We have no clients. Delete this room.
					//Note that this code shouldn't be called, unless there is a bug or lag. The client will not show the Leave Room button if they are the
					//only player and host (which they should be if they are the only player), and therefore roomActionCloseRoom will be sent instead.
					globalThis.serverStateManager.deleteRoom(this.roomId)
				}
			}
		}).bind(this)

		this.messageAll = (function(exclude = [], ...args) {
			this.clientIds.forEach((clientId) => {
				if (exclude.includes(clientId)) {return}
				let client = globalThis.serverStateManager.getClient(clientId)
				client.message(...args)
			})
		}).bind(this)

		this.drawTile = (function drawTile(clientId, doNotMessage = false) {
			let tile;
			let pretty = -1
			while (!(tile instanceof Tile)) {
				pretty++
				tile = this.gameData.wall.drawFirst()
				if (!tile) {
					console.log("Wall Empty");

					this.messageAll([], "displayMessage", {title: "Game Over - Wall Empty", body: this.getSummary()}, "success")

					this.setInstructions([this.hostClientId], "The Wall is empty. \nPress End Game to return everybody to the room screen. ")
					this.setInstructions(this.hostClientId,  "The Wall is empty. \nPress End Game to return everybody to the room screen. Press New Game to play again with the same settings. ")

					this.gameData.wall.isEmpty = true
					this.sendStateToClients() //Game over. Wall empty.
					return
				}
				this.gameData.playerHands[clientId].add(tile)
			}
			let client = globalThis.serverStateManager.getClient(clientId)
			if (!doNotMessage) {
				this.lastDrawn = tile
				this.setInstructions(client.clientId, "You drew " + ((pretty > 0?(pretty === 1)?"a pretty and a ":pretty + " prettys and a ":"a ")+ tile.getTileName(this.state.settings.gameStyle)) + ". To discard, select a tile and press proceed. To kong, select 4 matching tiles and press Proceed. If you are Mahjong, press Mahjong. ")
				if (pretty > 0) {
					this.messageAll([clientId], "roomActionGameplayAlert", client.getNickname() + " drew " + ((pretty === 1)?"a pretty!":pretty + " prettys!"), {clientId, speech: "I'm pretty!"})
				}
			}
			else if (pretty > 0) {
				//If doNotMessage is passed, this is beginning of game setup. We won't send anything other than "You drew a pretty" to avoid having multiple overlapping pieces of text.
				client.message("roomActionGameplayAlert", "You drew a pretty!", "success")
			}
		}).bind(this)

		this.endGame = (function endGame(obj, clientId) {
			let gameEndMessage = "The Game Has Ended";
			if (clientId) {
				let client = globalThis.serverStateManager.getClient(clientId)
				//Tell players who ended the game.
				gameEndMessage = "The game has been ended by " + client.getNickname() + "."
			}
			if (shouldRotateWinds) {this.rotateWinds()}
			shouldRotateWinds = true
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
				return client.message("displayMessage", {title: "Mahjong!", body: lastSummary})
			}
			else if (this.gameData.wall.isEmpty) {
				return client.message("displayMessage", {title: "Game Over - Wall Empty", body: lastSummary})
			}

			if (!hand) {
				return client.message("displayMessage", {title: "Access Denied", body: "It appears that you spectating. "})
			}

			let placement;
			try {
				placement = Hand.convertStringsToTiles(obj.message)

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
								this.messageAll([clientId], "roomActionGameplayAlert", client.getNickname() + " has swapped a " + placement.getTileName(this.state.settings.gameStyle) + " for a joker", {clientId, speech: "Swap", durationMultiplier: 1})
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
							let discardMessage = client.getNickname() + " has thrown a " + tileName
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

		this.onIncomingMessage = (function(clientId, obj) {
			let client = globalThis.serverStateManager.getClient(clientId)
			let isHost = (clientId === this.hostClientId)

			if (obj.type === "roomActionLeaveRoom") {
				return this.removeClient(clientId)
			}
			else if (obj.type === "roomActionKickFromRoom") {
				//Only the host can kick, and only if the game has not started.
				if (!isHost) {
					console.log(client)
					console.log(client.message)
					return client.message(obj.type, "Only Host Can Kick", "error")
				}
				if (this.inGame) {
					return client.message(obj.type, "Can't Kick During Game", "error")
				}
				this.removeClient(obj.id, "You have been kicked from the room. ") //obj.id is the id of the user to kick.
				return client.message(obj.type, "Kicked Client", "success")
			}
			else if (obj.type === "roomActionStartGame") {
				if (!isHost) {
					return client.message("displayMessage", {title: "Error Starting Game", body: "Only Host Can Start"})
				}
				if (this.inGame) {
					return client.message("displayMessage", {title: "Error Starting Game", body: "Already in Game"})
				}

				//Time to start the game.
				let res = this.startGame(obj)
				if (typeof res === "string") {
					//Strings are error messages.
					return client.message("displayMessage", {title: "Error Starting Game", body: res})
				}
				return
			}
			else if (obj.type === "roomActionEndGame") {
				//Anybody can end the game, as they could do the same going AFK.
				if (!this.inGame) {
					return client.message(obj.type, "No Game In Progress", "error")
				}
				if (this.clientIds.indexOf(clientId) > 3) {
					return this.removeClient(clientId)
				}
				this.endGame(obj, clientId) //Clientid is an optional parameter.
			}
			else if (obj.type === "roomActionCloseRoom") {
				if (!isHost) {
					return client.message(obj.type, "Only Host Can Close Room", "error")
				}

				let hostClientId = this.hostClientId //Host may change as people are removed.

				this.clientIds.slice(0).forEach((clientId) => {
					if (clientId !== hostClientId) {
						//Clone array to avoid shifting.
						this.removeClient(clientId, "The room has been closed. ")
					}
				})
				this.removeClient(hostClientId, "You closed the room. ")
				globalThis.serverStateManager.deleteRoom(this.roomId)
			}
			else if (obj.type === "roomActionPlaceTiles") {
				//Action to place tiles.
				//Only current turn user can place.
				return this.onPlace(obj, clientId)
			}
			else if (obj.type === "roomActionAddBot") {
				if (!isHost) {
					return client.message(obj.type, "Only Host Can Add Bots", "error")
				}
				return this.addBot(obj)
			}
			else if (obj.type === "roomActionRevertState") {
				if (this.clientIds.indexOf(clientId) > 3) {
					return client.message("displayMessage", {title: "Access Denied", body: "It appears that you spectating. "})
				}
				if (!isNaN(obj.message)) {
					this.messageAll([], "roomActionGameplayAlert", client.getNickname() + " is reverting the state " + Number(obj.message) + " moves. ", "success" )
					return this.revertState(Number(obj.message))
				}
				return client.message("roomActionGameplayAlert", "Invalid Reversion Amount", "error")
			}
			else if (obj.type === "roomActionState") {
				return client.message(obj.type, getState(clientId), "success")
			}
			else if (obj.type === "roomActionChangeNickname") {
				let message; //Message will remain undefined if the user does not have permission to rename.
				let target = globalThis.serverStateManager.getClient(obj.targetId)

				if (obj.targetId === clientId) {
					message = target.getNickname() + " renamed to " + obj.nickname
				}
				else if (isHost) {
					message = "The host renamed " + target.getNickname() + " to " + obj.nickname
				}

				if (message) {
					target.setNickname(obj.nickname)
					this.messageAll([clientId], "roomActionGameplayAlert", message, "success" )
					this.sendStateToClients()
				}
				return
			}
		}).bind(this)

		this.toJSON = (function() {
			let moves = this.state.moves
			delete this.state.moves
			let str = JSON.stringify(this.state)
			this.state.moves = moves
			str += "\n"
			this.state.moves.forEach((move) => {str += JSON.stringify(move) + "\n"})
			return str
		}).bind(this)
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
