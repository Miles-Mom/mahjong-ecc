const Tile = require("./Tile.js") //We call the createImageElem method. TODO: Pretty should be a subclass of tile, though instanceof Tile checking might make that hard. 
const {i18n} = require("./i18nHelper.js")

class Pretty {
	constructor(config = {}) {

		if (!["season", "flower"].includes(config.seasonOrFlower)) {
			throw "config.seasorOrFlower must either be 'season' or 'flower'"
		}

		this.type = "pretty"
		this.value = config.value
		this.seasonOrFlower = config.seasonOrFlower
		this.exposed = true

		let numberToWind = ["east", "south", "west", "north"]

		this.isDouble = function(userWind) {
			if (userWind === numberToWind[this.value - 1]) {
				return true
			}
			return false
		}

		this.getPoints = function() {return 4}

		this.toJSON = (function() {
			let obj = {}
			obj.class = "Pretty"
			obj.value = this.value
			obj.seasonOrFlower = this.seasonOrFlower

			return JSON.stringify(obj)
		}).bind(this)

		this.isSequence = false
		this.isPongOrKong = false
		this.isPair = false
	}

	getTileName(gameStyle = "chinese", locale ) {
			if (typeof locale === "undefined") {
				locale = i18n.getLocale()
				// if this is used on the client side, great; if on the server side, no harm is done.
			}

			return i18n.__({phrase: "Pretty", locale: locale})
	}

	getTileValue() {return this.value || 0}

	getImageUrl() {
		return "assets/tiles/" + this.seasonOrFlower + "s" + "/" + this.value + ".png"
	}

	createImageElem(options = {}) {
		return Tile.createImageElem({
			src: this.getImageUrl(),
			title: this.getTileName(options.gameStyle)
		})
	}

	static fromJSON(str) {
		let obj = JSON.parse(str)
		if (obj.class !== "Pretty") {throw "String was not created by Pretty.toJSON()"}
		return new Pretty(obj)
	}
}

module.exports = Pretty
