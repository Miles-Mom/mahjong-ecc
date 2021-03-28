const utilities = require("./utilities.js")

let output = []
output = output.concat(require("./2020/winds-dragons.js"))
output = output.concat(require("./2020/consecutive-run.js"))
output = output.concat(require("./2020/quints.js"))
output = output.concat(require("./2020/any-like-numbers.js"))
output = output.concat(require("./2020/2468.js"))

output = utilities.outputExpander(output)

/*let tempHand = []
tempHand = tempHand.concat(utilities.createTiles({type: "joker", value: "", amount: 5}))
tempHand.push(utilities.createTiles({type: "wind", value: "north", amount: 4}))
tempHand = tempHand.concat(utilities.createTiles({type: "wind", value: "east", amount: 2}))
tempHand = tempHand.concat(utilities.createTiles({type: "wind", value: "south", amount: 3}))

//console.log(tempHand)

let newArr = []
newArr.push(utilities.createTiles({type: "flower", value: "4", amount: 2})) //Value is no-op here.
newArr.push(utilities.createTiles({type: "wind", value: "north", amount: 3}))
newArr.push(...utilities.createTiles({type: "wind", value: "east", amount: 3}))
newArr.push(...utilities.createTiles({type: "wind", value: "west", amount: 3}))
newArr.push(...utilities.createTiles({type: "wind", value: "south", amount: 3}))

console.log(newArr)
console.log(utilities.getTileDifferential(output, newArr))
console.log(tempHand)
console.log(utilities.getTileDifferential(output, tempHand))
*/


let doubleMahjong = []
doubleMahjong.push(...utilities.createTiles({type: "bamboo", value: 1, amount: 2}))
doubleMahjong.push(...utilities.createTiles({type: "bamboo", value: 2, amount: 2}))
doubleMahjong.push(...utilities.createTiles({type: "bamboo", value: 3, amount: 2}))

doubleMahjong.push(...utilities.createTiles({type: "joker", value: "", amount: 8}))

console.time("Calc")
console.log(utilities.getTileDifferential(output, doubleMahjong))
console.timeEnd("Calc")

console.log(output)
module.exports = output
