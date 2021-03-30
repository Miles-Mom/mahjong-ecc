const Tile = require("../../src/Tile.js")
const TileContainer = require("../../src/TileContainer.js")

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

				let itemValue = handItem.find((item) => {
					return item.type !== "joker"
				})

				for (let i=0;i<handItem.length;i++) {
					//These items may have jokers acting as something - if they are exposed, they are stuck unless we swap them.
					//We treat the jokers like the tile it serves as - that way, if we get another copy, the new copy goes in notUsed
					if (!removeItem(itemValue)) {
						diff = Infinity //The hand is impossible with current exposures.
						break processHandItems;
					}
				}

				if (removeItem(itemValue)) {
					//If the current exposures are less than what is needed - we exposed a pong, but need a kong,
					//the hands is ALSO impossible. If we can remove another item for something exposed, this won't work.
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
			//We could take a different approach - add jokers until we can't use them -
			//however this approach, while making recovery plans worse,
			//increases the odds of no joker point doubles.
			if (jokerCount > canFillJoker.length) {
				notUsed.push(new Tile({type: "joker", value: ""}))
				jokerCount--
			}

			results.push({
				diff, handOption, noFillJoker, canFillJoker, notUsed, jokerCount
			})
		}
	}

	return results.sort((function(a,b) {
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
		function getUncallableTiles(hand) {
			//Can call for the last tile, so minus 1
			if (hand.handOption.concealed) {
				return Math.max(0, hand.diff - 1) //Diff excludes joker-replacable tiles.
			}
			else {
				let uncallableMatches = hand.handOption.tiles.filter((item) => {return item.length < 3})

				//We won't penalize for joker replaced tiles - those are, in effect, already in hand.
				let uncallableTiles = [hand.noFillJoker, Math.max(0, hand.canFillJoker - hand.jokerCount)].reduce((sum, tiles) => {
				    for (let i=0;i<tiles.length;i++) {
						let tile = tiles[i]
						if (uncallableMatches.some((match) => {
							return tile.matches(match[0])
						})) {sum++}
					}
					return sum
				}, 0)

				return Math.max(0, uncallableTiles - 1)
			}
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
}


function outputExpander(combos) {
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
			comboOutput.push(obj)
		})

		//Combos might include duplicate outputs - while they wouldn't if they were ideally designed, using the first two
		//of three set permutations is extremely useful, generating extra possibilities as a side effect.

		//We don't currently check for duplicate outputs outside of combos.

		//Duplicate checking slows stuff down quite a bit - it is a one time cost, but if it is too slow, it might need
		//to be optimized even more, to only run on specific combos, etc.

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
	})
	console.timeEnd("Expand")
	if (duplicatesRemoved) {
		console.warn("Removed " + duplicatesRemoved +  " Duplicate Combos")
	}
	return output
}


module.exports = {createTiles, allSuits, allSuitArrangements, oddOptions, evenOptions, allOptions, dragonOptions, dragonArrangments, suitDragonConversion, outputExpander, getTileDifferential}
