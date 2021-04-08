const {nonJokerTiles, createTiles, allSuits, allSuitArrangements, oddOptions, evenOptions, allOptions, windOptions, dragonOptions, dragonArrangments, suitDragonConversion, outputExpander, getTileDifferential}
= require("../utilities.js");


//Each function will return an array. Each array will contain every possible matching combo in the form of an array of tiles.
//Hands #1, 2, 3 of 7
module.exports = [
	function(tiles = []) {
		allSuits.forEach((suit) => {
			nonJokerTiles.forEach((kongTile) => {
				allOptions.slice(0,-4).forEach((offset) => {
					let newArr = []
					tiles.push(newArr)

					newArr.push(createTiles({type: suit, value: offset+0, amount: 1}))
					newArr.push(createTiles({type: suit, value: offset+1, amount: 3}))
					newArr.push(createTiles({type: suit, value: offset+2, amount: 1}))
					newArr.push(createTiles({type: suit, value: offset+3, amount: 4}))
					newArr.push(createTiles({type: suit, value: offset+4, amount: 1}))

					newArr.push(createTiles({type: kongTile.type, value: kongTile.value, amount: 4}))
				})
			})
		})

		return {
			tiles,
			score: 25,
			concealed: false,
			skipDuplicateRemoval: true //Lots of combos
		}
	},
	function(tiles = []) {
		allOptions.slice(0, -3).forEach((offset) => {
			allSuitArrangements.forEach((suitOrder) => {
				let newArr = []
				tiles.push(newArr)

				newArr.push(createTiles({type: suitOrder[0], value: 0+offset, amount: 4}))
				newArr.push(createTiles({type: suitOrder[1], value: 1+offset, amount: 3}))
				newArr.push(createTiles({type: suitOrder[1], value: 2+offset, amount: 3}))
				newArr.push(createTiles({type: suitOrder[2], value: 3+offset, amount: 4}))
			})

			allSuits.forEach((suit) => {
				let newArr = []
				tiles.push(newArr)

				newArr.push(createTiles({type: suit, value: 0+offset, amount: 4}))
				newArr.push(createTiles({type: suit, value: 1+offset, amount: 3}))
				newArr.push(createTiles({type: suit, value: 2+offset, amount: 3}))
				newArr.push(createTiles({type: suit, value: 3+offset, amount: 4}))
			})
		})

		return {
			tiles,
			score: 25,
			concealed: false
		}
	},
	function(tiles = []) {
		allOptions.slice(0, -4).forEach((offset) => {
			allSuitArrangements.forEach((suitOrder) => {
				let newArr = []
				tiles.push(newArr)

				newArr.push(createTiles({type: suitOrder[0], value: 0+offset, amount: 3}))
				newArr.push(createTiles({type: suitOrder[1], value: 1+offset, amount: 2}))
				newArr.push(createTiles({type: suitOrder[2], value: 2+offset, amount: 4}))
				newArr.push(createTiles({type: suitOrder[1], value: 3+offset, amount: 2}))
				newArr.push(createTiles({type: suitOrder[0], value: 4+offset, amount: 3}))
			})

			allSuits.forEach((suit) => {
				let newArr = []
				tiles.push(newArr)

				newArr.push(createTiles({type: suit, value: 0+offset, amount: 3}))
				newArr.push(createTiles({type: suit, value: 1+offset, amount: 2}))
				newArr.push(createTiles({type: suit, value: 2+offset, amount: 4}))
				newArr.push(createTiles({type: suit, value: 3+offset, amount: 2}))
				newArr.push(createTiles({type: suit, value: 4+offset, amount: 3}))
			})
		})

		return {
			tiles,
			score: 30,
			concealed: false
		}
	},
].map((func, index) => {
	let output = func()
	output.cardIndex = index
	output.section = "Running With The Bulls"
	return output
})
