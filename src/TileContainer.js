const Tile = require("./Tile.js")

class TileContainer {
	constructor(config = {}) {
		this.isDouble = function(userWind) {return false}
		this.getPoints = function() {return 0}

		if (!config.tiles instanceof Array) {throw "config.tiles must be an array of Tiles"}

		this.tiles = config.tiles

		this.exposed = true
		this.isSequence = false
		this.isPongOrKong = false
		this.isPair = false

		this.toJSON = (function() {
			let obj = {}
			obj.class = "TileContainer"
			obj.exposed = this.exposed
			obj.tiles = this.tiles

			return JSON.stringify(obj)
		}).bind(this)
	}

	static findNonJoker(tiles) {
		return tiles.find((tile) => {return tile.type !== "joker"})
	}

	isValidMatch(allowJokers = false) {
		//Confirm that the tiles all match.
		let validationTile = TileContainer.findNonJoker(this.tiles)

		if (!validationTile) {return false}

		if (this.tiles.every((tile) => {
			if (
				tile.matches(validationTile)
				|| (allowJokers && tile.type === "joker")
			) {return true}
		})) {return validationTile} //Truthy, and tells them what the match is of.
		else {return false}
	}

	static isValidMatch(tiles, allowJokers) {
		return new TileContainer({tiles}).isValidMatch(allowJokers)
	}

	static fromJSON(str) {
		let obj = JSON.parse(str)
		if (obj.class !== "TileContainer") {throw "String was not created by TileContainer.toJSON()"}

		obj.tiles = obj.tiles.map((tileString) => {
			return Tile.fromJSON(tileString)
		})

		return new TileContainer(obj)
	}
}

module.exports = TileContainer
