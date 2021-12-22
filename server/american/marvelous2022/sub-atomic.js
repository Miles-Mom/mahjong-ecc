const {allTiles, nonJokerTiles, createTiles, allSuits, allSuitArrangements, oddOptions, evenOptions, allOptions, windOptions, windArrangments, dragonOptions, dragonArrangments, suitDragonConversion, outputExpander, getTileDifferential}
= require("../utilities.js");


//Each function will return an array. Each array will contain every possible matching combo in the form of an array of tiles.
//No hands supported.
module.exports = [
	function(tiles = []) {
		allSuits.forEach((runSuit) => {
			allSuits.forEach((suitFor2) => {
				allSuits.forEach((suitFor1) => {
					let newArr = []

					//21GER
					newArr.push(createTiles({type: suitFor2, value: 2, amount: 1}))
					newArr.push(createTiles({type: suitFor1, value: 1, amount: 1}))
					newArr.push(createTiles({type: "dragon", value: "green", amount: 1}))
					newArr.push(createTiles({type: "wind", value: "east", amount: 1}))
					newArr.push(createTiles({type: "dragon", value: "red", amount: 1}))

					//123456789
					allOptions.forEach((item, i) => {
						newArr.push(createTiles({type: runSuit, value: item, amount: 1}))
					});

					tiles.push(newArr)
				})
			})
		})

		return {
			tiles,
			score: 40,
			concealed: true,
		}
	},
].map((func, index) => {
	let output = func()
	output.cardIndex = index
	output.section = "Sub-Atomic"
	return output
})
