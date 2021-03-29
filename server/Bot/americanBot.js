const Tile = require("../../src/Tile.js")
const Hand = require("../../src/Hand.js")
const Match = require("../../src/Match.js")
const Pretty = require("../../src/Pretty.js")
const TileContainer = require("../../src/TileContainer.js")
const utilities = require("../american/utilities.js")

function evaluateNextMove() {
	let room = this.getRoom()

	if (room.inGame === false) {return} //Nothing for us to do not in a game.

	let gameData = room.gameData
	let currentHand = gameData.playerHands[this.clientId]

	if (gameData.currentTurn.turnChoices[this.clientId]) {return}; //We are ready for this turn.

	//Call room.onPlace properly.
	let placeTiles = (function placeTiles(tiles = [], goMahjong) {
		if (!(tiles instanceof Array)) {tiles = [tiles]}
		room.onPlace({
			mahjong: goMahjong || undefined,
			swapJoker: true, //Special parameter for bots - auto-swaps when possible.
			type: "roomActionPlaceTiles",
			message: tiles = tiles.map((tile) => {return tile.toJSON()})
		}, this.clientId)
	}).bind(this)

	console.log(currentHand.contents)
	let analysis = utilities.getTileDifferential(gameData.card, currentHand.contents)
	console.log(analysis[0])
	console.log(analysis[1])

	//Find tiles not used in any of the top combos if possible - that way we don't sabotage our next best options.
	function getTopTiles(analysis, maxAmount, noJokers = false) {
		maxAmount = Math.max(1, maxAmount)

		let toThrow = analysis[0].notUsed.slice(0)

		if (noJokers) {toThrow = toThrow.filter((item) => {
			return item.type !== "joker"
		})}

		//We start at item 0 to give the joker elimination code a chance to run.
		analysisLoop:
		for (let i=0;i<analysis.length;i++) {
			let analysisItem = analysis[i]

			for (let i=0;i<toThrow.length;i++) {
				if (toThrow.length <= maxAmount) {
					break analysisLoop;
				}

				let toThrowItem = toThrow[i]

				//If this item does not exist in notUsed, it is needed for one of the top hands.
				//Therefore, we shouldn't throw it.

				let index;

				if (toThrowItem.type === "joker") {
					//We will throw jokers only when there are no other options.
					index = -1
				}
				else {
					index = analysisItem.notUsed.findIndex((item) => {
						return item.matches(toThrowItem)
					})
				}

				if (index === -1) {
					//Remove the item from toThrow
					toThrow.splice(i, 1)
					i--
				}

			}
		}

		//If there is only a small number of possible hands given exposures, we might have more than maxAmount tiles.
		//In that case, we'll eliminate some. This is currently done at random.

		while (maxAmount < toThrow.length) {
			toThrow.splice(Math.floor(Math.random() * toThrow.length), 1)
			console.warn("Randomly Filtering")
		}

		return toThrow
	}

	if (gameData.charleston) {
		let round = gameData.charleston.directions[0][0]

		if (round.blind) {
			//Blind pass. Pass as many as notUsed, 3 max.
			placeTiles(getTopTiles(analysis, 3, true))
		}
		else if (getTopTiles(analysis, 3, true).length >= 3) {
			//We can pass 3 tiles. Pass them. TODO: Consider if we want to require more than 3 for allAgree rounds.
			placeTiles(getTopTiles(analysis, 3, true))
		}
		else if (round.allAgree) {
			//We can't produce 3 tiles without throwing ones we want. Kill the round.
			placeTiles([])
		}
		else {
			//We must produce exactly 3 tiles. notUsed has less than 3 tiles.
			//We must not pick jokers.
			let passing = []

			//We will pass every tile in notUsed. Remove them from the hand when picked.
			getTopTiles(analysis, 3, true).forEach((item) => {
				passing.push(item)
				currentHand.remove(item)
			})

			//Pick randomly from remaining tiles until we have 3 tiles to pass.
			while (passing.length < 3) {
				let removed = currentHand.contents[Math.floor(Math.random() * currentHand.contents.length)] //Random pick.
				if (removed.type === "joker") {continue} //This should never get stuck, as there are only 8 jokers, and we are in charleston.

				passing.push(removed)
				currentHand.remove(removed)
			}

			//Restore the removed tiles and pass them.
			passing.forEach((item) => {
				currentHand.add(item)
			})

			placeTiles(passing)
		}

	}
	else if (gameData.currentTurn.userTurn === this.clientId) {
		//We need to choose a discard tile.
		//In American Mahjong, charleston starts automatically, so there is nothing needed to initiate charleston.
		if (analysis[0].notUsed.length > 0) {
			let tile = getTopTiles(analysis, 1)
			placeTiles(tile)
		}
		else if (analysis[0].diff === 0) {
			placeTiles([], true) //Go Mahjong
		}
		else {
			console.error("Bot hand appears to be dead. Initiating emergency pick. ") //TODO: If we start checking exposed tiles in the future,

			if (!currentHand.contents.some((tile) => {
				if (tile instanceof Tile) {
					placeTiles(tile)
					return true
				}
			})) {
				throw "Bot was unable to choose a discard tile. "
			}
		}
	}
	else if (gameData.currentTurn.thrown) {
		if (gameData.currentTurn.thrown.type === "joker") {return placeTiles([])} //Can't pick up a joker.

		//We need to evaluate if we pick up the thrown tile.
		//Take another analysis with the additional tile.
		let withTileAnalysis = utilities.getTileDifferential(gameData.card, currentHand.contents.concat(gameData.currentTurn.thrown))
		console.log(withTileAnalysis)
		console.log(withTileAnalysis[0])

		if (withTileAnalysis[0].handOption.concealed && withTileAnalysis[0].diff !== 0) {
			//The top hand including this tile would be concealed, and it would not be for Mahjong.
		}
		else if (withTileAnalysis.some((withTileAnalysisItem) => {
				if (withTileAnalysisItem.diff < analysis[0].diff) {
					console.log(withTileAnalysisItem)
					//Claiming this tile would put us closer to Mahjong.

					//Now we need to confirm we actually can claim it.
					//Jokers will complicate this.

					//First, determine what match this tile would be going into, to tell if jokers can be used.
					let match = withTileAnalysisItem.handOption.tiles.find((arr) => {
						if (arr[0].matches(gameData.currentTurn.thrown)) {
							return true
						}
					})

					console.warn("Want Tile")
					if (match) {
						console.log(match)

						let tilesToPlace = []

						//If this tile is beneficial, we shouldn't have enough of it, so don't need to check against match length here.
						currentHand.contents.forEach((item) => {
							if (match[0].matches(item)) {
								tilesToPlace.push(item)
							}
						})
						console.log(tilesToPlace)

						if (match.length > 2) {
							currentHand.contents.forEach((item) => {
								if (tilesToPlace.length !== match.length - 1) {
									if (item.type === "joker") {
										tilesToPlace.push(item)
									}
								}
							})

							console.log(tilesToPlace)

							if (tilesToPlace.length === match.length - 1) {
								placeTiles(tilesToPlace.concat(gameData.currentTurn.thrown))
								return true
							}
							else {console.warn("Continuing")}
						}
						else if (withTileAnalysisItem.diff === 0) {
							//Can only pick up for Mahjong.
							if (tilesToPlace.length === match.length - 1) {
								placeTiles(tilesToPlace.concat(gameData.currentTurn.thrown), true)
								return true
							}
							else {console.warn("Continuing Needs Mahjong")}
						}
						else {console.warn("Mahj only. Continuing. ")}
					}
					else {console.warn("Something odd happened, probably in sorting, causing a match not including the thrown tile to be provided. ")}
				}
			})
		) {console.warn("Returned");return}

		placeTiles([])
	}
}

module.exports = evaluateNextMove
