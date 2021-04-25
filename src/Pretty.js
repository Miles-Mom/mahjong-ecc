class Pretty {
	constructor(config = {}) {

		if (!["season", "flower"].includes(config.seasonOrFlower)) {
			throw "config.seasorOrFlower must either be 'season' or 'flower'"
		}

		this.type = "pretty"
		this.value = config.value
		this.seasonOrFlower = config.seasonOrFlower
		this.exposed = true

		this.getTileName = function() {return "Pretty"}

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

	getTileValue() {return this.value || 0}

	getImageUrl() {
		return "assets/tiles/" + this.seasonOrFlower + "s" + "/" + this.value + ".png"
	}

	static fromJSON(str) {
		let obj = JSON.parse(str)
		if (obj.class !== "Pretty") {throw "String was not created by Pretty.toJSON()"}
		return new Pretty(obj)
	}
}

module.exports = Pretty
