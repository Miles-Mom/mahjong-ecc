const {allTiles, nonJokerTiles, createTiles, allSuits, allSuitArrangements, oddOptions, evenOptions, allOptions, windOptions, dragonOptions, dragonArrangments, suitDragonConversion, outputExpander, getTileDifferential}
= require("../utilities.js");


//Each function will return an array. Each array will contain every possible matching combo in the form of an array of tiles.
//Hands #1, 2, 3, 4, 5 of 7
module.exports = [
	function(tiles = []) {
		allSuitArrangements.forEach((suitOrder) => {
			nonJokerTiles.forEach((kongTile) => {
				nonJokerTiles.forEach((pongTile) => {
					let newArr = []
					tiles.push(newArr)

					newArr.push(createTiles({type: suitOrder[0], value: 1, amount: 1}))

					newArr.push(createTiles({type: suitOrder[1], value: 3, amount: 1}))
					newArr.push(createTiles({type: suitOrder[1], value: 5, amount: 1}))
					newArr.push(createTiles({type: suitOrder[1], value: 7, amount: 1}))

					newArr.push(createTiles({type: suitOrder[2], value: 9, amount: 3}))

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

					newArr.push(createTiles({type: suit, value: 1, amount: 1}))

					newArr.push(createTiles({type: suit, value: 3, amount: 1}))
					newArr.push(createTiles({type: suit, value: 5, amount: 1}))
					newArr.push(createTiles({type: suit, value: 7, amount: 1}))

					newArr.push(createTiles({type: suit, value: 9, amount: 3}))

					newArr.push(createTiles({type: kongTile.type, value: kongTile.value, amount: 4}))
					newArr.push(createTiles({type: pongTile.type, value: pongTile.value, amount: 3}))
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
		allSuits.forEach((suit) => {
			let newArr = []
			tiles.push(newArr)

			newArr.push(createTiles({type: "flower", amount: 2}))

			newArr.push(createTiles({type: suit, value: 1, amount: 1}))
			newArr.push(createTiles({type: suit, value: 3, amount: 3}))
			newArr.push(createTiles({type: suit, value: 5, amount: 2}))
			newArr.push(createTiles({type: suit, value: 7, amount: 3}))
			newArr.push(createTiles({type: suit, value: 9, amount: 3}))
		})

		//Part 2
		allSuitArrangements.forEach((suitOrder) => {
			let newArr = []
			tiles.push(newArr)

			newArr.push(createTiles({type: "flower", amount: 2}))

			newArr.push(createTiles({type: suitOrder[0], value: 1, amount: 1}))
			newArr.push(createTiles({type: suitOrder[0], value: 3, amount: 3}))
			newArr.push(createTiles({type: suitOrder[0], value: 5, amount: 1}))
			newArr.push(createTiles({type: suitOrder[1], value: 5, amount: 1}))
			newArr.push(createTiles({type: suitOrder[1], value: 7, amount: 3}))
			newArr.push(createTiles({type: suitOrder[1], value: 9, amount: 3}))
		})

		return {
			tiles,
			score: 25,
			concealed: false
		}
	},
	function(tiles = []) {
		[0,2,4].forEach((offset) => {
			allSuits.forEach((suit) => {
				let newArr = []
				tiles.push(newArr)

				newArr.push(createTiles({type: suit, value: offset+1, amount: 3}))
				newArr.push(createTiles({type: suit, value: offset+3, amount: 3}))
				newArr.push(createTiles({type: suit, value: offset+5, amount: 3}))

				newArr.push(createTiles({type: suit, value: 1, amount: 1}))
				newArr.push(createTiles({type: suit, value: 3, amount: 1}))
				newArr.push(createTiles({type: suit, value: 5, amount: 1}))
				newArr.push(createTiles({type: suit, value: 7, amount: 1}))
				newArr.push(createTiles({type: suit, value: 9, amount: 1}))
			})

			//Part 2
			allSuitArrangements.forEach((suitOrder) => {
				let newArr = []
				tiles.push(newArr)

				newArr.push(createTiles({type: suitOrder[0], value: offset+1, amount: 3}))
				newArr.push(createTiles({type: suitOrder[1], value: offset+3, amount: 3}))
				newArr.push(createTiles({type: suitOrder[2], value: offset+5, amount: 3}))

				newArr.push(createTiles({type: suitOrder[0], value: 1, amount: 1}))
				newArr.push(createTiles({type: suitOrder[0], value: 3, amount: 1}))
				newArr.push(createTiles({type: suitOrder[0], value: 5, amount: 1}))
				newArr.push(createTiles({type: suitOrder[0], value: 7, amount: 1}))
				newArr.push(createTiles({type: suitOrder[0], value: 9, amount: 1}))
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
			allSuitArrangements.forEach((suitOrder) => {
				let newArr = []
				tiles.push(newArr)

				newArr.push(createTiles({type: "flower", amount: 4}))

				newArr.push(createTiles({type: "dragon", value: dragon, amount: 3}))

				newArr.push(createTiles({type: suitOrder[0], value: 2, amount: 1}))
				newArr.push(createTiles({type: suitOrder[0], value: 1, amount: 1}))

				newArr.push(createTiles({type: suitOrder[1], value: 1, amount: 1}))
				newArr.push(createTiles({type: suitOrder[1], value: 3, amount: 1}))
				newArr.push(createTiles({type: suitOrder[1], value: 5, amount: 1}))
				newArr.push(createTiles({type: suitOrder[1], value: 7, amount: 1}))
				newArr.push(createTiles({type: suitOrder[1], value: 9, amount: 1}))
			})
		})

		return {
			tiles,
			score: 30,
			concealed: false
		}
	},
	function(tiles = []) {
		allTiles.forEach((anyTileOption) => {
			allSuitArrangements.forEach((suitOrder) => {
				let newArr = []
				tiles.push(newArr)
				newArr.push(createTiles({type: anyTileOption.type, value: anyTileOption.value, amount: 1}))

				newArr.push(createTiles({type: "wind", value: "north", amount: 1}))
				newArr.push(createTiles({type: "wind", value: "east", amount: 1}))
				newArr.push(createTiles({type: "wind", value: "west", amount: 1}))

				newArr.push(createTiles({type: suitOrder[0], value: 1, amount: 1}))

				newArr.push(createTiles({type: suitOrder[1], value: 3, amount: 3}))
				newArr.push(createTiles({type: suitOrder[1], value: 5, amount: 3}))

				newArr.push(createTiles({type: suitOrder[2], value: 9, amount: 3}))
			})
		})

		return {
			tiles,
			score: 30,
			concealed: false,
		}
	},
].map((func, index) => {
	let output = func()
	output.cardIndex = index
	output.section = "Oddly Matched"
	return output
})
