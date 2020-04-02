const Tile = require("./Tile.js")
const Hand = require("./Hand.js")

function createTopOrBottomHand(handId) {
	let hand = document.createElement("div")
	hand.id = handId
	document.body.appendChild(hand)
	return hand
}

function createLeftOrRightHand(handId, containerId) {
	let hand = createTopOrBottomHand(handId)

	//We will return the container for the tiles. A container is used for the left and right hands in order to vertically center the tiles.
	let container = document.createElement("div")
	container.id = containerId
	hand.appendChild(container)

	return container
}

window.Tile = Tile
window.Sequence = require("./Sequence.js")
window.Match = require("./Match.js")


function createTilePlacemat() {
	let tilePlacemat = document.createElement("div")
	tilePlacemat.id = "tilePlacemat"
	return tilePlacemat
}

let tilePlacemat = createTilePlacemat()
document.body.appendChild(tilePlacemat)

//For testing.

let tiles = new (require("./Wall.js"))().tiles
console.log(tiles)



let handTiles = tiles.slice(-14)

let userHandElem = createTopOrBottomHand("userHand")
let userHandElemExposed = createTopOrBottomHand("userHandExposed")
let userHand = new Hand({
	handToRender: userHandElem,
	handForExposed: userHandExposed,
	interactive: true,
	tilePlacemat: tilePlacemat
})
console.log(userHand)

window.userHand = userHand

//userHand.sortTiles(handTiles)
handTiles.forEach((value) => {
	userHand.add(value)
})
userHand.renderTiles()



let leftHandTiles = tiles.slice(-28, -14)
let leftHandContainer = createLeftOrRightHand("leftHand", "leftHandContainer")

let leftHand = new Hand({
	handToRender: leftHandContainer
})

leftHandTiles.forEach((value) => {leftHand.add(value)})
leftHand.renderTiles()




let rightHandTiles = tiles.slice(-42, -28)


let rightHandContainer = createLeftOrRightHand("rightHand", "rightHandContainer")

function drawRightTile(tile) {
	let elem = document.createElement("img")
	elem.src = tile.imageUrl
	rightHandContainer.appendChild(elem)
}

for (let i=0;i<rightHandTiles.length;i++) {
	let rightHandTile = rightHandTiles[i]
	drawRightTile(rightHandTile)
}




let topHandTiles = tiles.slice(-56, -42)


let topHand = createTopOrBottomHand("topHand")


function drawTopTile(tile) {
	let elem = document.createElement("img")
	elem.src = tile.imageUrl
	topHand.appendChild(elem)
}

for (let i=0;i<topHandTiles.length;i++) {
	let topHandTile = topHandTiles[i]
	//drawTopTile(topHandTile)
	drawTopTile(new Tile({faceDown: true}))
}
