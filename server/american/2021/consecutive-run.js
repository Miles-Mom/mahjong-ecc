const {createTiles, allSuits, allSuitArrangements, oddOptions, evenOptions, allOptions, dragonOptions, dragonArrangments, windOptions, suitDragonConversion}
= require("../utilities.js");

//Each function will return an array. Each array will contain every possible matching combo in the form of an array of tiles.
module.exports = [
	function(tiles = []) {
		allSuits.forEach((suit) => {
			[0, 4].forEach((offset) => {
				let newArr = []
				tiles.push(newArr)

				newArr.push(createTiles({type: suit, value: 1+offset, amount: 2}))
				newArr.push(createTiles({type: suit, value: 2+offset, amount: 3}))
				newArr.push(createTiles({type: suit, value: 3+offset, amount: 4}))
				newArr.push(createTiles({type: suit, value: 4+offset, amount: 3}))
				newArr.push(createTiles({type: suit, value: 5+offset, amount: 2}))
			})
		})

		return {
			tiles,
			score: 25,
			concealed: false
		}
	},
	function(tiles = []) {
		allOptions.slice(0, -3).forEach((offset) => {
			allSuitArrangements.forEach((suitOrder) => {
				let newArr = []
				tiles.push(newArr)

				newArr.push(createTiles({type: suitOrder[0], value: offset, amount: 3}))
				newArr.push(createTiles({type: suitOrder[0], value: 1+offset, amount: 4}))
				newArr.push(createTiles({type: suitOrder[1], value: 2+offset, amount: 3}))
				newArr.push(createTiles({type: suitOrder[1], value: 3+offset, amount: 4}))
			})
		})

		return {
			tiles,
			score: 25,
			concealed: false
		}
	},
	function(tiles = []) {
		allOptions.slice(0, -3).forEach((offset) => {
			allSuits.forEach((suit) => {
				let newArr = []
				tiles.push(newArr)

				newArr.push(createTiles({type: suit, value: offset, amount: 1}))
				newArr.push(createTiles({type: suit, value: 1+offset, amount: 2}))
				newArr.push(createTiles({type: suit, value: 2+offset, amount: 3}))
				newArr.push(createTiles({type: suit, value: 3+offset, amount: 4}))
				newArr.push(createTiles({type: "dragon", value: suitDragonConversion[suit], amount: 4}))
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
			allSuits.forEach((suit) => {
				let newArr = []
				tiles.push(newArr)

				newArr.push(createTiles({type: "flower", value: "4", amount: 5})) //Value is no-op here.

				newArr.push(createTiles({type: suit, value: offset, amount: 2}))
				newArr.push(createTiles({type: suit, value: 1+offset, amount: 3}))
				newArr.push(createTiles({type: suit, value: 2+offset, amount: 4}))
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
			//Part two of option
			allSuitArrangements.forEach((suitOrder) => {
				let newArr = []
				tiles.push(newArr)

				newArr.push(createTiles({type: "flower", value: "4", amount: 2})) //Value is no-op here.
				newArr.push(createTiles({type: suitOrder[0], value: offset, amount: 4}))
				newArr.push(createTiles({type: suitOrder[1], value: 1+offset, amount: 4}))
				newArr.push(createTiles({type: suitOrder[2], value: 2+offset, amount: 4}))
			})

			//Part 1
			allSuits.forEach((suit) => {
				let newArr = []
				tiles.push(newArr)

				newArr.push(createTiles({type: "flower", value: "4", amount: 2})) //Value is no-op here.
				newArr.push(createTiles({type: suit, value: offset, amount: 4}))
				newArr.push(createTiles({type: suit, value: 1+offset, amount: 4}))
				newArr.push(createTiles({type: suit, value: 2+offset, amount: 4}))
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

				newArr.push(createTiles({type: suitOrder[0], value: 0+offset, amount: 2}))
				newArr.push(createTiles({type: suitOrder[0], value: 1+offset, amount: 3}))
				newArr.push(createTiles({type: suitOrder[1], value: 0+offset, amount: 2}))
				newArr.push(createTiles({type: suitOrder[1], value: 1+offset, amount: 3}))
				newArr.push(createTiles({type: suitOrder[2], value: 2+offset, amount: 4}))
			})
		})

		return {
			tiles,
			score: 25,
			concealed: false
		}
	},
	function(tiles = []) {
		allOptions.slice(0, -3).forEach((offset) => {
			allSuitArrangements.forEach((suitOrder) => {
				let newArr = []
				tiles.push(newArr)

				newArr.push(createTiles({type: suitOrder[0], value: 0+offset, amount: 2}))
				newArr.push(createTiles({type: suitOrder[0], value: 1+offset, amount: 2}))
				newArr.push(createTiles({type: suitOrder[0], value: 2+offset, amount: 2}))

				newArr.push(createTiles({type: suitOrder[1], value: 3+offset, amount: 4}))
				newArr.push(createTiles({type: suitOrder[2], value: 3+offset, amount: 4}))
			})
		})

		return {
			tiles,
			score: 30,
			concealed: false
		}
	},
	function(tiles = []) {
		allOptions.slice(0, -1).forEach((offset) => {
			//Part two of option
			allSuitArrangements.forEach((suitOrder) => {
				let newArr = []
				tiles.push(newArr)

				newArr.push(createTiles({type: "flower", value: "4", amount: 2})) //Value is no-op here.
				newArr.push(createTiles({type: suitOrder[0], value: 0+offset, amount: 3}))
				newArr.push(createTiles({type: suitOrder[0], value: 1+offset, amount: 3}))

				newArr.push(createTiles({type: "dragon", value: suitDragonConversion[suitOrder[1]], amount: 3}))
				newArr.push(createTiles({type: "dragon", value: suitDragonConversion[suitOrder[2]], amount: 3}))
			})
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
	output.section = "Consecutive Run"
	return output
})
