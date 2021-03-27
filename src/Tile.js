class Tile {
	constructor(config = {}) {
		this.type = config.type //Ex. wind, bamboo, character, pretty, dragon
		this.value = config.value //Ex. 1,3 red, west

		this.tileName = this.value + " " + this.type //TODO: Should we capitalize?
		if (config.faceDown) {
			this.faceDown = true
			this.imageUrl = "assets/tiles/face-down.png"
			//Some face down tiles might be part of a kong.
			if (this.value && this.type) {
				this.tileName = "Face Down " + this.tileName
			}
			else {
				this.tileName = "Face Down Tile"
			}
		}
		else if (this.type === "joker") {
			this.imageUrl = "assets/tiles/joker.png"
		}
		else {
			this.imageUrl = "assets/tiles/" + this.type + "s" + "/" + this.value + ".png"
		}

		this.matches = function(tile) {
			if (this.faceDown) {return false}
			if (["flower", "season"].includes(this.type) && ["flower", "season"].includes(tile.type)) {
				//For American Mahjong - all flowers and seasons are identical.
				//Since Chinese mahjong uses Pretty tiles, this is enough to check.
				return true
			}
			if (tile instanceof Tile && tile.type === this.type && tile.value === this.value) {return true}
			return false
		}

		this.isDouble = function(userWind) {return 0}
		this.getPoints = function() {return 0}

		this.toJSON = (function() {
			let obj = {}
			obj.class = "Tile"
			obj.type = this.type
			obj.value = this.value
			if (this.faceDown) {obj.faceDown = this.faceDown}

			return JSON.stringify(obj)
		}).bind(this)

		this.isSequence = false
		this.isPongOrKong = false
		this.isPair = false
	}

	static fromJSON(str) {
		let obj = JSON.parse(str)
		if (obj.class !== "Tile") {throw "String was not created by Tile.toJSON()"}
		return new Tile(obj)
	}
}

module.exports = Tile
