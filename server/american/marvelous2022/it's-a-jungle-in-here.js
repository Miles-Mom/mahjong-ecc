const {allTiles, nonJokerTiles, createTiles, allSuits, allSuitArrangements, oddOptions, evenOptions, allOptions, windOptions, windArrangments, dragonOptions, dragonArrangments, suitDragonConversion, outputExpander, getTileDifferential}
= require("../utilities.js");


//Each function will return an array. Each array will contain every possible matching combo in the form of an array of tiles.
//No hands supported.
module.exports = [

].map((func, index) => {
	let output = func()
	output.cardIndex = index
	output.section = "It's a Jungle in Here!"
	return output
})
