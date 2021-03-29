const {createTiles, allSuits, allSuitArrangements, oddOptions, evenOptions, allOptions, dragonOptions, dragonArrangments, suitDragonConversion}
= require("../utilities.js");

//Each function will return an array. Each array will contain every possible matching combo in the form of an array of tiles.
module.exports = [
	function(tiles = []) {
		allSuitArrangements.forEach((suitOrder) => {
			let newArr = []
			tiles.push(newArr)

			newArr.push(createTiles({type: suitOrder[0], value: 3, amount: 3}))
			newArr.push(createTiles({type: suitOrder[0], value: 6, amount: 3}))

			newArr.push(createTiles({type: suitOrder[1], value: 6, amount: 4}))
			newArr.push(createTiles({type: suitOrder[1], value: 9, amount: 4}))
		})

		return {
			tiles,
			score: 25,
			concealed: false
		}
	},
	function(tiles = []) {
		[3,6,9].forEach((offset) => {
			allSuitArrangements.forEach((suitOrder) => {
				let newArr = []
				tiles.push(newArr)

				newArr.push(createTiles({type: suitOrder[0], value: 3, amount: 2}))
				newArr.push(createTiles({type: suitOrder[0], value: 6, amount: 2}))
				newArr.push(createTiles({type: suitOrder[0], value: 9, amount: 2}))
				newArr.push(createTiles({type: suitOrder[1], value: offset, amount: 4}))
				newArr.push(createTiles({type: suitOrder[2], value: offset, amount: 4}))
			})
		})

		return {
			tiles,
			score: 30,
			concealed: false
		}
	},
	function(tiles = []) {
		allSuits.forEach((suit) => {
			let newArr = []
			tiles.push(newArr)

			newArr.push(createTiles({type: suit, value: 3, amount: 3}))
			newArr.push(createTiles({type: suit, value: 6, amount: 4}))
			newArr.push(createTiles({type: suit, value: 9, amount: 3}))

			newArr.push(createTiles({type: "dragon", value: suitDragonConversion[suit], amount: 4}))
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

			newArr.push(createTiles({type: suitOrder[0], value: 3, amount: 2}))
			newArr.push(createTiles({type: suitOrder[0], value: 6, amount: 3}))

			newArr.push(createTiles({type: suitOrder[1], value: 3, amount: 2}))
			newArr.push(createTiles({type: suitOrder[1], value: 6, amount: 3}))

			newArr.push(createTiles({type: suitOrder[2], value: 9, amount: 4}))
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

			newArr.push(createTiles({type: suit, value: 3, amount: 4}))
			newArr.push(createTiles({type: suit, value: 6, amount: 4}))
			newArr.push(createTiles({type: suit, value: 9, amount: 4}))
		})

		//Part 2
		allSuitArrangements.forEach((suitOrder) => {
			let newArr = []
			tiles.push(newArr)

			newArr.push(createTiles({type: "flower", value: "4", amount: 2})) //Value is no-op here.

			newArr.push(createTiles({type: suitOrder[0], value: 3, amount: 4}))
			newArr.push(createTiles({type: suitOrder[1], value: 6, amount: 4}))
			newArr.push(createTiles({type: suitOrder[2], value: 9, amount: 4}))
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

			newArr.push(createTiles({type: "flower", value: "4", amount: 2})) //Value is no-op here.

			newArr.push(createTiles({type: suitOrder[0], value: 3, amount: 1}))
			newArr.push(createTiles({type: suitOrder[0], value: 6, amount: 2}))
			newArr.push(createTiles({type: suitOrder[0], value: 9, amount: 3}))

			newArr.push(createTiles({type: suitOrder[1], value: 3, amount: 1}))
			newArr.push(createTiles({type: suitOrder[1], value: 6, amount: 2}))
			newArr.push(createTiles({type: suitOrder[1], value: 9, amount: 3}))
		})

		return {
			tiles,
			score: 35,
			concealed: true
		}
	},
].map((func, index) => {
	let output = func()
	output.cardIndex = index
	output.section = "369"
	return output
})
