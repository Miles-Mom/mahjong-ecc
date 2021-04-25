const {createTiles, allSuits, allSuitArrangements, oddOptions, evenOptions, allOptions, dragonOptions, dragonArrangments, suitDragonConversion}
= require("../utilities.js");

//Each function will return an array. Each array will contain every possible matching combo in the form of an array of tiles.
module.exports = [
	function(tiles = []) {
		allSuitArrangements.forEach((suitOrder) => {
			let newArr = []
			tiles.push(newArr)

			newArr.push(createTiles({type: "flower", amount: 2}))

			newArr.push(createTiles({type: "dragon", value: "white", amount: 2}))
			newArr.push(createTiles({type: suitOrder[0], value: 2, amount: 2}))

			newArr.push(createTiles({type: suitOrder[1], value: 2, amount: 4}))
			newArr.push(createTiles({type: suitOrder[2], value: 2, amount: 4}))
		})

		return {
			tiles,
			score: 25,
			concealed: false
		}
	},
	function(tiles = []) {
		allSuits.forEach((suit) => {
			let newArr = []
			tiles.push(newArr)

			newArr.push(createTiles({type: "flower", amount: 2}))

			newArr.push(createTiles({type: "dragon", value: "white", amount: 2}))
			newArr.push(createTiles({type: suit, value: 2, amount: 2}))

			newArr.push(createTiles({type: "dragon", value: "green", amount: 4}))
			newArr.push(createTiles({type: "dragon", value: "red", amount: 4}))
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

			newArr.push(createTiles({type: "flower", amount: 5}))

			newArr.push(createTiles({type: "dragon", value: "white", amount: 2}))
			newArr.push(createTiles({type: suitOrder[0], value: 2, amount: 2}))

			newArr.push(createTiles({type: suitOrder[1], value: 2, amount: 3}))
			newArr.push(createTiles({type: suitOrder[2], value: 2, amount: 2}))
		})

		return {
			tiles,
			score: 25,
			concealed: false
		}
	},
	function(tiles = []) {
		allSuits.forEach((suit) => {
			let newArr = []
			tiles.push(newArr)

			newArr.push(createTiles({type: "wind", value: "north", amount: 2}))
			newArr.push(createTiles({type: "wind", value: "east", amount: 3}))
			newArr.push(createTiles({type: "wind", value: "west", amount: 3}))
			newArr.push(createTiles({type: "wind", value: "south", amount: 2}))

			newArr.push(createTiles({type: "dragon", value: "white", amount: 2}))
			newArr.push(createTiles({type: suit, value: 2, amount: 2}))
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
	output.section = "2020"
	return output
})
