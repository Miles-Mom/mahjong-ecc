const utilities = require("./utilities.js")

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

output = utilities.outputExpander(output)

console.log(output)
module.exports = {
	combos: output,
	name: "2020 National Mahjongg League"
}
