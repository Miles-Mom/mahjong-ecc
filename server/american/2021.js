const utilities = require("./utilities.js")

//Order doesn't really matter (might influence sorting output if ratings end up the same, but that should be really minor),
//however putting cards under development last makes them much easier to review for accuracy, as they are at the end of the array.
function calculateCombos() {
	let output = []
	output = output.concat(require("./2021/quints.js"))
	output = output.concat(require("./2021/consecutive-run.js"))
	output = output.concat(require("./2021/13579.js"))
	output = output.concat(require("./2021/any-like-numbers.js"))
	output = output.concat(require("./2021/2468.js"))
	output = output.concat(require("./2021/2021.js"))
	output = output.concat(require("./2021/winds-dragons.js"))
	output = output.concat(require("./2021/369.js"))
	output = output.concat(require("./2021/singles-and-pairs.js"))

	return utilities.outputExpander(output)
}

let exportObj = {
	name: "2021 National Mahjongg League"
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
