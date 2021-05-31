const {allTiles, nonJokerTiles, createTiles, allSuits, allSuitArrangements, oddOptions, evenOptions, allOptions, windOptions, dragonOptions, dragonArrangments, suitDragonConversion, outputExpander, getTileDifferential}
= require("../utilities.js");


//Each function will return an array. Each array will contain every possible matching combo in the form of an array of tiles.
//#1 of 7
module.exports = [
	//#1 generates a huge number of duplicates, but our remover isn't very fast, as it is quadratic.
	//We return an empty array right now.
	//We need to find a way to non-quadratically remove duplicates (so linear - need to stringify)
	//Either that or rewrite so that the suitForSecond7 and suitFor7 don't regenerate the same combos.
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
].map((func, index) => {
	let output = func()
	output.cardIndex = index
	output.section = "Field and Stream"
	return output
})
