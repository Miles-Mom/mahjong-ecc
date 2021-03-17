const Tile = require("./Tile.js")

//TileContainer isn't supported by quite a bit of code, as it is typically assumed to be a Tile or an unknown class.
//That said, it doesn't need to be. It's American Mahjong only. 
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
