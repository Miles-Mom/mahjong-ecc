const Tile = require("./Tile.js")
const Pretty = require("./Pretty.js")
const SeedRandom = require("seed-random")
const {i18n} = require("./i18nHelper.js")

const {updateTilesInContainer} = require("./updateTilesInContainer.js")
const {displayCenterTilePopup} = require("./displayCenterTilePopup.js")

class Wall {
	constructor(seed = Math.random(), config = {}) {
		this.drawFirst = function() {
			return this.tiles.pop()
		}

		this.readFirst = function() {
			return this.tiles[this.tiles.length - 1]
		}

		this.tiles = []

		//Time to add the tiles to the deck...
		this.tiles = this.tiles.concat(Wall.getNonPrettyTiles())

		if (!config.noPrettys) {
			;[false, true].forEach((isSeason) => {
				for (let i=1;i<=4;i++) {
					//Prettys are tiles ("flowers") in American Mahjong
					if (!config.prettysAsTiles) {
						this.tiles.push(new Pretty({
							value: i,
							seasonOrFlower: isSeason?"season":"flower"
						}))
					}
					else {
						this.tiles.push(new Tile({
							value: i,
							type: isSeason?"season":"flower"
						}))
					}
				}
			})
		}

		if (config.includeJokers) {
			for (let i=0;i<config.includeJokers;i++) {
				this.tiles.push(new Tile({
					type: "joker",
					value: ""
				}))
			}
		}


		//Randomly mix the tiles.
		Wall.shuffleArray(this.tiles, seed)

		this.toJSON = (function() {
			return seed
		}).bind(this)
	}

	static getNonPrettyTiles(amount = 4) {
		//We have this as a static method because it can be useful to obtain a copy of every playing tiles in the game.
		let tiles = []
		for (let i=1;i<=9;i++) {
			for (let c=0;c<amount;c++) {
				["bamboo", "character", "circle"].forEach((type) => {
					tiles.push(new Tile({
						type,
						value: i
					}))
				})
			}
		}

		;["red", "green", "white"].forEach((value) => {
			for (let i=0;i<amount;i++) {
				tiles.push(new Tile({
					type: "dragon",
					value: value
				}))
			}
		})

		;["north", "south", "east", "west"].forEach((value) => {
			for (let i=0;i<amount;i++) {
				tiles.push(new Tile({
					type: "wind",
					value: value
				}))
			}
		})
		return tiles
	}

	static shuffleArray(array, seed = Math.random()) {
		let random = SeedRandom(seed)

		//Durstenfeld shuffle
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
	}

	static renderWall(div, tiles) {
		if (tiles.length === 0) {
			//The wall is out. Don't render anything.
			while (div.firstChild) {div.firstChild.remove()}
			return
		}

		//Update existing paragraph elem, or create if none.
		let elem = div.querySelector("p")
		if (!elem) {
			elem = document.createElement("p")
			div.insertBefore(elem, div.firstChild)
		}
		elem.innerHTML = tiles.length

		//Update the tiles.
		updateTilesInContainer(div, tiles)

		window.requestAnimationFrame(function() {
			//Set an animation frame so the tiles are rendered before the class change is applied.
			//Otherwise these are drawn with smallView styles, and never animated.

			//We need both to be in requestAnimationFrame as guaranteed hands call revert state sync, which would otherwise
			//result in smallView being set when not correct.
			if (tiles.length > 30) {
				div.className = "wall"
			}
			else {
				div.className = "wall smallView"
			}
		})

		div.onclick = function() {
			displayCenterTilePopup(tiles, i18n.__n("Wall View %s tile(s) left", tiles.length))
		}
	}

	static fromJSON(str) {
		let seed = str
		return new Wall(seed)
	}
}

module.exports = Wall
