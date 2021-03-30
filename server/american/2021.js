const utilities = require("./utilities.js")

let output = []
output = output.concat(require("./2021/winds-dragons.js"))
output = output.concat(require("./2021/consecutive-run.js"))
output = output.concat(require("./2021/quints.js"))
output = output.concat(require("./2021/any-like-numbers.js"))
output = output.concat(require("./2021/2468.js"))
output = output.concat(require("./2021/2021.js"))
output = output.concat(require("./2021/13579.js"))
output = output.concat(require("./2021/369.js"))
output = output.concat(require("./2021/singles-and-pairs.js"))

output = utilities.outputExpander(output)

console.log(output)
module.exports = output
