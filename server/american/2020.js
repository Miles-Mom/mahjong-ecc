const utilities = require("./utilities.js")

function calculateCombos() {
	let output = []
	output = output.concat(require("./2020/winds-dragons.js"))
	output = output.concat(require("./2020/consecutive-run.js"))
	output = output.concat(require("./2020/quints.js"))
	output = output.concat(require("./2020/any-like-numbers.js"))
	output = output.concat(require("./2020/2468.js"))
	output = output.concat(require("./2020/2020.js"))
	output = output.concat(require("./2020/13579.js"))
	output = output.concat(require("./2020/369.js"))
	output = output.concat(require("./2020/singles-and-pairs.js"))

	return utilities.outputExpander(output)
}

let exportObj = {
	name: "2020 National Mahjongg League"
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
