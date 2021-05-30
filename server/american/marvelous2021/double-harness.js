const {allTiles, nonJokerTiles, createTiles, allSuits, allSuitArrangements, oddOptions, evenOptions, allOptions, windOptions, dragonOptions, dragonArrangments, suitDragonConversion, outputExpander, getTileDifferential}
= require("../utilities.js");


//Each function will return an array. Each array will contain every possible matching combo in the form of an array of tiles.
//Hands #1, 2, 3 of 7
module.exports = [
	function(tiles = []) {
		[2,4].forEach((offset) => {
			allSuitArrangements.forEach((suitOrder) => {
				nonJokerTiles.forEach((kongTile) => {
					nonJokerTiles.forEach((pongTile) => {
						let newArr = []
						tiles.push(newArr)

						newArr.push(createTiles({type: "flower", amount: 1}))

						newArr.push(createTiles({type: suitOrder[0], value: 0+offset, amount: 1}))
						newArr.push(createTiles({type: suitOrder[1], value: 2+offset, amount: 2}))
						newArr.push(createTiles({type: suitOrder[2], value: 4+offset, amount: 3}))

						newArr.push(createTiles({type: kongTile.type, value: kongTile.value, amount: 4}))
						newArr.push(createTiles({type: pongTile.type, value: pongTile.value, amount: 3}))
					})
				})
			})

			allSuits.forEach((suit) => {
				nonJokerTiles.forEach((kongTile) => {
					nonJokerTiles.forEach((pongTile) => {
						let newArr = []
						tiles.push(newArr)

						newArr.push(createTiles({type: "flower", amount: 1}))

						newArr.push(createTiles({type: suit, value: 0+offset, amount: 1}))
						newArr.push(createTiles({type: suit, value: 2+offset, amount: 2}))
						newArr.push(createTiles({type: suit, value: 4+offset, amount: 3}))

						newArr.push(createTiles({type: kongTile.type, value: kongTile.value, amount: 4}))
						newArr.push(createTiles({type: pongTile.type, value: pongTile.value, amount: 3}))
					})
				})
			})
		})

		return {
			tiles,
			score: 25,
			concealed: false,
			skipDuplicateRemoval: true //Too many combos.
		}
	},
	function(tiles = []) {
		allSuitArrangements.forEach((suitOrder) => {
			let newArr = []
			tiles.push(newArr)

			newArr.push(createTiles({type: suitOrder[0], value: 2, amount: 3}))
			newArr.push(createTiles({type: suitOrder[0], value: 4, amount: 3}))

			newArr.push(createTiles({type: suitOrder[1], value: 6, amount: 1}))
			newArr.push(createTiles({type: suitOrder[1], value: 8, amount: 1}))

			newArr.push(createTiles({type: suitOrder[2], value: 6, amount: 3}))
			newArr.push(createTiles({type: suitOrder[2], value: 8, amount: 3}))
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

			newArr.push(createTiles({type: "flower", amount: 1}))

			newArr.push(createTiles({type: suitOrder[0], value: 4, amount: 3}))

			newArr.push(createTiles({type: suitOrder[1], value: 6, amount: 3}))
			newArr.push(createTiles({type: suitOrder[1], value: 2, amount: 1}))
			newArr.push(createTiles({type: suitOrder[1], value: 4, amount: 1}))

			newArr.push(createTiles({type: suitOrder[2], value: 4, amount: 1}))
			newArr.push(createTiles({type: suitOrder[2], value: 6, amount: 1}))
			newArr.push(createTiles({type: suitOrder[2], value: 8, amount: 3}))
		})

		allSuits.forEach((suit) => {
			let newArr = []
			tiles.push(newArr)

			newArr.push(createTiles({type: "flower", amount: 1}))

			newArr.push(createTiles({type: suit, value: 4, amount: 3}))

			newArr.push(createTiles({type: suit, value: 6, amount: 3}))
			newArr.push(createTiles({type: suit, value: 2, amount: 1}))
			newArr.push(createTiles({type: suit, value: 4, amount: 1}))

			newArr.push(createTiles({type: suit, value: 4, amount: 1}))
			newArr.push(createTiles({type: suit, value: 6, amount: 1}))
			newArr.push(createTiles({type: suit, value: 8, amount: 3}))
		})

		return {
			tiles,
			score: 25,
			concealed: false
		}
	},
].map((func, index) => {
	let output = func()
	output.cardIndex = index
	output.section = "Double Harness"
	return output
})
