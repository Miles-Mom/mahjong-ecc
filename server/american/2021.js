const utilities = require("./utilities.js")

//Order doesn't really matter (might influence sorting output if ratings end up the same, but that should be really minor),
//however putting cards under development last makes them much easier to review for accuracy, as they are at the end of the array.
let output = []
output = output.concat(require("./2021/quints.js"))
output = output.concat(require("./2021/consecutive-run.js"))
output = output.concat(require("./2021/13579.js"))
output = output.concat(require("./2021/any-like-numbers.js"))
output = output.concat(require("./2021/2468.js"))
output = output.concat(require("./2021/2021.js")) //TODO: #3 disabled due to support issues. 
output = output.concat(require("./2021/winds-dragons.js"))
output = output.concat(require("./2021/369.js"))
output = output.concat(require("./2021/singles-and-pairs.js"))

output = utilities.outputExpander(output)

console.log(output)
module.exports = output
