const {createTiles, allSuits, allSuitArrangements, oddOptions, evenOptions, allOptions, dragonOptions, dragonArrangments, windOptions, suitDragonConversion}
= require("../utilities.js");

//Each function will return an array. Each array will contain every possible matching combo in the form of an array of tiles.
module.exports = [
	function(tiles = []) {
		allSuitArrangements.forEach((suitOrder) => {
			let newArr = []
			tiles.push(newArr)

			newArr.push(createTiles({type: "flower", value: "4", amount: 2})) //Value is no-op here.

			newArr.push(createTiles({type: suitOrder[0], value: 2, amount: 2}))
			newArr.push(createTiles({type: "dragon", value: "white", amount: 1}))
			newArr.push(createTiles({type: suitOrder[0], value: 1, amount: 1}))

			newArr.push(createTiles({type: suitOrder[1], value: 2, amount: 4}))
			newArr.push(createTiles({type: suitOrder[2], value: 1, amount: 4}))
		})

		return {
			tiles,
			score: 25,
			concealed: false
		}
	},
	function(tiles = []) {
		allSuitArrangements.forEach((suitOrder) => {
			let newArr = []
			tiles.push(newArr)

			newArr.push(createTiles({type: suitOrder[0], value: 2, amount: 3}))
			newArr.push(createTiles({type: "dragon", value: "white", amount: 4}))

			newArr.push(createTiles({type: suitOrder[1], value: 2, amount: 3}))
			newArr.push(createTiles({type: suitOrder[2], value: 1, amount: 4}))
		})

		return {
			tiles,
			score: 25,
			concealed: false
		}
	},
	//Currently not enabled due to an issue in utilities.js with the same tile in the same suit being in different matches where one can
	//be picked up, and the other can't.
	/*
	function(tiles = []) {
		allSuits.forEach((suit) => {
			let newArr = []
			tiles.push(newArr)

			newArr.push(createTiles({type: "flower", value: "4", amount: 4})) //Value is no-op here.

			newArr.push(createTiles({type: "dragon", value: "white", amount: 4}))

			newArr.push(createTiles({type: suit, value: 2, amount: 4}))

			newArr.push(createTiles({type: suit, value: 2, amount: 1}))
			newArr.push(createTiles({type: suit, value: 1, amount: 1}))
		})

		return {
			tiles,
			score: 30,
			concealed: false
		}
	},*/
	function(tiles = []) {
		allSuits.forEach((suit) => {
			let newArr = []
			tiles.push(newArr)

			newArr.push(createTiles({type: "wind", value: "north", amount: 3}))
			newArr.push(createTiles({type: "wind", value: "east", amount: 2}))
			newArr.push(createTiles({type: "wind", value: "west", amount: 2}))
			newArr.push(createTiles({type: "wind", value: "south", amount: 3}))

			newArr.push(createTiles({type: suit, value: 2, amount: 2}))
			newArr.push(createTiles({type: "dragon", value: "white", amount: 1}))
			newArr.push(createTiles({type: suit, value: 1, amount: 1}))
		})

		return {
			tiles,
			score: 30,
			concealed: true
		}
	},
].map((func, index) => {
	let output = func()
	output.cardIndex = index
	output.section = "2021"
	return output
})
