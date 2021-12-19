const {allTiles, nonJokerTiles, createTiles, allSuits, allSuitArrangements, oddOptions, evenOptions, allOptions, windOptions, windArrangments, dragonOptions, dragonArrangments, suitDragonConversion, outputExpander, getTileDifferential}
= require("../utilities.js");


//Each function will return an array. Each array will contain every possible matching combo in the form of an array of tiles.
//Supported (of 7): #1, #2
module.exports = [
	function(tiles = []) {
		allSuitArrangements.forEach((suitOrder) => {
			let newArr = []
			tiles.push(newArr)

			//AA
			newArr.push(createTiles({type: "any", value: "any", amount: 2}))

			//248 666
			newArr.push(createTiles({type: suitOrder[0], value: 2, amount: 1}))
			newArr.push(createTiles({type: suitOrder[0], value: 4, amount: 1}))
			newArr.push(createTiles({type: suitOrder[0], value: 8, amount: 1}))
			newArr.push(createTiles({type: suitOrder[0], value: 6, amount: 3}))

			//888 642
			newArr.push(createTiles({type: suitOrder[1], value: 8, amount: 3}))
			newArr.push(createTiles({type: suitOrder[1], value: 6, amount: 1}))
			newArr.push(createTiles({type: suitOrder[1], value: 4, amount: 1}))
			newArr.push(createTiles({type: suitOrder[1], value: 2, amount: 1}))
		})

		return {
			tiles,
			score: 25,
			concealed: false,
		}
	},
	function(tiles = []) {
		allSuitArrangements.forEach((suitOrder) => {
			let newArr = []
			tiles.push(newArr)

			//AA
			newArr.push(createTiles({type: "any", value: "any", amount: 2}))

			//2468
			newArr.push(createTiles({type: suitOrder[0], value: 2, amount: 1}))
			newArr.push(createTiles({type: suitOrder[0], value: 4, amount: 1}))
			newArr.push(createTiles({type: suitOrder[0], value: 6, amount: 1}))
			newArr.push(createTiles({type: suitOrder[0], value: 8, amount: 1}))

			//6666
			newArr.push(createTiles({type: suitOrder[1], value: 6, amount: 4}))

			//8888
			newArr.push(createTiles({type: suitOrder[2], value: 8, amount: 4}))
		})

		return {
			tiles,
			score: 25,
			concealed: false,
		}
	},
].map((func, index) => {
	let output = func()
	output.cardIndex = index
	output.section = "Evenly Striped"
	return output
})
