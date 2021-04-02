const {createTiles, allSuits, allSuitArrangements, oddOptions, evenOptions, allOptions, dragonOptions, dragonArrangments, windOptions, suitDragonConversion}
= require("../utilities.js");

//Each function will return an array. Each array will contain every possible matching combo in the form of an array of tiles.
module.exports = [
	function(tiles = []) {
		allSuitArrangements.forEach((suitOrder) => {
			let newArr = []
			tiles.push(newArr)

			newArr.push(createTiles({type: suitOrder[0], value: 3, amount: 3}))
			newArr.push(createTiles({type: suitOrder[0], value: 6, amount: 4}))

			newArr.push(createTiles({type: suitOrder[1], value: 6, amount: 3}))
			newArr.push(createTiles({type: suitOrder[1], value: 9, amount: 4}))
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
	output.section = "369"
	return output
})
