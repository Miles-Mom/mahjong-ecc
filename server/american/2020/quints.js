const {createTiles, allSuits, allSuitArrangements, oddOptions, evenOptions, allOptions, dragonOptions, dragonArrangments, suitDragonConversion}
= require("../utilities.js");

//Each function will return an array. Each array will contain every possible matching combo in the form of an array of tiles.
module.exports = [
	function(tiles = []) {
		allSuits.forEach((suit) => {
			allOptions.forEach((offset) => {
				dragonOptions.forEach((dragon) => {
					let newArr = []
					tiles.push(newArr)

					newArr.push(createTiles({type: "dragon", value: dragon, amount: 4}))
					newArr.push(createTiles({type: suit, value: offset, amount: 5}))
					newArr.push(createTiles({type: "flower", amount: 5}))
				})
			})
		})

		return {
			tiles,
			score: 40,
			concealed: false
		}
	},
	function(tiles = []) {
		allOptions.slice(0, -2).forEach((offset) => {
			allSuitArrangements.forEach((suitOrder) => {
				let newArr = []
				tiles.push(newArr)

				newArr.push(createTiles({type: suitOrder[0], value: offset, amount: 2}))
				newArr.push(createTiles({type: suitOrder[0], value: 1+offset, amount: 2}))
				newArr.push(createTiles({type: suitOrder[1], value: 2+offset, amount: 5}))
				newArr.push(createTiles({type: suitOrder[2], value: 2+offset, amount: 5}))
			})
		})

		return {
			tiles,
			score: 45,
			concealed: false
		}
	},
	function(tiles = []) {
		[1,5].forEach((offset) => {
			allSuits.forEach((suit) => {
				let newArr = []
				tiles.push(newArr)

				newArr.push(createTiles({type: suit, value: offset, amount: 5}))
				newArr.push(createTiles({type: suit, value: 2+offset, amount: 4}))
				newArr.push(createTiles({type: suit, value: 4+offset, amount: 5}))
			})
		})

		return {
			tiles,
			score: 45,
			concealed: false
		}
	},
	function(tiles = []) {
		allOptions.slice(0, -3).forEach((offset) => {
			allSuits.forEach((suit) => {
				let newArr = []
				tiles.push(newArr)

				newArr.push(createTiles({type: suit, value: offset, amount: 5}))
				newArr.push(createTiles({type: suit, value: 1+offset, amount: 2}))
				newArr.push(createTiles({type: suit, value: 2+offset, amount: 2}))
				newArr.push(createTiles({type: suit, value: 3+offset, amount: 5}))
			})
		})

		return {
			tiles,
			score: 45,
			concealed: false
		}
	},
].map((func, index) => {
	let output = func()
	output.cardIndex = index
	output.section = "Quints"
	return output
})
