// let tileCache = {}
// window.tileCache = tileCache
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

	createImageElem(options = {}) {
		let src = this.getImageUrl() //Need to pass options if getImageUrl ever adds any.
		//We'll store a URL, either blob URL or dataURI.
		// if (!tileCache[src]) {
		// 	console.log(tileCache[src])
		// 	//TODO: Upscale, rotate if needed.
		// 	//This ensures the tiles grow properly on larger screens, instead of stopping at 96x128
		// 	//It also greatly cleans up the styling on the vertical tiles (rotate transforms don't seem to
		// 	//affect their dimensions, causing sizing, margins, etc, to be complicated)
		// 	console.log("Generating", src)
		// 	let img = document.createElement("img")
		// 	img.src = src
		// 	tileCache[src] = img
		//
		// 	console.log("Stored")
		//
		// 	img.onload = function() {
		// 		console.log(img.width)
		// 		console.log(img.height)
		// 		console.log(src)
		// 		let cnv = document.createElement("canvas")
		// 		let ctx = cnv.getContext("2d")
		// 		//We can upscale to ensure that tiles properly grow beyond their normal maximum size on larger devices.
		// 		//We should also add rotations, so that we can avoid the need for CSS transforms.
		// 		cnv.width = img.width * 2
		// 		cnv.height = img.height * 2
		// 		ctx.drawImage(img, 0, 0, cnv.width, cnv.height)
		//
		// 		cnv.toBlob(function(blob) {
		// 			let newSrc = URL.createObjectURL(blob)
		// 			img.onload = null;
		// 			console.log("Got Blob!")
		// 			img.src = newSrc
		// 		}, "image/png")
		// 	}
		// }
		//
		// //TODO: Would using a Canvas be quicker?
		// //TODO: Or - we could simply return the same image object every time, just changing the title. That's probably the best option.
		// let img = tileCache[src].cloneNode()
		let img = document.createElement("img")
		img.src = src
		img.title = this.getTileName(options.gameStyle)
		return img
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
		) {return 2} //We'll return a 2 to indicate that the tile is identical in gameplay, but not visually.
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
