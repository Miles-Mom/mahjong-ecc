const {allTiles, nonJokerTiles, createTiles, allSuits, allSuitArrangements, oddOptions, evenOptions, allOptions, windOptions, windArrangments, dragonOptions, dragonArrangments, suitDragonConversion, outputExpander, getTileDifferential}
= require("../utilities.js");


//Each function will return an array. Each array will contain every possible matching combo in the form of an array of tiles.
//#1 of 5
module.exports = [
	function(tiles = []) {
		let newArr = []
		tiles.push(newArr)

		newArr.push(createTiles({type: "any", value: "any", amount: 2}))
		newArr.push(createTiles({type: "any", value: "any", amount: 3}))
		newArr.push(createTiles({type: "any", value: "any", amount: 4}))
		newArr.push(createTiles({type: "any", value: "any", amount: 5}))

		return {
			tiles,
			score: 35,
			concealed: false,
			maxJokers: 1 //Technically, a hand using more than one joker is NOT dead, as somebody might swap, but hoping for other people to mess up in order to not be dead is not a good strategy. 
		}
	},
].map((func, index) => {
	let output = func()
	output.cardIndex = index
	output.section = "Quintaabulous"
	return output
})
