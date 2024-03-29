const Match = require("../../src/Match.js")
const Sequence = require("../../src/Sequence.js")
const Tile = require("../../src/Tile.js")
const Hand = require("../../src/Hand.js")
const TileContainer = require("../../src/TileContainer.js")
const Wall = require("../../src/Wall.js")
const localizeTileName = require("../localizeJustInTime.js").localizeTileName	

let windOrder = ["north", "east", "south", "west"]
const getBackwardsDistance = require("./getBackwardsDistance.js")

function getPriority(obj, key, exemptFromChecks = false) {

	if (obj[key] === "Next") {return true}

	let client = globalThis.serverStateManager.getClient(key)
	let throwerWind = this.gameData.playerHands[this.gameData.currentTurn.userTurn].wind

	let hand = this.gameData.playerHands[key]
	let placerWind = hand.wind

	let priority;


	if (this.gameData.charleston) {
		if (obj[key].length > 3) {
			client.message("roomActionPlaceTiles", "You can pass no more than 3 tiles during one Charleston round. ", "error")
			return false
		}

		let passInfo = this.gameData.charleston.directions[0][0]
		if (passInfo.allAgree) {
			if (![0,3].includes(obj[key].length)) {
				client.message("roomActionPlaceTiles", "Pass zero tiles (press proceed on nothing) to veto this round. Pass three tiles to vote in favor. ", "error")
				return false
			}
			else if (obj[key].length === 0) {
				this.messageAll([key], "roomActionGameplayAlert", "Charleston Round Vetoed by " + client.getNickname() , "success")
				client.message("roomActionGameplayAlert", "Charleston Round Vetoed" , "success")
				//Veto the round - don't make other players wait.
				this.clientIds.slice(0, 4).forEach((clientId) => {
					if (!obj[clientId]) {obj[clientId] = []}
				})
				return true
			}
		}
		else if (passInfo.blind) {
			//We probably want to notify the player across how many tiles are being passed,
			//or short circuit them if no tiles are passed.
			if (passInfo.direction === "across") {
				//Courtesy pass. Can be any amount.
			}
			else {
				//Our code allows passing zero, but rules don't. Block it.
				if (obj[key].length < 1) {
					client.message("roomActionPlaceTiles", "You must pass at least one tile during the blind pass. ", "error")
					return false
				}
			}
		}
		else if (obj[key].length !== 3) {
			client.message("roomActionPlaceTiles", "This Charleston round requires exactly three tiles. ", "error")
			return false
		}

		if (obj[key].some((tile) => {return tile.type === "joker"})) {
			client.message("roomActionPlaceTiles", "Jokers may not be passed during Charleston. ", "error")
			return false
		}

		if (hand.removeTilesFromHand(obj[key])) {
			let passMessage = "You Passed "
			let tileNames = obj[key].map((tile) => {return tile.getTileName(this.state.settings.gameStyle)})

			if (tileNames.length === 0) {
				passMessage += "Nothing"
			}
			else {
				passMessage += "a " + tileNames.shift()

				let lastName = tileNames.pop()

				tileNames.forEach((name) => {passMessage += ", a " + name})

				if (lastName) {
					if (tileNames.length > 0) {passMessage += ","} //Don't put a comma between tiles if only two.
					passMessage += " and a " + lastName
				}
			}

			client.addMessageToHistory(passMessage, -1) //Make draws appear in history menu. -1 so before, not after, this pass.

			//Assume number of tiles is valid for turn.
			return true
		}
		else {
			client.message("roomActionPlaceTiles", "You can't pass tiles you don't possess. ", "error")
			return false
		}
	}
	else if (obj[key] === "Claim") {
		//Claiming the discard tile in lieu of draw.
		if (!this.state.settings.pickupDiscardForDraw) {
			client.message("roomActionPlaceTiles", "Pickup discard for draw was not enabled by host. ", "error")
			return false
		}
		if (getBackwardsDistance(placerWind, throwerWind) !== 1) {
			client.message("roomActionPlaceTiles", "You can only claim the discard tile if you are next in rotation. ", "error")
			return false
		}
		priority = 50 //Low priority.
	}
	else if (obj[key] instanceof TileContainer || (this.state.settings.gameStyle === "american" && obj[key].mahjong)) {
		//TileContainers are American Mahjong. We don't validate everything here -
		//We will block some illegal moves, but don't validate anything against a card.

		if (this.gameData.currentTurn.thrown.type === "joker") {
			client.message("roomActionPlaceTiles", "You can't pick up a joker! Jokers are dead when thrown! ", "error")
			return false
		}

		if (!(obj[key] instanceof TileContainer)) {
			//Must be going Mahjong. In American Mahjong, you can pick up a single tile with nothing for Mahjong.
			//If the user empty pressed Mahjong, pick up the specified tile and go Mahjong.
			let temp = new TileContainer({tiles: [obj[key]]})
			temp.mahjong = obj[key].mahjong
			obj[key] = temp
		}
		else if (!(obj[key].mahjong)) {
			//Validate that this is 3 or more tiles.
			if (obj[key].tiles.length < 3) {
				client.message("roomActionPlaceTiles", "Except for Mahjong, you can only call for matches of 3+ tiles and/or jokers. ", "error")
				return false
			}
			else if (!obj[key].isValidMatch(true)) {
				client.message("roomActionPlaceTiles", "Except for Mahjong, you can only call for matches. ", "error")
				return false
			}
		}

		if (obj[key].tiles.length === 2 && obj[key].isValidMatch() === false && obj[key].isValidMatch(true)) {
			//The tile object is returned, so === true would not work.
			client.message("roomActionPlaceTiles", "Jokers can't be used to make a pair. ", "error")
			return false
		}

		priority = 89 - getBackwardsDistance(placerWind, throwerWind)
		if (obj[key].mahjong) {
			priority += 20

			//Mahjong detection.
			hand.add(this.gameData.currentTurn.thrown)
			let score = hand.score({type: "american", card: this.gameData.card})
			hand.remove(this.gameData.currentTurn.thrown)

			if (score.score === 0 && !exemptFromChecks && !this.state.settings.unknownCard) {
				client.message("roomActionPlaceTiles", `Your hand does not appear to be Mahjong for the ${this.gameData.card.name} card. If you are Mahjong, click the Mahjong button again to override. Card selection can be changed by the host in Game Settings. `, "error")
				return false
			}
		}
	}
	else {
		hand.add(this.gameData.currentTurn.thrown)

		//wouldMakeMahjong will confirm that the current tile will allow mahjong to happen.
		let mahjongHand = hand.isMahjong(this.state.settings.maximumSequences)
		let wouldMakeMahjong = !!(mahjongHand);

		hand.remove(this.gameData.currentTurn.thrown)

		if (mahjongHand instanceof Hand && !exemptFromChecks) {
			//Determine if the possible mahjong contains the specified placement, and if not, notify user and drop mahjong priority.
			let stringContents = mahjongHand.getStringContents()
			//Exposed vs unexposed can cause issues comparing strings. Need a .matches in future.
			let previousValue = obj[key].exposed
			obj[key].exposed = false
			let unexposed = obj[key].toJSON()
			obj[key].exposed = true
			let exposed = obj[key].toJSON()
			obj[key].exposed = previousValue

			if (!(stringContents.includes(unexposed) || stringContents.includes(exposed))) {
				wouldMakeMahjong = false
			}
		}

		let nakedMahjong = false
		if (obj[key] instanceof Tile && obj[key].mahjong && mahjongHand) {
			//Naked Mahjong. The one tile is the tile someone else discarded.
			console.log("Naked Mahjong Bypassing Checks")
			nakedMahjong = true
		}
		else if (obj[key].mahjong && !wouldMakeMahjong && !exemptFromChecks) {
			client.message("roomActionPlaceTiles", "Unable to detect a mahjong in your hand. (Press 'Mahjong' again to override). ", "error")
			return false;
		}

		if ((wouldMakeMahjong || nakedMahjong) && obj[key].mahjong) {
			priority = 109
			let total = getBackwardsDistance(placerWind, throwerWind)
			console.log(total)
			priority -= total
		}
		else if (obj[key] instanceof Match) {
			//Validate that this is not a pair.
			if (obj[key].amount === 2) {
				if (!wouldMakeMahjong && !exemptFromChecks) {
					client.message("roomActionPlaceTiles", "You can't place a pair when it will not make you mahjong. (Press 'Proceed' or 'Mahjong' again to override)", "error")
					return false;
				}
				else if (exemptFromChecks) {
					//Allow, and don't force mahjong.
				}
				else {
					obj[key].mahjong = true //The specified action can only be accomplished through mahjong.
				}
			}
			priority = 104 - getBackwardsDistance(placerWind, throwerWind)
		}
		else if (obj[key] instanceof Sequence) {
			//Verify that the user is the one immediently before.
			if (getBackwardsDistance(placerWind, throwerWind) > 1 && !exemptFromChecks) {
				client.message("roomActionPlaceTiles", "You can only take a sequence from the player before you, except with mahjong. (Press 'Proceed' again to override) ", "error")
				return false;
			}
			priority = 99 - getBackwardsDistance(placerWind, throwerWind)
		}
		else {
			console.error("Unknown Placement in turnChoicesProxyHandler")
			priority = 89 - getBackwardsDistance(placerWind, throwerWind)
		}
	}
	return [priority, key]
}

function calculateNextTurn(obj, exemptFromChecks) {
	//Obj is the turnChoices object.

	if (this.gameData.charleston) {
		this.sendStateToClients() //The last client needs to have the tiles taken out of their hand. We could technically send this state update only to them.
		let playerHands = []
		let placements = []
		for (let clientId in this.gameData.playerHands) {
			let hand = this.gameData.playerHands[clientId]
			let position = windOrder.indexOf(hand.wind)
			playerHands[position] = hand
			placements[position] = obj[clientId]
		}

		let currentDirection = this.gameData.charleston.directions[0].shift()

		if (currentDirection.allAgree && !placements.every((placement) => {return placement.length === 3})) {
			//Veto the entire round.
			this.gameData.charleston.directions.shift()
			currentDirection.direction = "none"
		}

		//If the round is empty, switch rounds.
		if (this.gameData.charleston.directions[0].length === 0) {
			this.gameData.charleston.directions.shift()
		}


		let increment;
		switch (currentDirection.direction) {
			case "right": increment = 1; break;
			case "across": increment = 2; break;
			case "left": increment = 3; break;
			case "none": increment = 0; break;
			default: throw "Unknown Direction" + currentDirection
		}

		if (increment === 2) {
			//Swap tiles in order specified.
			;[0,1].forEach((position) => {
				let placement = placements[position]
				let passerHand = playerHands[position]

				let passToIndex = position + 2
				let passToHand = playerHands[passToIndex]
				let passToHandPlacement = placements[passToIndex]

				for (let i=0;i<Math.max(placement.length, passToHandPlacement.length);i++) {
					if (placement[i] && passToHandPlacement[i]) {
						passToHand.add(placement[i])
						passerHand.add(passToHandPlacement[i])
					}
					else if (placement[i]) {
						passerHand.add(placement[i])
					}
					else if (passToHandPlacement[i]) {
						passToHand.add(passToHandPlacement[i])
					}
				}
			})
		}
		else {
			let tiles = []
			placements.forEach((placement) => {
				//Pass tiles into cache.

				//Blind pass needs to pick the same tiles every time when state is reloaded -
				//we can't use a form of randomness that is going to change when reloading from state.
				//We will seed with roomId and first tile in placement.

				let rngSeed = this.roomId + placement[0]?.type //There might not be a first element in placement.
				//TODO: We MIGHT want to sort the files before shuffling.
				//Currently, the order of tiles matters on blind passes - a 2, 6, 7 will not be treated the same way as a 2, 7, 6
				Wall.shuffleArray(placement, rngSeed) //It's BLIND! Pick random!
				placement.forEach((tile) => {
					tiles.push(tile)
				})
			})

			//Take tiles out of cache - order based on receivers of passes.
			//This should ensure that blind passes are handled properly.
			placements.forEach((unused, position) => {
				let receiveIndex = (position+increment)%4
				let tilesToReceive = placements[receiveIndex].length
				let receiveHand = playerHands[receiveIndex]

				for (let i=0;i<tilesToReceive;i++) {
					receiveHand.add(tiles.shift())
				}
			})
		}

		let nextDirection = this.gameData.charleston.directions[0]?.[0]
		if (nextDirection) {
			if (nextDirection.allAgree) {
				this.messageAll([], "roomActionGameplayAlert", "Round vote - passing " + nextDirection.direction, "success")
				this.setAllInstructions([], "Round Vote - Pass 3 tiles " + nextDirection.direction + " for another Charleston round. Pass 0 to block it. Tap tiles to add/remove from placemat. Hit Proceed when ready. " , "success")
			}
			else if (nextDirection.blind) {
				let term = "Blind"
				if (nextDirection.direction === "across") {
					term = "Courtesy"
				}
				this.messageAll([], "roomActionGameplayAlert", `The next pass is ${term.toLowerCase()} ${nextDirection.direction}` , {optional: true})
				this.setAllInstructions([], `${term} Pass - Pass ${(term==="Blind")?1:0}-3 tiles ${nextDirection.direction} ${(term === "Blind")?"in order of preference":""}. Tap tiles to add/remove from placemat. Hit Proceed when ready.` , "success")
			}
			else {
				this.messageAll([], "roomActionGameplayAlert", {format: "The next pass is %s", argsI18n: nextDirection.direction}, {optional: true})
				this.setAllInstructions([], {format: ["The next pass is %s", ". ", "The tiles passed to you are in the placemat - tap to move tiles between the placemat and your hand. Hit Proceed when ready. "], argsI18n: nextDirection.direction} , "success")
			}
		}
		else {
			this.messageAll([], "roomActionGameplayAlert", "The Charleston is Over")
			this.setInstructions(this.gameData.currentTurn.userTurn, {format: ["The Charleston is over", ". ", "\n\n", "As East wind, you get to make the first throw. ", "Select one tile and press Proceed."]})
			this.setAllInstructions([this.gameData.currentTurn.userTurn], {format: ["The Charleston is over", ". ", "Waiting on East Wind to make a play. "]})
			this.gameData.charleston = false //The charleston is over.
		}
	}
	else {
		this.gameData.previousTurnPickedUp = this.gameData.currentTurn.thrown //Used for in-hand mahjong detection.
		this.gameData.previousTurnThrower = this.gameData.currentTurn.userTurn

		//Handle this turn, and begin the next one.
		let priorityList = []
		for (let key in obj) {
			let res = getPriority.call(this, obj, key, exemptFromChecks.includes(key))
			if (res instanceof Array) {priorityList.push(res)}
		}
		//If anybody attempted to place, time to process them.
		let utilized = false; //Did we use the thrown tile?
		if (priorityList.length !== 0) {
			//Sort highest to lowest
			priorityList.sort((a, b) => {return b[0] - a[0]})
			for (let i=0;i<priorityList.length;i++) {
				let clientId = priorityList[i][1]
				let client = globalThis.serverStateManager.getClient(clientId)

				if (utilized === true) {
					client.message("roomActionPlaceTiles", "Placing tiles failed because another player had a higher priority placement (mahjong>match>sequence, and by order within category).", "error")
					continue;
				}

				let placement = obj[clientId]
				let hand = this.gameData.playerHands[clientId]

				//If placement succeeds, switch userTurn
				if (placement instanceof Sequence) {
					//Confirm that the sequence uses the thrown tile.
					let valid = false
					placement.tiles.forEach((tile) => {
						if (tile.value === this.gameData.currentTurn.thrown.value && tile.type === this.gameData.currentTurn.thrown.type) {
							valid = true
						}
					})
					console.log(valid)
					if (valid) {
						//Add the tile to hand, attempt to verify, and, if not, remove
						hand.add(this.gameData.currentTurn.thrown)
						if (hand.removeTilesFromHand(placement)) {
							utilized = true
							hand.add(placement)
							placement.exposed = true

							let message = "%(player)s placed a sequence of %(tile)s"
							let tileType = placement.tiles[0].type
							this.messageAll([clientId], "roomActionGameplayAlert", {format:message, args:{player:client.getNickname()}, argsI18n:{tile:tileType}}, {clientId, speech: "Chow"})
							client.message("roomActionGameplayAlert", {format:message, argsI18n:{player:"You", tile:tileType}}, {optional: true, durationMultiplier: 0.8})

							if (placement.mahjong) {
								this.goMahjong(clientId, {override: exemptFromChecks.includes(clientId)})
							}
							this.gameData.currentTurn.userTurn = clientId
						}
						else {
							hand.remove(this.gameData.currentTurn.thrown)
							client.message("roomActionPlaceTiles", "You can't place a sequence of tiles you do not possess - try reloading the page or restarting the app", "error")
						}
					}
					else {
						client.message("roomActionPlaceTiles", "Are you trying to hack? You must use the thrown tile when attempting to place off turn. ", "error")
					}
				}
				else if (placement instanceof Match) {
					//Confirm that the match uses the thrown tile
					if (placement.value === this.gameData.currentTurn.thrown.value && placement.type === this.gameData.currentTurn.thrown.type) {
						//We can just verify for on less tile here.

						if (hand.removeMatchingTilesFromHand(placement.getComponentTile(), placement.amount - 1)) {
							utilized = true
							hand.add(placement)
							placement.exposed = true
							let matchType = [,,"pair","pong","kong"][placement.amount]
							
							let tileObj = placement.tiles[0].toJSON()
							let message = "%(player)s placed a %(match)s of %(tile)s"
							this.messageAll([clientId], "roomActionGameplayAlert", {format:message, args:{player:client.getNickname(), tile:tileObj}, argsI18n:{match:matchType}, argsOption:{tile:localizeTileName}}, {clientId, speech: matchType})
							client.message("roomActionGameplayAlert", {format:message, args:{tile:tileObj}, argsI18n:{player:"You", match:matchType}, argsOption:{tile:localizeTileName}}, {optional: true, durationMultiplier: 0.8})

							if (placement.mahjong) {
								this.goMahjong(clientId, {override: exemptFromChecks.includes(clientId)})
							}
							if (placement.amount === 4) {
								//Draw them another tile.
								this.drawTile(clientId)
							}
							this.gameData.currentTurn.userTurn = clientId
						}
						else {
							console.log("Attempted to place invalid match")
							client.message("roomActionPlaceTiles", "You can't place a match of tiles you do not possess - try reloading the page or restarting the app", "error")
						}
					}
					else {
						client.message("roomActionPlaceTiles", "Are you trying to hack? You must use the thrown tile when attempting to place off turn. ", "error")
					}
				}
				else if (placement instanceof TileContainer && placement.tiles.length > 1) {
					//Confirm that the TileContainer uses the thrown tile.
					let valid = false
					placement.tiles.forEach((tile) => {
						if (tile.value === this.gameData.currentTurn.thrown.value && tile.type === this.gameData.currentTurn.thrown.type) {
							valid = true
						}
					})

					if (valid) {
						//Add the tile to hand, attempt to verify, and, if not, remove
						let orig = hand.contents.slice(0)
						hand.add(this.gameData.currentTurn.thrown)
						if (hand.removeTilesFromHand(placement)) {
							utilized = true
							hand.add(placement)

							let matchInfo = "match"
							let matchTile = placement.isValidMatch(true)
							if (matchTile) {
								matchInfo = [,,"pair","pong","kong","quint","sextet"][placement.tiles.length]
								matchInfo += " of " + matchTile.getTileName(this.state.settings.gameStyle) + "s"
							}

							matchInfo = " placed a " + matchInfo
							this.messageAll([clientId], "roomActionGameplayAlert", client.getNickname() + matchInfo, {clientId, speech: "I'll take that", durationMultiplier: 1.4})
							client.message("roomActionGameplayAlert", "You" + matchInfo, {optional: true, durationMultiplier: 0.8})

							if (placement.mahjong) {
								this.goMahjong(clientId, {override: exemptFromChecks.includes(clientId)})
							}
							if (placement.mahjong && client.isBot && this.state.settings.ignoreBotMahjong) {
								hand.contents = orig //Reverse the match - we don't want to end up with everything exposed where we can't throw.
							}
							else {
								this.gameData.currentTurn.userTurn = clientId //Either not for Mahjong or not reversed. Change turn.
							}
						}
						else {
							hand.remove(this.gameData.currentTurn.thrown)
							client.message("roomActionPlaceTiles", "You can't place tiles you do not possess - try reloading the page or restarting the app", "error")
						}
					}
					else {
						client.message("roomActionPlaceTiles", "Are you trying to hack? You must use the thrown tile when attempting to place off turn. ", "error")
					}
				}
				else if (placement.mahjong) {
					//Attempt a naked mahjong - user didn't provide what to do.
					console.log("Attempting Naked Mahjong")
					hand.add(this.gameData.currentTurn.thrown)
					//Autoexpose to indicate we may need to automatically move something from in hand to expose.
					this.goMahjong(clientId, {override: exemptFromChecks.includes(clientId), autoExpose: true})
					utilized = true
				}
				else if (placement === "Claim") {
					if (utilized === true) {
						client.message("roomActionPlaceTiles", "This tile was called - your draw was skipped. ", "error")
						continue;
					}
					utilized = true
					let tile = this.gameData.currentTurn.thrown
					hand.add(tile)
					this.lastDrawn = tile
					this.gameData.currentTurn.userTurn = clientId
					let tileObj = tile.toJSON()
					let message = {format:"%(player)s called for a %(tile)s", args:{player:client.getNickname(), tile:tileObj}, argsOption:{tile:localizeTileName}}
					this.messageAll([], "roomActionGameplayAlert", message, {clientId, speech: "I'll take that tile"})
				}
				else {
					console.error("No known operation to perform when processing turn. ")
				}
			}
		}

		if (utilized === false) {
			this.gameData.previousTurnThrower = this.gameData.previousTurnPickedUp = undefined

			//Shift to next player, draw them a tile.
			let nextWind = windOrder[(windOrder.indexOf(this.gameData.playerHands[this.gameData.currentTurn.userTurn].wind) + 1)%4]

			for (let clientId in this.gameData.playerHands) {
				let hand = this.gameData.playerHands[clientId]
				if (hand.wind === nextWind) {
					//Pick up as 4th tile for an exposed pong if possible.
					//TODO: Consider notifying people when the 4th tile is added. We currently don't do this, because it is just points, so shouldn't really impact
					//gameplay, and the message can't currently be sent to the person who gained the pickup, as they receive tile pickup message too.
					hand.contents.forEach((item) => {
						if (!this.state.settings.allow4thTilePickup) {return}
						if (item instanceof Match && item.type === this.gameData.currentTurn.thrown.type && item.value === this.gameData.currentTurn.thrown.value) {
							utilized = true
							item.amount = 4
						}
					})

					//Switch the turn, and draw the next tile.
					if (utilized === false) {
						this.gameData.discardPile.push(this.gameData.currentTurn.thrown)
						this.drawTile(clientId)
					}
					else {
						this.drawTile(clientId)
					}

					this.gameData.currentTurn.userTurn = clientId
				}
			}
		}

		if (!(this.gameData.isMahjong || this.gameData.wall.isEmpty)) {
			let currentTurnClient = globalThis.serverStateManager.getClient(this.gameData.currentTurn.userTurn)

			this.setAllInstructions([currentTurnClient.clientId], {format: ["Waiting on %s to make a move. ", "\n\n", "Is someone's game frozen? Clicking the sync icon (below this message) might fix that! "], args:currentTurnClient.getNickname()})
		}

		this.gameData.currentTurn.thrown = false
	}

	//Clear the object.
	for (let key in obj) {delete obj[key]}
	this.sendStateToClients()
}

let exemptFromChecks = []

module.exports = function(obj, prop, value) {
	obj[prop] = value
	//Remove invalid assignments. getPriority will issue error messages to clients as needed.
	if (getPriority.call(this, obj, prop, exemptFromChecks.includes(prop)) === false) {
		delete obj[prop]
		if (globalThis.serverStateManager.getClient(prop).isBot) {
			console.error("Bots are not allowed to obtain override power. ", this.logFileSaveId)
		}
		else {
			exemptFromChecks.push(prop) //We will only block a client once per turn. Successive attempts will be treated as overrides.
		}
	}

	//The user can never pick up their own discard tile, hence is always "Next", except during charleston
	if (!this.gameData.charleston) {
		obj[this.gameData.currentTurn.userTurn] = "Next"
	}

	if (Object.keys(obj).length === 4) {
		calculateNextTurn.call(this, obj, exemptFromChecks)
		exemptFromChecks = []
	}
	else {
		//Calculate who hasn't entered an action.
		let guiltyParties = []
		this.clientIds.slice(0, 4).forEach((clientId) => {
			if (!obj[clientId]) {
				guiltyParties.push(clientId)
			}
		})

		let guiltyPartyNames = guiltyParties.map((clientId) => {
			return globalThis.serverStateManager.getClient(clientId).getNickname()
		})

		let message = {format: ["Waiting on: %s", "\n\n", "Is someone's game frozen? Clicking the sync icon (below this message) might fix that! "], args: guiltyPartyNames.join(", ")}

		this.setAllInstructions(guiltyParties, message) //Message everybody that has entered a turn - don't overwrite other instructions.
	}

	return true
}
