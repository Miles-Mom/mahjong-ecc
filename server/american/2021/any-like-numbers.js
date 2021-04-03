const {createTiles, allSuits, allSuitArrangements, oddOptions, evenOptions, allOptions, dragonOptions, dragonArrangments, windOptions, suitDragonConversion}
= require("../utilities.js");

//Each function will return an array. Each array will contain every possible matching combo in the form of an array of tiles.
module.exports = [
	function(tiles = []) {
		allOptions.forEach((offset) => {
			allSuitArrangements.forEach((suitOrder) => {
				let newArr = []
				tiles.push(newArr)

				newArr.push(createTiles({type: "flower", value: "4", amount: 2})) //Value is no-op here.

				newArr.push(createTiles({type: suitOrder[0], value: offset, amount: 4}))
				newArr.push(createTiles({type: suitOrder[1], value: offset, amount: 4}))

				newArr.push(createTiles({type: "wind", value: "north", amount: 1}))
				newArr.push(createTiles({type: "wind", value: "east", amount: 1}))
				newArr.push(createTiles({type: "wind", value: "west", amount: 1}))
				newArr.push(createTiles({type: "wind", value: "south", amount: 1}))
			})
		})

		return {
			tiles,
			score: 25,
			concealed: false
		}
	},
	function(tiles = []) {
		allOptions.forEach((offset) => {
			allSuitArrangements.forEach((suitOrder) => {
				let newArr = []
				tiles.push(newArr)

				newArr.push(createTiles({type: "flower", value: "4", amount: 4})) //Value is no-op here.

				newArr.push(createTiles({type: suitOrder[0], value: offset, amount: 4}))
				newArr.push(createTiles({type: suitOrder[1], value: offset, amount: 2}))
				newArr.push(createTiles({type: suitOrder[2], value: offset, amount: 4}))
			})
		})

		return {
			tiles,
			score: 25,
			concealed: false
		}
	},
	function(tiles = []) {
		allOptions.forEach((offset) => {
			allSuitArrangements.forEach((suitOrder) => {
				let newArr = []
				tiles.push(newArr)

				newArr.push(createTiles({type: suitOrder[0], value: offset, amount: 3}))
				newArr.push(createTiles({type: "dragon", value: suitDragonConversion[suitOrder[0]], amount: 4}))
				newArr.push(createTiles({type: suitOrder[1], value: offset, amount: 3}))
				newArr.push(createTiles({type: "dragon", value: suitDragonConversion[suitOrder[1]], amount: 4}))
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
	output.section = "Any Like Numbers"
	return output
})
