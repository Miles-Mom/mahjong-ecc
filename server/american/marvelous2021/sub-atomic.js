const {allTiles, nonJokerTiles, createTiles, allSuits, allSuitArrangements, oddOptions, evenOptions, allOptions, windOptions, dragonOptions, dragonArrangments, suitDragonConversion, outputExpander, getTileDifferential}
= require("../utilities.js");


//Each function will return an array. Each array will contain every possible matching combo in the form of an array of tiles.
module.exports = [
	function(tiles = []) {
		allSuits.forEach((suit) => {
			allSuitArrangements.forEach((triColorOrder) => {
				let newArr = []
				tiles.push(newArr)

				newArr.push(createTiles({type: "any", value: "any", amount: 1}))
				allOptions.forEach((num) => {
					newArr.push(createTiles({type: suit, value: num, amount: 1}))
				})

				newArr.push(createTiles({type: triColorOrder[0], value: 2, amount: 1}))
				newArr.push(createTiles({type: "dragon", value: "white", amount: 1}))
				newArr.push(createTiles({type: triColorOrder[1], value: 2, amount: 1}))
				newArr.push(createTiles({type: triColorOrder[2], value: 1, amount: 1}))
			})
		})

		console.log(tiles)
		return {
			tiles,
			score: 30,
			concealed: true,
		}
	},
].map((func, index) => {
	let output = func()
	output.cardIndex = index
	output.section = "Sub Atomic"
	return output
})
