const utilities = require("./utilities.js")

//Order doesn't really matter (might influence sorting output if ratings end up the same, but that should be really minor),
//however putting cards under development last makes them much easier to review for accuracy, as they are at the end of the array.

//NOTE: Current, "any" only works for single tiles.
//It only works for tiles that are any value.
//Tiles that are any type are not currently supported.

function calculateCombos() {
	let output = []

	output.push(...require("./marvelous2022/animal-magnetism.js"))
	output.push(...require("./marvelous2022/atomic.js"))
	output.push(...require("./marvelous2022/circus-oddity.js"))
	output.push(...require("./marvelous2022/crak-the-whip.js"))
	output.push(...require("./marvelous2022/evenly-striped.js"))
	output.push(...require("./marvelous2022/it's-a-jungle-in-here.js"))
	output.push(...require("./marvelous2022/nine-lives.js"))
	output.push(...require("./marvelous2022/out-numbered.js"))
	output.push(...require("./marvelous2022/out-run.js"))
	output.push(...require("./marvelous2022/sub-atomic.js"))

	return utilities.outputExpander(output)
}

let exportObj = {
	name: "2022 Marvelous Mahjongg",
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
