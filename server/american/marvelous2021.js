const utilities = require("./utilities.js")

//Order doesn't really matter (might influence sorting output if ratings end up the same, but that should be really minor),
//however putting cards under development last makes them much easier to review for accuracy, as they are at the end of the array.

let output = []
//TODO: We are probably going to want a setup for any pong/any kong (utilities.js getTileDifferential changes?)
//That would massively reduce the number of combos.
//We also need something to handle any tile - probably allow hands under 14 tiles, as the other tiles should fall under any tile.

output.push(...require("./marvelous2021/double-harness.js"))
output.push(...require("./marvelous2021/oddly-matched.js"))
output.push(...require("./marvelous2021/3-more-miles.js"))
output.push(...require("./marvelous2021/running-with-the-bulls.js"))

output = utilities.outputExpander(output)

console.log(output)
module.exports = {
	combos: output,
	name: "2021 Marvelous Mahjongg",
}
