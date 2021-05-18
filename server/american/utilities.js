const Tile = require("../../src/Tile.js")
const TileContainer = require("../../src/TileContainer.js")
const Wall = require("../../src/Wall.js")

//https://stackoverflow.com/a/30551462/10965456
function permutations(xs) {
  if (!xs.length) return [[]];
  return xs.flatMap((x, i) => {
     return permutations(xs.filter((v, j) => i!==j)).map(vs => [x, ...vs]);
  });
}

function createTiles({type, value, amount}) {
	//Temporarily tileName for debugging with console.log
	let tile = new Tile({type, value})
	return new Array(amount).fill(tile) //Not seperate objects, but should be OK.
}

var allSuits = ["bamboo", "character", "circle"]
var allSuitArrangements = permutations(allSuits)
var oddOptions = [1,3,5,7,9]
var evenOptions = [2,4,6,8]
var allOptions = oddOptions.concat(evenOptions).sort()
let windOptions = ["north", "east", "west", "south"]

//Dragons are associated with a suit.
var dragonOptions = ["red", "green", "white"]
var dragonArrangments = permutations(dragonOptions)
var suitDragonConversion = {
	"character": "red",
	"bamboo": "green",
	"circle": "white"
}

function getTileDifferential(handOptions, hand) {
	//getTileDifferential takes an array of tiles are determines how many tiles away hand is
	//from every achivable handOption (TODO: Allow passing remaining wall tiles / already exposed tiles)

	if (handOptions.combos) {
		//A card was passed, instead of an array.
		handOptions = handOptions.combos
	}

	let results = []

	for (let i=0;i<handOptions.length;i++) {
		let handOption = handOptions[i]

		let canFillJoker = []
		let noFillJoker = []

		handOption.tiles.forEach((item) => {
			if (item.length <= 2) {
				noFillJoker.push(...item)
			}
			else {
				canFillJoker.push(...item)
			}
		})

		let jokerCount = 0
		let diff;
		let exposedMatches = 0 //May not be used anymore - was supposed to be used to detect where concealed hands were an issue.

		let notUsed = [] //Used to return which tiles should be thrown for this hand. TODO: This slows things down quite a bit.

		//We need TileContainers and Arrays to be processed first, as those can't be discarded.
		function removeItem(item) {
			if (item.type === "joker") {
				++jokerCount
				return true
			}

			//TODO: The splice and search should be able to be optimized.
			let noFillIndex = noFillJoker.findIndex((tile) => {return tile.matches(item)})
			if (noFillIndex !== -1) {
				noFillJoker.splice(noFillIndex, 1)
				return true
			}

			let canFillIndex = canFillJoker.findIndex((tile) => {return tile.matches(item)})
			if (canFillIndex !== -1) {
				canFillJoker.splice(canFillIndex, 1)
				return true
			}

			return false
		}

		processHandItems:
		for (let i=0;i<hand.length;i++) {
			let handItem = hand[i]

			if (handItem instanceof TileContainer) {handItem = handItem.tiles}
			if (handItem instanceof Array) {
				if (handOption.concealed === true) {
					//Tiles are exposed! Label this! We'll check later to verify too much isn't exposed.
					exposedMatches++
				}

				//Like in the 2021 card, with 2021 #3, it is possible for the same tile to be used in multiple different
				//matches - therefore, we must verify that such a match exists in the target hand.
				//TODO: 2021 #3 still has issues - we remove the kong from noFillJoker instead of canFillJoker,
				//and we also would take a kong when possible, yet a kong makes the hand dead (need 1+ jokers in kong)

				let itemValue = TileContainer.isValidMatch(handItem, true) //True to allow jokers when matching.

				if (handOption.tiles.some((item) => {
					if (!itemValue) {return true} //This exposure must be a bunch of individual tiles, like a 2019.
					else if (item.length === handItem.length && itemValue.matches(TileContainer.findNonJoker(item))) {
						return true
					}
					else {return false}
				})) {
					//It exists! Now remove the tiles.

					for (let i=0;i<handItem.length;i++) {
						let tile = handItem[i]

						if (tile.type === "joker") {
							//The jokers in this match are acting as something. (It must be a pong, kong, etc, to have jokers)
							tile = itemValue
						}

						if (!removeItem(tile)) {
							diff = Infinity //The hand is impossible with current exposures.
							break processHandItems;
						}
					}
				}
				else {
					diff = Infinity
					break processHandItems;
				}
			}
		}

		if (diff !== Infinity) {

			for (let i=0;i<hand.length;i++) {
				let handItem = hand[i]

				if (handItem instanceof TileContainer || handItem instanceof Array) {}
				else {
					if (!removeItem(handItem)) {
						notUsed.push(handItem) //TODO: If we have a joker acting as this item, put it at the beginning.
					}
				}
			}

			diff = noFillJoker.length + Math.max(0, canFillJoker.length - jokerCount)

			//This check was preventing the removal of duplicates.

			/*if (handOption.concealed && !(exposedMatches === 0 || (exposedMatches === 1 && diff === 0))) {
				diff = Infinity
				console.warn("Hand Requires Concealed, Combo Disabled")
				continue;
			}*/

			//Add jokers that we aren't using to fill anything
			//We could take a different approach - attempt to use every joker, and discard the actual tile first,
			//however the current approach, while making recovery plans worse (discards jokers that we could keep),
			//increases the odds of no joker point doubles (compared to discarding the actual tile and stashing jokers).
			if (jokerCount > canFillJoker.length) {
				notUsed.push(new Tile({type: "joker", value: ""}))
				jokerCount--
			}

			results.push({
				diff, handOption, noFillJoker, canFillJoker, notUsed, jokerCount
			})
		}
	}

	results = results.sort((function(a,b) {
		//Some hands can be Mahjong in multiple different ways, with differing point values (Example: 2020 card, Quints #3, 13579 #1).
		//Therefore, we should sort, in case one hand is more valuable.

		//TODO: These penalties should be lower earlier in charleston.

		//Apply some weighting to reduce the overuse of concealed and jokerless hands.
		let uncallablePenalty = 0.15 //Point penalty per unfilled spot that can't be called for.
		let noJokerPenalty = 0.15 //Point penalty per unfilled spot that requires a non-joker.

		//TODO: We need small penalties against quints, which require jokers.

		let diffA = a.diff
		let diffB = b.diff

		//Give a benefit for hands where we can call for tiles.
		//TODO: Penalize singular remaining tiles less than pairs.
		//TODO: Penalize for callable, but not now, vs never callale.

		function getUncallableTiles(hand) {
			//This function is called so much it is insanely expensive. Cache per hand.

			//Can call for the last tile, so minus 1
			if (hand.handOption.concealed) {
				return Math.max(0, hand.diff - 1) //Diff excludes joker-replacable tiles.
			}
			else if (hand.uncallableTiles === undefined) {
				let uncallableMatches = hand.handOption.tiles.filter((item) => {return item.length < 3})

				function _calculateUncallableTiles(tiles) {
					let sum = 0;
					for (let i=0;i<tiles.length;i++) {
						let tile = tiles[i]
						if (uncallableMatches.some((match) => {
							return tile.matches(match[0])
						})) {sum++}
					}
					return sum
				}

				//We won't penalize for joker replaced tiles - those are, in effect, already in hand.
				let uncallableTiles = _calculateUncallableTiles(hand.noFillJoker) + Math.max(0, _calculateUncallableTiles(hand.canFillJoker) - hand.jokerCount)

				hand.uncallableTiles = Math.max(0, uncallableTiles - 1)
			}
			return hand.uncallableTiles
		}

		diffA += getUncallableTiles(a) * uncallablePenalty
		diffB += getUncallableTiles(b) * uncallablePenalty

		//Give a penalty to the hands that need non-joker tiles.
		diffA += a.noFillJoker.length * noJokerPenalty
		diffB += b.noFillJoker.length * noJokerPenalty

		//For Debugging and Analysis.
		a.weightedDiff = diffA
		b.weightedDiff = diffB

		if (diffA !== diffB) {return diffA - diffB} //Sort by closest to Mahjong

		return b.handOption.score - a.handOption.score //Sort by score.
	}))
	return results
}


function outputExpander(combos, options = {}) {
	console.time("Expand")
	let output = []

	let duplicatesRemoved = 0

	combos.forEach((combo) => {
		//combo composes all the possibilities that one item on the card can be
		let comboOutput = []
		combo.tiles.forEach((tileCombo) => {
			//Create a seperate object for each possibility
			let obj = Object.assign({}, combo)
			obj.tiles = tileCombo
			if (obj.tiles.flat().length !== 14) {throw "Invalid Combo"}
			comboOutput.push(obj)
		})

		//Combos might include duplicate outputs - while they wouldn't if they were ideally designed, using the first two
		//of three set permutations is extremely useful, generating extra possibilities as a side effect.

		//We don't currently check for duplicate outputs outside of combos.

		//Duplicate checking slows stuff down quite a bit - it is a one time cost, but if it is too slow, it might need
		//to be optimized even more, to only run on specific combos, etc.
		if (!combo.skipDuplicateRemoval) {
			let uniqueCombos = []
			for (let i=0;i<comboOutput.length;i++) {
				let combo = comboOutput[i]
				if (getTileDifferential(uniqueCombos, combo.tiles)[0]?.diff === 0) {
					duplicatesRemoved++
				}
				else {
					uniqueCombos.push(combo)
				}

			}
			output.push(...uniqueCombos)
		}
		else {
			//Marvelous hands easily blow the duplicate remover to pieces. It's quadratic.
			console.warn("Skipping Duplicate Removal")
			delete combo.skipDuplicateRemoval
			output.push(...comboOutput)
		}
	})
	console.timeEnd("Expand")
	if (duplicatesRemoved) {
		console.warn("Removed " + duplicatesRemoved +  " Duplicate Combos")
	}
	return output
}

let nonJokerTiles = Wall.getNonPrettyTiles(1)
nonJokerTiles.push(new Tile({type: "flower"}))

module.exports = {nonJokerTiles, createTiles, allSuits, allSuitArrangements, oddOptions, evenOptions, allOptions, windOptions, dragonOptions, dragonArrangments, suitDragonConversion, outputExpander, getTileDifferential}
