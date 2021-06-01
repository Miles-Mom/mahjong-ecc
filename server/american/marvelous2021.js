const utilities = require("./utilities.js")

//Order doesn't really matter (might influence sorting output if ratings end up the same, but that should be really minor),
//however putting cards under development last makes them much easier to review for accuracy, as they are at the end of the array.

//NOTE: Current, "any" only works for single tiles.
//It only works for tiles that are any value.
//Tiles that are any type are not currently supported. 

function calculateCombos() {
	let output = []
	//TODO: We are probably going to want a setup for any pong/any kong (utilities.js getTileDifferential changes?)
	//That would massively reduce the number of combos.
	//We also need something to handle any tile - probably allow hands under 14 tiles, as the other tiles should fall under any tile.

	output.push(...require("./marvelous2021/double-harness.js"))
	output.push(...require("./marvelous2021/oddly-matched.js"))
	output.push(...require("./marvelous2021/3-more-miles.js"))
	output.push(...require("./marvelous2021/running-with-the-bulls.js"))
	output.push(...require("./marvelous2021/what's-your-number-please.js"))
	output.push(...require("./marvelous2021/field-and-stream.js"))
	output.push(...require("./marvelous2021/sub-atomic.js"))
	output.push(...require("./marvelous2021/carpe-diem.js"))
	output.push(...require("./marvelous2021/quintaabulous.js"))

	return utilities.outputExpander(output)
}

let exportObj = {
	name: "2021 Marvelous Mahjongg",
}

let cache;
Object.defineProperty(exportObj, "combos", {
	get: function() {
		if (cache) {return cache}
		else {
			console.time("Generate " + exportObj.name)
			cache = calculateCombos()
			console.timeEnd("Generate " + exportObj.name)
			return cache
		}
	}
})

module.exports = exportObj
