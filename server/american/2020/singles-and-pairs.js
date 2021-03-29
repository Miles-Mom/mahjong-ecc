const {createTiles, allSuits, allSuitArrangements, oddOptions, evenOptions, allOptions, dragonOptions, dragonArrangments, suitDragonConversion}
= require("../utilities.js");

//Each function will return an array. Each array will contain every possible matching combo in the form of an array of tiles.
module.exports = [
	function(tiles = []) {
		allOptions.slice(0, -2).forEach((offset) => {
			allSuits.forEach((suit) => {
				let newArr = []
				tiles.push(newArr)

				newArr.push(createTiles({type: "wind", value: "north", amount: 2}))
				newArr.push(createTiles({type: "wind", value: "east", amount: 2}))
				newArr.push(createTiles({type: "wind", value: "west", amount: 2}))
				newArr.push(createTiles({type: "wind", value: "south", amount: 2}))


				newArr.push(createTiles({type: suit, value: offset, amount: 2}))
				newArr.push(createTiles({type: suit, value: 1+offset, amount: 2}))
				newArr.push(createTiles({type: suit, value: 2+offset, amount: 2}))
			})
		})

		return {
			tiles,
			score: 50,
			concealed: true
		}
	},
	function(tiles = []) {
		allOptions.slice(0, -4).forEach((offset) => {
			allSuits.forEach((suit) => {
				let newArr = []
				tiles.push(newArr)

				newArr.push(createTiles({type: "flower", value: "4", amount: 2})) //Value is no-op here.
				newArr.push(createTiles({type: "dragon", value: suitDragonConversion[suit], amount: 2}))

				newArr.push(createTiles({type: suit, value: offset, amount: 2}))
				newArr.push(createTiles({type: suit, value: 1+offset, amount: 2}))
				newArr.push(createTiles({type: suit, value: 2+offset, amount: 2}))
				newArr.push(createTiles({type: suit, value: 3+offset, amount: 2}))
				newArr.push(createTiles({type: suit, value: 4+offset, amount: 2}))
			})
		})

		return {
			tiles,
			score: 50,
			concealed: true
		}
	},
	function(tiles = []) {
		allOptions.slice(0, -1).forEach((offset) => {
			let newArr = []
			tiles.push(newArr)

			newArr.push(createTiles({type: "flower", value: "4", amount: 2})) //Value is no-op here.

			newArr.push(createTiles({type: allSuits[0], value: offset, amount: 2}))
			newArr.push(createTiles({type: allSuits[0], value: 1+offset, amount: 2}))

			newArr.push(createTiles({type: allSuits[1], value: offset, amount: 2}))
			newArr.push(createTiles({type: allSuits[1], value: 1+offset, amount: 2}))

			newArr.push(createTiles({type: allSuits[2], value: offset, amount: 2}))
			newArr.push(createTiles({type: allSuits[2], value: 1+offset, amount: 2}))
		})

		return {
			tiles,
			score: 50,
			concealed: true
		}
	},
	function(tiles = []) {
		allSuitArrangements.forEach((suitOrder) => {
			let newArr = []
			tiles.push(newArr)

			newArr.push(createTiles({type: "flower", value: "4", amount: 2})) //Value is no-op here.

			newArr.push(createTiles({type: suitOrder[0], value: 2, amount: 1}))
			newArr.push(createTiles({type: suitOrder[0], value: 4, amount: 1}))
			newArr.push(createTiles({type: suitOrder[0], value: 6, amount: 1}))
			newArr.push(createTiles({type: suitOrder[0], value: 8, amount: 1}))
			newArr.push(createTiles({type: "dragon", value: suitDragonConversion[suitOrder[0]], amount: 2}))

			newArr.push(createTiles({type: suitOrder[1], value: 2, amount: 1}))
			newArr.push(createTiles({type: suitOrder[1], value: 4, amount: 1}))
			newArr.push(createTiles({type: suitOrder[1], value: 6, amount: 1}))
			newArr.push(createTiles({type: suitOrder[1], value: 8, amount: 1}))
			newArr.push(createTiles({type: "dragon", value: suitDragonConversion[suitOrder[1]], amount: 2}))
		})

		return {
			tiles,
			score: 50,
			concealed: true
		}
	},
	function(tiles = []) {
		allSuitArrangements.forEach((suitOrder) => {
			let newArr = []
			tiles.push(newArr)

			newArr.push(createTiles({type: suitOrder[0], value: 3, amount: 2}))
			newArr.push(createTiles({type: suitOrder[0], value: 6, amount: 1}))

			newArr.push(createTiles({type: suitOrder[1], value: 3, amount: 2}))
			newArr.push(createTiles({type: suitOrder[1], value: 6, amount: 2}))
			newArr.push(createTiles({type: suitOrder[1], value: 9, amount: 1}))

			newArr.push(createTiles({type: suitOrder[2], value: 3, amount: 2}))
			newArr.push(createTiles({type: suitOrder[2], value: 6, amount: 2}))
			newArr.push(createTiles({type: suitOrder[2], value: 9, amount: 2}))
		})

		return {
			tiles,
			score: 50,
			concealed: true
		}
	},
	function(tiles = []) {
		allSuitArrangements.forEach((suitOrder) => {
			let newArr = []
			tiles.push(newArr)

			newArr.push(createTiles({type: suitOrder[0], value: 1, amount: 2}))
			newArr.push(createTiles({type: suitOrder[0], value: 3, amount: 1}))
			newArr.push(createTiles({type: suitOrder[0], value: 5, amount: 1}))
			newArr.push(createTiles({type: suitOrder[0], value: 7, amount: 1}))
			newArr.push(createTiles({type: suitOrder[0], value: 9, amount: 2}))

			newArr.push(createTiles({type: suitOrder[1], value: 1, amount: 2}))
			newArr.push(createTiles({type: suitOrder[1], value: 3, amount: 1}))
			newArr.push(createTiles({type: suitOrder[1], value: 5, amount: 1}))
			newArr.push(createTiles({type: suitOrder[1], value: 7, amount: 1}))
			newArr.push(createTiles({type: suitOrder[1], value: 9, amount: 2}))
		})

		return {
			tiles,
			score: 50,
			concealed: true
		}
	},
	function(tiles = []) {
		allSuitArrangements.forEach((suitOrder) => {
			let newArr = []
			tiles.push(newArr)

			newArr.push(createTiles({type: "flower", value: "4", amount: 2})) //Value is no-op here.
			newArr.push(createTiles({type: "dragon", value: "white", amount: 4}))

			newArr.push(createTiles({type: "wind", value: "north", amount: 1}))
			newArr.push(createTiles({type: "wind", value: "east", amount: 1}))
			newArr.push(createTiles({type: "wind", value: "west", amount: 1}))
			newArr.push(createTiles({type: "wind", value: "south", amount: 1}))

			newArr.push(createTiles({type: suitOrder[0], value: 2, amount: 2}))

			newArr.push(createTiles({type: suitOrder[1], value: 2, amount: 2}))
		})

		return {
			tiles,
			score: 85,
			concealed: true
		}
	},
].map((func, index) => {
	let output = func()
	output.cardIndex = index
	output.section = "Singles and Pairs"
	return output
})
