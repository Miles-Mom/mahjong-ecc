const {createTiles, allSuits, allSuitArrangements, oddOptions, evenOptions, allOptions, dragonOptions, dragonArrangments, suitDragonConversion}
= require("../utilities.js");

//TODO: Confirm these score valuations.

//Each function will return an array. Each array will contain every possible matching combo in the form of an array of tiles.
module.exports = [
	function(tiles = []) {
		allSuits.forEach((suit) => {
			[0, 4].forEach((offset) => {
				let newArr = []
				tiles.push(newArr)

				newArr.push(createTiles({type: suit, value: 1+offset, amount: 2}))
				newArr.push(createTiles({type: suit, value: 2+offset, amount: 2}))
				newArr.push(createTiles({type: suit, value: 3+offset, amount: 3}))
				newArr.push(createTiles({type: suit, value: 4+offset, amount: 3}))
				newArr.push(createTiles({type: suit, value: 5+offset, amount: 4}))
			})
		})

		return {
			tiles,
			score: 25,
			concealed: false
		}
	},
	function(tiles = []) {
		allOptions.slice(0, -2).forEach((offset) => {
			allSuitArrangements.forEach((suitOrder) => {
				let newArr = []
				tiles.push(newArr)

				newArr.push(createTiles({type: "flower", value: "4", amount: 4})) //Value is no-op here.
				newArr.push(createTiles({type: suitOrder[0], value: offset, amount: 4}))
				newArr.push(createTiles({type: suitOrder[1], value: 1+offset, amount: 2}))
				newArr.push(createTiles({type: suitOrder[2], value: 2+offset, amount: 4}))
			})

			//Part two of option
			allSuits.forEach((suit) => {
				let newArr = []
				tiles.push(newArr)

				newArr.push(createTiles({type: "flower", value: "4", amount: 4})) //Value is no-op here.
				newArr.push(createTiles({type: suit, value: offset, amount: 4}))
				newArr.push(createTiles({type: suit, value: 1+offset, amount: 2}))
				newArr.push(createTiles({type: suit, value: 2+offset, amount: 4}))
			})
		})

		return {
			tiles,
			score: 25,
			concealed: false
		}
	},
].map((func, index) => {
	let output = func()
	output.cardIndex = index
	output.section = "Consecutive Run"
	return output
})
