const {createTiles, allSuits, allSuitArrangements, oddOptions, evenOptions, allOptions, dragonOptions, dragonArrangments, suitDragonConversion}
= require("../utilities.js");

//Each function will return an array. Each array will contain every possible matching combo in the form of an array of tiles.
module.exports = [
	function(tiles = []) {
		[0].forEach((num) => {
			let newArr = []
			tiles.push(newArr)

			newArr.push(createTiles({type: "wind", value: "north", amount: 4}))
			newArr.push(createTiles({type: "wind", value: "east", amount: 3}))
			newArr.push(createTiles({type: "wind", value: "west", amount: 3}))
			newArr.push(createTiles({type: "wind", value: "south", amount: 4}))
		})

		return {
			tiles,
			score: 25,
			concealed: false
		}
	},
	function(tiles = []) {
		dragonArrangments.forEach((values) => {
			let newArr = []
			tiles.push(newArr)
			newArr.push(createTiles({type: "wind", value: "north", amount: 1}))
			newArr.push(createTiles({type: "wind", value: "east", amount: 1}))
			newArr.push(createTiles({type: "wind", value: "west", amount: 1}))
			newArr.push(createTiles({type: "wind", value: "south", amount: 1}))

			newArr.push(createTiles({type: "flower", amount: 2}))

			newArr.push(createTiles({type: "dragon", value: values[0], amount: 4}))
			newArr.push(createTiles({type: "dragon", value: values[1], amount: 4}))
		})

		return {
			tiles,
			score: 25,
			concealed: false
		}
	},
	function(tiles = []) {
		oddOptions.forEach((num) => {
			let newArr = []
			tiles.push(newArr)
			newArr.push(createTiles({type: "wind", value: "north", amount: 4}))
			newArr.push(createTiles({type: "wind", value: "south", amount: 4}))

			allSuits.forEach((suit) => {
				newArr.push(createTiles({type: suit, value: num, amount: 2}))
			})
		})

		return {
			tiles,
			score: 30,
			concealed: false
		}
	},
	function(tiles = []) {
		evenOptions.forEach((num) => {
			let newArr = []
			tiles.push(newArr)
			newArr.push(createTiles({type: "wind", value: "east", amount: 4}))
			newArr.push(createTiles({type: "wind", value: "west", amount: 4}))

			allSuits.forEach((suit) => {
				newArr.push(createTiles({type: suit, value: num, amount: 2}))
			})
		})

		return {
			tiles,
			score: 30,
			concealed: false
		}
	},
	function(tiles = []) {
		dragonOptions.forEach((dragon) => {
			let newArr = []
			tiles.push(newArr)
			newArr.push(createTiles({type: "wind", value: "north", amount: 2}))
			newArr.push(createTiles({type: "wind", value: "east", amount: 3}))
			newArr.push(createTiles({type: "wind", value: "west", amount: 3}))
			newArr.push(createTiles({type: "wind", value: "south", amount: 2}))

			newArr.push(createTiles({type: "dragon", value: dragon, amount: 4}))
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
			newArr.push(createTiles({type: "wind", value: "north", amount: 4}))

			newArr.push(createTiles({type: suit, value: 2, amount: 2}))
			newArr.push(createTiles({type: "dragon", value: "white", amount: 2}))

			newArr.push(createTiles({type: "wind", value: "south", amount: 4}))
		})

		//Part two of option.
		allSuits.forEach((suit) => {
			let newArr = []
			tiles.push(newArr)
			newArr.push(createTiles({type: "flower", amount: 2}))
			newArr.push(createTiles({type: "wind", value: "east", amount: 4}))

			newArr.push(createTiles({type: suit, value: 2, amount: 2}))
			newArr.push(createTiles({type: "dragon", value: "white", amount: 2}))

			newArr.push(createTiles({type: "wind", value: "west", amount: 4}))
		})

		return {
			tiles,
			score: 25,
			concealed: false
		}
	},
	function(tiles = []) {
		[0].forEach((num) => {
			let newArr = []
			tiles.push(newArr)

			newArr.push(createTiles({type: "flower", amount: 2}))
			newArr.push(createTiles({type: "wind", value: "north", amount: 3}))
			newArr.push(createTiles({type: "wind", value: "east", amount: 3}))
			newArr.push(createTiles({type: "wind", value: "west", amount: 3}))
			newArr.push(createTiles({type: "wind", value: "south", amount: 3}))
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
	output.section = "Winds and Dragons"
	return output
})
