const {allTiles, nonJokerTiles, createTiles, allSuits, allSuitArrangements, oddOptions, evenOptions, allOptions, windOptions, dragonOptions, dragonArrangments, suitDragonConversion, outputExpander, getTileDifferential}
= require("../utilities.js");


//Each function will return an array. Each array will contain every possible matching combo in the form of an array of tiles.
//All 7 hands supported
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
			skipDuplicateRemoval: true //No duplicates and lots of combos.
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
	function(tiles = []) {
		allSuitArrangements.forEach((suitOrder) => {
			let newArr = []
			tiles.push(newArr)
			newArr.push(createTiles({type: "any", value: "any", amount: 1}))

			newArr.push(createTiles({type: "wind", value: "north", amount: 1}))
			newArr.push(createTiles({type: "wind", value: "east", amount: 1}))
			newArr.push(createTiles({type: "wind", value: "west", amount: 1}))

			newArr.push(createTiles({type: suitOrder[0], value: 2, amount: 1}))

			newArr.push(createTiles({type: suitOrder[1], value: 4, amount: 3}))
			newArr.push(createTiles({type: suitOrder[1], value: 6, amount: 3}))

			newArr.push(createTiles({type: suitOrder[2], value: 8, amount: 3}))
		})

		return {
			tiles,
			score: 30,
			concealed: false,
		}
	},
	function(tiles = []) {
		allSuitArrangements.forEach((suitOrder) => {
			let newArr = []
			tiles.push(newArr)
			newArr.push(createTiles({type: "flower", amount: 2}))

			newArr.push(createTiles({type: suitOrder[0], value: 2, amount: 3}))
			newArr.push(createTiles({type: "dragon", value: "white", amount: 3}))
			newArr.push(createTiles({type: suitOrder[1], value: 2, amount: 3}))
			newArr.push(createTiles({type: suitOrder[2], value: 1, amount: 3}))
		})

		return {
			tiles,
			score: 30,
			concealed: false,
		}
	},
	function(tiles = []) {
		evenOptions.forEach((offset) => {
			allSuits.forEach((suitFor7) => {
				allSuitArrangements.forEach((suitOrder) => {
					let newArr = []
					tiles.push(newArr)
					newArr.push(createTiles({type: "wind", value: "south", amount: 1}))
					newArr.push(createTiles({type: suitFor7, value: 7, amount: 1}))
					newArr.push(createTiles({type: "wind", value: "east", amount: 1}))
					newArr.push(createTiles({type: "wind", value: "west", amount: 1}))

					newArr.push(createTiles({type: "dragon", value: "white", amount: 1}))
					newArr.push(createTiles({type: "flower", amount: 1}))

					newArr.push(createTiles({type: suitOrder[0], value: offset, amount: 3}))
					newArr.push(createTiles({type: suitOrder[1], value: offset, amount: 2}))
					newArr.push(createTiles({type: suitOrder[2], value: offset, amount: 3}))
				})
			})
		})

		return {
			tiles,
			score: 35,
			concealed: false,
		}
	},
	function(tiles = []) {
		allTiles.forEach((pongTileOption) => {
			allSuits.forEach((suitFor1) => {
				allSuitArrangements.forEach((suitOrder) => {
					let newArr = []
					tiles.push(newArr)

					newArr.push(createTiles({type: pongTileOption.type, value: pongTileOption.value, amount: 3}))

					newArr.push(createTiles({type: "any", value: "any", amount: 1}))

					newArr.push(createTiles({type: "wind", value: "south", amount: 1}))
					newArr.push(createTiles({type: suitFor1, value: 1, amount: 1}))
					newArr.push(createTiles({type: "dragon", value: "white", amount: 1}))
					newArr.push(createTiles({type: "wind", value: "north", amount: 1}))

					newArr.push(createTiles({type: suitOrder[0], value: 8, amount: 3}))
					newArr.push(createTiles({type: suitOrder[1], value: 4, amount: 1}))

					newArr.push(createTiles({type: "wind", value: "west", amount: 1}))
					newArr.push(createTiles({type: "joker", amount: 1}))
				})
			})
		})

		allTiles.forEach((pongTileOption) => {
			allSuits.forEach((suitFor1) => {
				allSuits.forEach((suit) => {
					let newArr = []
					tiles.push(newArr)

					newArr.push(createTiles({type: pongTileOption.type, value: pongTileOption.value, amount: 3}))

					newArr.push(createTiles({type: "any", value: "any", amount: 1}))

					newArr.push(createTiles({type: "wind", value: "south", amount: 1}))
					newArr.push(createTiles({type: suitFor1, value: 1, amount: 1}))
					newArr.push(createTiles({type: "dragon", value: "white", amount: 1}))
					newArr.push(createTiles({type: "wind", value: "north", amount: 1}))

					newArr.push(createTiles({type: suit, value: 8, amount: 3}))
					newArr.push(createTiles({type: suit, value: 4, amount: 1}))

					newArr.push(createTiles({type: "wind", value: "west", amount: 1}))
					newArr.push(createTiles({type: "joker", amount: 1}))
				})
			})
		})

		return {
			tiles,
			score: 40,
			concealed: false,
		}
	},
].map((func, index) => {
	let output = func()
	output.cardIndex = index
	output.section = "Double Harness"
	return output
})
