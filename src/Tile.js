const {i18n} = require("./i18nHelper.js")

// Note this is mix-usage by both client+server sides
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

	//If default locale parameter is used on the client side, great; if on the server side, no harm is done.
	getTileName(gameStyle = "chinese", locale = i18n.getLocale()) {
		let tileName;

		if (gameStyle === "american") {
			if (["flower", "season"].includes(this.type)) {
				tileName = "flower"
			}
			else {
				tileName = this.value + " " + (Tile.americanTranslations[this.type] || this.type)
			}
		}
		else {
			tileName =  this.type

			if (tileName === "dragon" || tileName === "wind" || tileName === "flower" || tileName === "season") {
				tileName = this.value + " " + tileName
				tileName = i18n.__({phrase: tileName, locale: locale})
			}
			else {
				tileName = i18n.__n({singular: "%d " + tileName, plural: "%d " + tileName, locale: locale, count: this.value})
			}
		}


		if (this.faceDown) {
			//Some face down tiles might be part of a kong.
			if (this.value && this.type) {
				tileName = i18n.__({phrase: "Face Down %s" , locale: locale}, tileName)
			}
			else {
				tileName = i18n.__({phrase: "Face Down Tile", locale: locale})
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
		else if (this.type === "any") {
			return "assets/tiles/any/" + this.value + ".png"
		}
		else if (this.value === "any") {
			return "assets/tiles/any/" + this.type + ".png"
		}
		else {
			return "assets/tiles/" + this.type + "s" + "/" + this.value + ".png"
		}
	}

	static createImageElem(options = {}) {
		//We may want to do upscaling and rotations here to avoid some issues with CSS, and
		//clean up our styling. See commit 3250171, 507c040, and the commit after - there's 30+ lines of trial code in there.
		let img = document.createElement("img")
		img.src = options.src
		img.title = options.title
		return img
	}

	createImageElem(options = {}) {
		return Tile.createImageElem({
			src: this.getImageUrl(),
			title: this.getTileName(options.gameStyle)
		})
	}

	matches(tile, checkAny = false) {
		//If checkAny is true, check any parameters.
		//TODO: A flower should never match any of a number.
		if (this.faceDown || !(tile instanceof Tile)) {return false}

		if (
			(tile.type === this.type || (checkAny && (this.type === "any" || tile.type === "any")))
			&& (tile.value === this.value || (checkAny && (this.value === "any" || tile.value === "any")))
		) {return true}
		if (this.type === "joker" && tile.type === this.type) {return true} //Value no-op for jokers.
		if (
			//For American Mahjong - all flowers and seasons are identical.
			//Since Chinese mahjong uses Prettys, not flower/season Tiles this is enough to check.
			(this.type === "flower" || this.type === "season")
			&& (tile.type === "flower" || tile.type === "season")
		) {return 2} //We'll return a 2 to indicate that the tile is identical in gameplay, but not visually.
		return false
	}

	getTileValue(onlyFunctional = false) {
		//onlyFunctional - should the same value be returned for all Flowers/Seasons? Yes when matching, no when ordering visually.
		//The greater the value, the further to the right we place the tile.

		//TODO: How to hand Any? It probably works fine (any number has no suit, so 0 plus something, and any suit has a suit plus 0)
		//So it might overlap pretties, but American Mahjong doesn't have those.
		//Still, we want to stop that overlap.

		let tileValue = 100 //Pretty starts at 0.

		tileValue += 100 * ["flower", "season", "circle", "bamboo", "character", "wind", "dragon", "joker"].findIndex((suit) => {return this.type === suit})

		if (onlyFunctional && tileValue <= 200) {return 100}

		if (typeof this.value === "number") {tileValue += this.value}
		else if (this.type === "wind") {
			tileValue += 10 * ["north", "east", "south", "west"].findIndex((value) => {return this.value === value})
		}
		else if (this.type === "dragon") {
			tileValue += 10 * ["red", "green", "white"].findIndex((value) => {return this.value === value})
		}
		else if (this.type === "flower" || this.type === "season") {}
		else if (this.value === "any") {}
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
