const Tile = require("../../src/Tile.js")
const Hand = require("../../src/Hand.js")
const Match = require("../../src/Match.js")
const Pretty = require("../../src/Pretty.js")
const TileContainer = require("../../src/TileContainer.js")
const utilities = require("../american/utilities.js")

const SeedRandom = require("seed-random")

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

	//Bot difficulty settings.
	//While the max settings really aren't broken - bots can still get locked into impossible hands (dead tiles),
	//and aren't aware of what others are doing, that is counterbalanced by their superhuman analysis abilities.
	//Since in single player modes, people want to win quite a bit of the time, we're going to balance it out a bit more.
	let botDifficultyConfig = {
		botDifficulty: room.state.settings.americanBotDifficulty
	}

	let expo = 50
	botDifficultyConfig.cardPercentage = (100/expo) * (expo ** (botDifficultyConfig.botDifficulty/100))

	botDifficultyConfig.maxAnalysisRounds = Infinity
	if (botDifficultyConfig.botDifficulty < 100) {
		botDifficultyConfig.maxAnalysisRounds = Math.max(1, 100 * 0.7**(100-botDifficultyConfig.botDifficulty))
	}

	botDifficultyConfig.averageAnalyzedCharlestonTiles = 3 - (1.5 * (100 - botDifficultyConfig.botDifficulty) / 100) //Bots will be forced to randomly charleston some tiles.



	//We'll only filter the card once, and store it for later.
	//This is extremely cheap normally, but can take a few milliseconds with tons of combos (Marvelous hands)
	//Easy small speedup.
	let cardToUse = this._cardToUse
	let seed = this.clientId + room.state.seed //We need the same random tiles every time, even reloading from state.
	if (!cardToUse || cardToUse.seed !== seed) {

		cardToUse = gameData.card.combos

		let maxHands = 1000 //Marvelous has a huge number of hands. We'll clamp the bots down.
		botDifficultyConfig.cardPercentage = botDifficultyConfig.cardPercentage / Math.max(1, cardToUse.length / maxHands)

		//Reduce bot card proportion.
		if (botDifficultyConfig.cardPercentage < 100) {
			let filterSeedRandom = SeedRandom(seed)
			cardToUse = cardToUse.filter((item, index) => {
				if (!index) {return true} //Make sure there is always at least one combo - zero combos would crash.
				return (filterSeedRandom() * 100) < botDifficultyConfig.cardPercentage
			})
		}

		cardToUse.seed = seed
		this._cardToUse = cardToUse

		setTimeout((function() {
			//Clear this._cardToUse after an hour - should help free a bit of memory.
			delete this._cardToUse
		}).bind(this), 1000 * 60 * 60)
	}

	//Deterministic RNG
	let turnSeed = seed + room?.gameData?.wall?.tiles?.[0]
	let turnSeededRng = SeedRandom(turnSeed)
	console.log(turnSeed)


	let allowedAnalysisTiles = Math.floor(botDifficultyConfig.averageAnalyzedCharlestonTiles + turnSeededRng())
console.time("Analyze")
	let analysis = utilities.getTileDifferential(cardToUse, currentHand.contents)
	console.timeEnd("Analyze")

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
				if (i > botDifficultyConfig.maxAnalysisRounds) {
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
			toThrow.splice(Math.floor(turnSeededRng() * toThrow.length), 1)
		}

		return toThrow
	}

	if (gameData.charleston) {
		let round = gameData.charleston.directions[0][0]

		if (round.blind) {
			//Blind pass. Pass as many as notUsed, 3 max.
			//TODO: We want to analyze at most allowedAnalysisTiles, but want to pass 3 to a person if they send us 3.
			//So analyze allowedAnalysisTiles, rest random is probably best.
			placeTiles(getTopTiles(analysis, allowedAnalysisTiles, true))
		}
		else if (round.allAgree && getTopTiles(analysis, 3, true).length < 3) {
			//TODO: Consider if we want to require more than 3 for allAgree rounds.
			//We can't produce 3 tiles without throwing ones we want. Kill the round.
			placeTiles([])
		}
		else {
			//We must produce exactly 3 tiles. We must not pick jokers.
			let passing = []

			//We will pass every tile in notUsed. Remove them from the hand when picked.
			getTopTiles(analysis, allowedAnalysisTiles, true).forEach((item) => {
				passing.push(item)
				currentHand.remove(item)
			})

			//Pick randomly from remaining tiles until we have 3 tiles to pass.
			while (passing.length < 3) {
				let removed = currentHand.contents[Math.floor(turnSeededRng() * currentHand.contents.length)] //Random pick.
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
		if (analysis[0]?.notUsed?.length > 0) {
			let tile = getTopTiles(analysis, 1)
			placeTiles(tile)
		}
		else if (analysis[0]?.diff === 0) {
			placeTiles([], true) //Go Mahjong
		}
		else {
			//Our hand should only be dead if we start checking exposed tiles in the future.
			//Otherwise, we should never make a move that would make us dead by our detection.
			console.error("Bot hand appears to be dead. Initiating emergency pick. ")
			throw "Hand is Dead"

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
		let withTileAnalysis = utilities.getTileDifferential(cardToUse, currentHand.contents.concat(gameData.currentTurn.thrown))

		//We should ALWAYS have one handOption available, given how we do not analyze discards,
		//and an additional tile not in a match shouldn't remove any possibilities,
		if (!withTileAnalysis[0]) {
			throw "Bot Hand is Dead"
		}
		else if (withTileAnalysis[0].handOption.concealed && withTileAnalysis[0].diff !== 0) {
			//The top hand including this tile would be concealed, and it would not be for Mahjong.
		}
		else if (withTileAnalysis.some((withTileAnalysisItem) => {
				if (withTileAnalysisItem.diff < analysis[0].diff) {
					//Claiming this tile would put us closer to Mahjong.

					//TODO: There are still some issues with hands like 2021 #3, where we need a kong,
					//but that kong must include at least one joker, or we make our hand dead. (As 5 total are needed, 1 single, 1 kong)

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

						if (match.length > 2) {
							currentHand.contents.forEach((item) => {
								if (tilesToPlace.length !== match.length - 1) {
									if (item.type === "joker") {
										tilesToPlace.push(item)
									}
								}
							})

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
							else {console.warn("Continuing Needs Mahjong")} //Can't really think of when this would trigger?
						}
						else {console.warn("Mahj only. Continuing. ")}
					}
					else {
						console.warn(gameData.currentTurn.thrown, currentHand.contents, analysis[0], withTileAnalysisItem)
						console.warn("Something odd happened, probably in sorting, causing a match not including the thrown tile to be provided. ")
					}
				}
			})
		) {console.warn("Returned");return}

		placeTiles([])
	}
}

module.exports = evaluateNextMove
