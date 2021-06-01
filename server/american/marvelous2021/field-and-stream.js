const {allTiles, nonJokerTiles, createTiles, allSuits, allSuitArrangements, oddOptions, evenOptions, allOptions, windOptions, dragonOptions, dragonArrangments, suitDragonConversion, outputExpander, getTileDifferential}
= require("../utilities.js");


//Each function will return an array. Each array will contain every possible matching combo in the form of an array of tiles.
//#1, 2, 3, 4, 5, 6 of 7
module.exports = [
	//#1 generates a huge number of duplicates (~1000 of 3000 are duplicates).
	function(tiles = []) {
		allTiles.forEach((pongTileOption) => {
			allSuits.forEach((suitFor7) => {
				allSuits.forEach((suitForSecond7) => {
					allSuits.forEach((suitFor1) => {
						dragonOptions.forEach((dragon) => {
							let newArr = []
							tiles.push(newArr)

							newArr.push(createTiles({type: pongTileOption.type, value: pongTileOption.value, amount: 3}))

							newArr.push(createTiles({type: suitFor7, value: 7, amount: 1}))
							newArr.push(createTiles({type: "dragon", value: "white", amount: 1}))
							newArr.push(createTiles({type: "wind", value: "west", amount: 1}))

							newArr.push(createTiles({type: "any", value: "any", amount: 1}))

							newArr.push(createTiles({type: "flower", amount: 3}))

							newArr.push(createTiles({type: suitFor1, value: 1, amount: 1}))
							newArr.push(createTiles({type: "wind", value: "east", amount: 1}))
							newArr.push(createTiles({type: suitForSecond7, value: 7, amount: 1}))
							newArr.push(createTiles({type: "dragon", value: dragon, amount: 1}))
						})
					})
				})
			})
		})

		return {
			tiles,
			score: 30,
			concealed: false,
		}
	},
	function(tiles = []) {
		allTiles.forEach((anyTileOption) => {
			allSuits.forEach((suitFor2) => {
				allSuits.forEach((suitFor1) => {
					let newArr = []
					tiles.push(newArr)

					newArr.push(createTiles({type: suitFor2, value: 2, amount: 1}))
					newArr.push(createTiles({type: suitFor1, value: 1, amount: 1}))

					newArr.push(createTiles({type: "character", value: "any", amount: 1}))

					newArr.push(createTiles({type: anyTileOption.type, value: anyTileOption.value, amount: 2}))

					newArr.push(createTiles({type: "dragon", value: "red", amount: 3}))
					newArr.push(createTiles({type: "dragon", value: "green", amount: 3}))
					newArr.push(createTiles({type: "dragon", value: "white", amount: 3}))
				})
			})
		})

		return {
			tiles,
			score: 30,
			concealed: false,
			skipDuplicateRemoval: true //No duplicates. Some combos.
		}
	},
	function(tiles = []) {
		allTiles.forEach((kongTileOption) => {
			allSuits.forEach((suitFor2) => {
				allSuits.forEach((suitFor7) => {
					allSuits.forEach((suitFor1) => {
						let newArr = []
						tiles.push(newArr)

						newArr.push(createTiles({type: "dragon", value: "white", amount: 1}))
						newArr.push(createTiles({type: "character", value: "any", amount: 1}))

						newArr.push(createTiles({type: kongTileOption.type, value: kongTileOption.value, amount: 4}))

						newArr.push(createTiles({type: "wind", value: "south", amount: 3}))

						newArr.push(createTiles({type: suitFor2, value: 2, amount: 2}))


						newArr.push(createTiles({type: "any", value: "any", amount: 1}))
						newArr.push(createTiles({type: suitFor1, value: 1, amount: 1}))
						newArr.push(createTiles({type: suitFor7, value: 7, amount: 1}))
					})
				})
			})
		})
		return {
			tiles,
			score: 30,
			concealed: false,
			skipDuplicateRemoval: true //No duplicates and lots of combos.
		}
	},
	function(tiles = []) {
		allTiles.forEach((kongTileOption) => {
			allSuits.forEach((suitFor4s) => {
				let newArr = []
				tiles.push(newArr)

				newArr.push(createTiles({type: "dragon", value: "white", amount: 1}))
				newArr.push(createTiles({type: "character", value: "any", amount: 1}))
				newArr.push(createTiles({type: "wind", value: "south", amount: 1}))
				newArr.push(createTiles({type: "wind", value: "north", amount: 1}))

				newArr.push(createTiles({type: suitFor4s, value: 4, amount: 3}))

				newArr.push(createTiles({type: "wind", value: "west", amount: 1}))
				newArr.push(createTiles({type: "dragon", value: "white", amount: 1}))
				newArr.push(createTiles({type: "dragon", value: "red", amount: 1}))

				newArr.push(createTiles({type: kongTileOption.type, value: kongTileOption.value, amount: 4}))
			})
		})

		return {
			tiles,
			score: 30,
			concealed: false,
			skipDuplicateRemoval: true //No duplicates. Some combos.
		}
	},
	function(tiles = []) {
		allTiles.forEach((anyTileOption) => {
			allSuits.forEach((suitFor7) => {
				allTiles.forEach((pongTileOption) => {
					let newArr = []
					tiles.push(newArr)

					newArr.push(createTiles({type: "wind", value: "west", amount: 1}))

					newArr.push(createTiles({type: anyTileOption.type, value: anyTileOption.value, amount: 2}))
					
					newArr.push(createTiles({type: "dragon", value: "green", amount: 1}))
					newArr.push(createTiles({type: "dragon", value: "white", amount: 1}))
					newArr.push(createTiles({type: "wind", value: "north", amount: 1}))

					newArr.push(createTiles({type: pongTileOption.type, value: pongTileOption.value, amount: 3}))

					newArr.push(createTiles({type: suitFor7, value: 7, amount: 1}))

					newArr.push(createTiles({type: "wind", value: "east", amount: 3}))

					newArr.push(createTiles({type: "dragon", value: "red", amount: 1}))
				})
			})
		})

		return {
			tiles,
			score: 30,
			concealed: false,
			skipDuplicateRemoval: true //No duplicates. Lots of combos.
		}
	},
	function(tiles = []) {
		allSuits.forEach((suitFor7) => {
			allTiles.forEach((kongTileOption) => {
				let newArr = []
				tiles.push(newArr)

				newArr.push(createTiles({type: "bamboo", value: "any", amount: 1}))
				newArr.push(createTiles({type: "any", value: "any", amount: 1}))
				newArr.push(createTiles({type: "bamboo", value: "any", amount: 1}))
				newArr.push(createTiles({type: "wind", value: "east", amount: 1}))

				newArr.push(createTiles({type: "bamboo", value: "any", amount: 1}))
				newArr.push(createTiles({type: suitFor7, value: 7, amount: 1}))
				newArr.push(createTiles({type: "wind", value: "east", amount: 1}))
				newArr.push(createTiles({type: "wind", value: "west", amount: 1}))

				newArr.push(createTiles({type: "dragon", value: "white", amount: 1}))
				newArr.push(createTiles({type: "character", value: "any", amount: 1}))

				newArr.push(createTiles({type: kongTileOption.type, value: kongTileOption.value, amount: 4}))
			})
		})

		return {
			tiles,
			score: 35,
			concealed: false,
		}
	},
].map((func, index) => {
	let output = func()
	output.cardIndex = index
	output.section = "Field and Stream"
	return output
})
