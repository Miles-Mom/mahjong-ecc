class Tile {
	constructor(config = {}) {
		this.type = config.type //Ex. wind, bamboo, character, pretty, dragon
		this.value = config.value //Ex. 1,3 red, west

		if (!this.value && (this.type === "flower" || this.type === "season")) {
			//American Mahjongg - if no value set, pick random.
			//This should only apply for card generated hands (ex, Suggested Hands), where there is no preset value.

			//We might also want to randomize flower/season, just to be fancy.
			this.value = Math.ceil(Math.random() * 4)
		}

		if (config.faceDown) {this.faceDown = true}
	}

	static americanTranslations = {
		"bamboo": "bam",
		"character": "crak",
		"circle": "dot"
	}

	getTileName(gameStyle = "chinese") {
		let tileName = this.value + " " + this.type

		if (gameStyle === "american") {
			if (["flower", "season"].includes(this.type)) {
				tileName = "flower"
			}
			else {
				tileName = this.value + " " + (Tile.americanTranslations[this.type] || this.type)
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
	}

	getImageUrl(options = {}) {
		if (this.faceDown) {
			return "assets/tiles/face-down.png"
		}
		else if (this.type === "joker") {
		 	return "assets/tiles/joker.png"
		}
		else {
			return "assets/tiles/" + this.type + "s" + "/" + this.value + ".png"
		}
	}

	matches(tile) {
		if (this.faceDown || !(tile instanceof Tile)) {return false}

		if (tile.type === this.type && tile.value === this.value) {return true}
		if (this.type === "joker" && tile.type === this.type) {return true} //Value no-op for jokers.
		if (
			//For American Mahjong - all flowers and seasons are identical.
			//Since Chinese mahjong uses Prettys, not flower/season Tiles this is enough to check.
			(this.type === "flower" || this.type === "season")
			&& (tile.type === "flower" || tile.type === "season")
		) {return true}
		return false
	}

	getTileValue() {
		//The greater the value, the further to the right we place the tile.

		let tileValue = 100 //Pretty starts at 0.

		tileValue += 100 * ["flower", "season", "circle", "bamboo", "character", "wind", "dragon", "joker"].findIndex((suit) => {return this.type === suit})

		if (typeof this.value === "number") {tileValue += this.value}
		else if (this.type === "wind") {
			tileValue += 10 * ["north", "east", "south", "west"].findIndex((value) => {return this.value === value})
		}
		else if (this.type === "dragon") {
			tileValue += 10 * ["red", "green", "white"].findIndex((value) => {return this.value === value})
		}
		else if (this.type === "flower" || this.type === "season") {}
		else if (!this.faceDown && this.type !== "joker") {console.error("Couldn't fully calculate ", this)}
		return tileValue
	}

	getPoints() {return 0}
	isDouble() {return 0}

	isSequence = false
	isPongOrKong = false
	isPair = false

	toJSON() {
		let obj = {}
		obj.class = "Tile"
		obj.type = this.type
		obj.value = this.value
		if (this.faceDown) {obj.faceDown = this.faceDown}

		return JSON.stringify(obj)
	}

	static fromJSON(str) {
		let obj = JSON.parse(str)
		if (obj.class !== "Tile") {throw "String was not created by Tile.toJSON()"}
		return new Tile(obj)
	}
}

module.exports = Tile
