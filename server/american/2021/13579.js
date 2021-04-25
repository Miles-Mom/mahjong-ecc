const {createTiles, allSuits, allSuitArrangements, oddOptions, evenOptions, allOptions, dragonOptions, dragonArrangments, windOptions, suitDragonConversion}
= require("../utilities.js");

//Each function will return an array. Each array will contain every possible matching combo in the form of an array of tiles.
module.exports = [
	function(tiles = []) {
		allSuits.forEach((suit) => {
			let newArr = []
			tiles.push(newArr)

			newArr.push(createTiles({type: suit, value: 1, amount: 2}))
			newArr.push(createTiles({type: suit, value: 3, amount: 3}))
			newArr.push(createTiles({type: suit, value: 5, amount: 4}))
			newArr.push(createTiles({type: suit, value: 7, amount: 3}))
			newArr.push(createTiles({type: suit, value: 9, amount: 2}))
		})

		//Part 2
		allSuitArrangements.forEach((suitOrder) => {
			let newArr = []
			tiles.push(newArr)

			newArr.push(createTiles({type: suitOrder[0], value: 1, amount: 2}))
			newArr.push(createTiles({type: suitOrder[0], value: 3, amount: 3}))
			newArr.push(createTiles({type: suitOrder[1], value: 5, amount: 4}))
			newArr.push(createTiles({type: suitOrder[2], value: 7, amount: 3}))
			newArr.push(createTiles({type: suitOrder[2], value: 9, amount: 2}))
		})

		return {
			tiles,
			score: 25,
			concealed: false
		}
	},
	function(tiles = []) {
		;[1,5].forEach((offset) => {
			allSuits.forEach((suit) => {
				let newArr = []
				tiles.push(newArr)

				newArr.push(createTiles({type: "flower", amount: 2}))

				newArr.push(createTiles({type: suit, value: 0+offset, amount: 2}))
				newArr.push(createTiles({type: suit, value: 2+offset, amount: 3}))
				newArr.push(createTiles({type: suit, value: 4+offset, amount: 4}))

				newArr.push(createTiles({type: "dragon", value: suitDragonConversion[suit], amount: 3}))
			})

		})

		return {
			tiles,
			score: 25,
			concealed: false
		}
	},
	function(tiles = []) {
		;[1,5].forEach((offset) => {
			allSuitArrangements.forEach((suitOrder) => {
				let newArr = []
				tiles.push(newArr)

				newArr.push(createTiles({type: suitOrder[0], value: 0+offset, amount: 3}))
				newArr.push(createTiles({type: suitOrder[0], value: 2+offset, amount: 4}))
				newArr.push(createTiles({type: suitOrder[1], value: 2+offset, amount: 4}))
				newArr.push(createTiles({type: suitOrder[1], value: 4+offset, amount: 3}))
			})

		})

		return {
			tiles,
			score: 25,
			concealed: false
		}
	},
	function(tiles = []) {
		;[1,5].forEach((offset) => {
			allSuitArrangements.forEach((suitOrder) => {
				let newArr = []
				tiles.push(newArr)

				newArr.push(createTiles({type: suitOrder[0], value: 0+offset, amount: 2}))
				newArr.push(createTiles({type: suitOrder[0], value: 2+offset, amount: 3}))
				newArr.push(createTiles({type: suitOrder[1], value: 2+offset, amount: 3}))
				newArr.push(createTiles({type: suitOrder[1], value: 4+offset, amount: 2}))

				newArr.push(createTiles({type: "dragon", value: suitDragonConversion[suitOrder[2]], amount: 4}))
			})

		})

		return {
			tiles,
			score: 25,
			concealed: false
		}
	},
	function(tiles = []) {
		;[1,5].forEach((offset) => {
			allSuits.forEach((suit) => {
				let newArr = []
				tiles.push(newArr)

				newArr.push(createTiles({type: "flower", amount: 4}))

				newArr.push(createTiles({type: suit, value: 0+offset, amount: 4}))
				newArr.push(createTiles({type: suit, value: 2+offset, amount: 2}))
				newArr.push(createTiles({type: suit, value: 4+offset, amount: 4}))
			})
		})

		return {
			tiles,
			score: 25,
			concealed: false
		}
	},
	function(tiles = []) {
		;[1].forEach((offset) => {
			allSuitArrangements.forEach((suitOrder) => {
				let newArr = []
				tiles.push(newArr)

				newArr.push(createTiles({type: suitOrder[0], value: 0+offset, amount: 2}))
				newArr.push(createTiles({type: suitOrder[0], value: 2+offset, amount: 2}))
				newArr.push(createTiles({type: suitOrder[0], value: 4+offset, amount: 2}))
				newArr.push(createTiles({type: suitOrder[1], value: 6+offset, amount: 4}))
				newArr.push(createTiles({type: suitOrder[2], value: 8+offset, amount: 4}))
			})
		})

		return {
			tiles,
			score: 30,
			concealed: false
		}
	},
	function(tiles = []) {
		;[1,5].forEach((offset) => {
			allSuitArrangements.forEach((suitOrder) => {
				let newArr = []
				tiles.push(newArr)

				newArr.push(createTiles({type: suitOrder[0], value: 0+offset, amount: 3}))
				newArr.push(createTiles({type: suitOrder[0], value: 2+offset, amount: 3}))
				newArr.push(createTiles({type: suitOrder[1], value: 0+offset, amount: 3}))
				newArr.push(createTiles({type: suitOrder[1], value: 2+offset, amount: 3}))
				newArr.push(createTiles({type: suitOrder[2], value: 4+offset, amount: 2}))
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
	output.section = "13579"
	return output
})
