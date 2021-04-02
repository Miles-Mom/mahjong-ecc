const {createTiles, allSuits, allSuitArrangements, oddOptions, evenOptions, allOptions, dragonOptions, dragonArrangments, windOptions, suitDragonConversion}
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
		allSuitArrangements.forEach((suitOrder) => {
			oddOptions.forEach((num) => {
				let newArr = []
				tiles.push(newArr)
				newArr.push(createTiles({type: "wind", value: "north", amount: 3}))
				newArr.push(createTiles({type: "wind", value: "south", amount: 3}))

				newArr.push(createTiles({type: suitOrder[0], value: num, amount: 2}))
				newArr.push(createTiles({type: suitOrder[1], value: num, amount: 2}))
				newArr.push(createTiles({type: suitOrder[2], value: num, amount: 4}))
			})

			//Part 2
			evenOptions.forEach((num) => {
				let newArr = []
				tiles.push(newArr)
				newArr.push(createTiles({type: "wind", value: "east", amount: 3}))
				newArr.push(createTiles({type: "wind", value: "west", amount: 3}))

				newArr.push(createTiles({type: suitOrder[0], value: num, amount: 2}))
				newArr.push(createTiles({type: suitOrder[1], value: num, amount: 2}))
				newArr.push(createTiles({type: suitOrder[2], value: num, amount: 4}))
			})
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

			newArr.push(createTiles({type: "flower", value: "4", amount: 4})) //Value is no-op here.

			newArr.push(createTiles({type: "wind", value: "north", amount: 3}))
			newArr.push(createTiles({type: "wind", value: "east", amount: 2}))
			newArr.push(createTiles({type: "wind", value: "west", amount: 2}))
			newArr.push(createTiles({type: "wind", value: "south", amount: 3}))
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

			newArr.push(createTiles({type: "flower", value: "4", amount: 2})) //Value is no-op here.

			newArr.push(createTiles({type: "dragon", value: "red", amount: 4}))

			newArr.push(createTiles({type: "wind", value: "north", amount: 4}))
			newArr.push(createTiles({type: "wind", value: "south", amount: 4}))
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

			newArr.push(createTiles({type: "flower", value: "4", amount: 2})) //Value is no-op here.

			newArr.push(createTiles({type: "dragon", value: "green", amount: 4}))

			newArr.push(createTiles({type: "wind", value: "east", amount: 4}))
			newArr.push(createTiles({type: "wind", value: "west", amount: 4}))
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

			newArr.push(createTiles({type: "flower", value: "4", amount: 2})) //Value is no-op here.

			newArr.push(createTiles({type: "wind", value: "north", amount: 4}))
			newArr.push(createTiles({type: "wind", value: "south", amount: 4}))

			newArr.push(createTiles({type: "dragon", value: "white", amount: 1}))

			newArr.push(createTiles({type: suit, value: 2, amount: 2}))
			newArr.push(createTiles({type: suit, value: 1, amount: 1}))
		})

		//Part 2
		allSuits.forEach((suit) => {
			let newArr = []
			tiles.push(newArr)

			newArr.push(createTiles({type: "flower", value: "4", amount: 2})) //Value is no-op here.

			newArr.push(createTiles({type: "wind", value: "east", amount: 4}))
			newArr.push(createTiles({type: "wind", value: "west", amount: 4}))

			newArr.push(createTiles({type: "dragon", value: "white", amount: 1}))

			newArr.push(createTiles({type: suit, value: 2, amount: 2}))
			newArr.push(createTiles({type: suit, value: 1, amount: 1}))
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

			newArr.push(createTiles({type: "wind", value: "north", amount: 3}))
			newArr.push(createTiles({type: "wind", value: "east", amount: 1}))
			newArr.push(createTiles({type: "wind", value: "west", amount: 1}))
			newArr.push(createTiles({type: "wind", value: "south", amount: 3}))

			newArr.push(createTiles({type: "dragon", value: suitDragonConversion[suitOrder[0]], amount: 3}))
			newArr.push(createTiles({type: "dragon", value: suitDragonConversion[suitOrder[1]], amount: 3}))
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
