class Tile {
	constructor(config = {}) {
		this.type = config.type //Ex. wind, bamboo, character, pretty, dragon
		this.value = config.value //Ex. 1,3 red, west

		this.getTileName = (function(gameStyle = "chinese") {
			let tileName = this.value + " " + this.type

			if (gameStyle === "american") {
				let americanTranslations = {
					"bamboo": "bam",
					"character": "crak",
					"circle": "dot"
				}

				if (["flower", "season"].includes(this.type)) {
					tileName = "flower"
				}
				else {
					tileName = this.value + " " + (americanTranslations[this.type] || this.type)
				}
			}

			if (this.faceDown) {
				//Some face down tiles might be part of a kong.
				if (this.value && this.type) {
					tileName = "Face Down " + tileName
				}
				else {
					tileName = "Face Down Tile"
				}
			}

			return tileName
		}).bind(this)

		if (!this.value && (this.type === "flower" || this.type === "season")) {
			//American Mahjongg - if no value set, pick random.
			//This should only apply for card generated hands, etc, where the flower/season is generic.

			//We might also want to randomize flower/season, just to be fancy.
			this.value = Math.ceil(Math.random() * 4)
		}

		if (config.faceDown) {this.faceDown = true}

		this.matches = function(tile) {
			if (this.faceDown) {return false}
			if (tile instanceof Tile && tile.type === this.type && tile.value === this.value) {return true}
			if (["flower", "season"].includes(this.type) && ["flower", "season"].includes(tile.type)) {
				//For American Mahjong - all flowers and seasons are identical.
				//Since Chinese mahjong uses Pretty tiles, this is enough to check.
				return true
			}
			if (tile.type === "joker" && tile.type === this.type) {return true} //Value no-op for jokers.
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

	getImageUrl(options = {}) {
		//TODO: Fix all callers so that this mess isn't needed.
		options.americanTiles = options.americanTiles ?? globalThis.document?.querySelector("#gameBoard")?.classList?.contains("american")

		if (this.faceDown) {
			return "assets/tiles/face-down.png"
		}
		else if (this.type === "joker") {
		 	return "assets/tiles/joker.png"
		}
		else if ((this.type === "bamboo" || this.type === "circle") && options.americanTiles) {
			return "assets/tiles/" + this.type + "s" + "/numbered/" + this.value + ".png"
		}
		else {
			return "assets/tiles/" + this.type + "s" + "/" + this.value + ".png"
		}
	}

	static fromJSON(str) {
		let obj = JSON.parse(str)
		if (obj.class !== "Tile") {throw "String was not created by Tile.toJSON()"}
		return new Tile(obj)
	}
}

module.exports = Tile
