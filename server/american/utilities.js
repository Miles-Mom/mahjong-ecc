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
		let exposedMatches = 0

		processHandItems:
		for (let i=0;i<hand.length;i++) {
			let handItem = hand[i]

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

			if (handItem instanceof TileContainer) {handItem = handItem.tiles}
			if (handItem instanceof Array) {
				if (handOption.concealed === true) {
					//Tiles are exposed! Label this! We'll check later to verify too much isn't exposed.
					exposedMatches++
				}

				for (let i=0;i<handItem.length;i++) {
					if (!removeItem(handItem[i])) {
						diff = Infinity
						break processHandItems;
					}
				}
			}
			else {
				removeItem(handItem)
			}
		}

		if (diff !== Infinity) {
			diff = noFillJoker.length + Math.max(0, canFillJoker.length - jokerCount)

			if (handOption.concealed && !(exposedMatches === 0 || (exposedMatches === 1 && diff === 0))) {
				diff = Infinity
				console.warn("Hand Requires Concealed, Combo Disabled")
			}
			else {
				results.push({
					diff, handOption
				})
			}
		}
	}

	return results.sort((function(a,b) {
		//Some hands can be Mahjong in multiple different ways, with differing point values (2020 card, Quints #3, 13579 #1). 
		//I'm not aware of any cases where concealed would end up being checked and making a difference at the moment.

		if (a.diff !== b.diff) {return a.diff - b.diff} //Sort by closest to Mahjong
		else if (b.handOption.score !== a.handOption.score) {return b.handOption.score - a.handOption.score} //If same distance, sort by score.
		else {
			return Number(a.handOption.concealed) - Number(b.handOption.concealed) //Return exposed before concealed.
		}
	}))
}


function outputExpander(combos) {
	console.time("Expand")
	let output = []
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

		let checkForDuplicates = true
		//Duplicate checking slows stuff down quite a bit - it is a one time cost, but if it is too slow, it might need
		//to be optimized even more, to only run on specific combos, etc.

		let uniqueCombos = []
		for (let i=0;i<comboOutput.length;i++) {
			let combo = comboOutput[i]

			if (checkForDuplicates && getTileDifferential(uniqueCombos, combo.tiles)[0]?.diff === 0) {
				console.warn("Removed Duplicate Combo", combo)
			}
			else {
				uniqueCombos.push(combo)
			}
		}

		output.push(...uniqueCombos)
	})
	console.timeEnd("Expand")
	return output
}


module.exports = {createTiles, allSuits, allSuitArrangements, oddOptions, evenOptions, allOptions, dragonOptions, dragonArrangments, suitDragonConversion, outputExpander, getTileDifferential}
