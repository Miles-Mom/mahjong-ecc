const Tile = require("./Tile.js")
const Match = require("./Match.js")
const Sequence = require("./Sequence.js")
const Pretty = require("./Pretty.js")
const Wall = require("./Wall.js")
const TileContainer = require("./TileContainer.js")
const calculateJokerAmount = require("./Hand/calculateJokerAmount.js")

class Hand {
	constructor(config = {}) {
		//handForExposed - Optional. If exposed tiles should be placed in a seperate hand, they will be placed here.
		//interactive: Can the user drag and drop to reorder? Click to swap between hand and placemat?
		//tilePlacemat: Element that will allow user to select tiles to expose.
		this.handToRender = config.handToRender
		this.handForExposed = config.handForExposed
		this.tilePlacemat = config.tilePlacemat
		this.interactive = config.interactive || false
		this.wind = config.wind

		//We will also have one events: this.onPlacematChange

		this.contents = [] //Contents of hand.
		this.inPlacemat = [] //Additional contents of hand. In placemat.

		this.syncContents = (require("./Hand/syncContents.js")).bind(this)
		this.sync = (function(hand, addAdditionsToPlacematIfOpen) {
			//Used to sync from server. 
			this.syncContents(hand.contents, addAdditionsToPlacematIfOpen)
			this.wind = hand.wind
			this.status = hand.status
		}).bind(this)

		this.score = (require("./Hand/score.js")).bind(this)
		this.getClearHandInfo = (require("./Hand/getClearHandInfo.js")).bind(this)
		this.isMahjong = (require("./Hand/isMahjong.js")).bind(this)
		this.isCalling = (require("./Hand/isCalling.js")).bind(this)
		this.calculateJokerAmount = (function(...args) {
			return calculateJokerAmount(this.contents, ...args)
		}).bind(this)

		Object.defineProperty(this, "placematLength", {
			get: function getPlacematLength() {
				if (stateManager?.lastState?.message?.settings?.gameStyle === "american") {return 6}
				else {return 4}
			}
		})

		function allowDrop(ev) {
			ev.preventDefault();
		}

		function dragstart(ev) {
			let randomClass = "randomClassForTransfer" + (2**53) * Math.random()
			ev.target.classList.add(randomClass)
			ev.dataTransfer.setData("randomClass", randomClass);
		}

		let dropOnHand = (function dropOnHand(ev) {
			ev.preventDefault();
			let randomClass = ev.dataTransfer.getData("randomClass");
			let elem = document.getElementsByClassName(randomClass)[0]
			elem.classList.remove(randomClass)

			let targetIndex;
			for (let i=0;i<this.handToRender.children.length;i++) {
				let child = this.handToRender.children[i]
				let bounds = child.getBoundingClientRect()

				targetIndex = child.tileIndex + 1

				if (ev.clientX < bounds.left + bounds.width / 2) {
					//This child is to the left of the drop point.
					targetIndex-- //Should not be at the very end.
					break;
				}
			}

			if (elem.placematIndex !== undefined) {
				//We are dragging out of the placemat, into the hand.
				this.moveTile(this.inPlacemat[elem.placematIndex], true, targetIndex)
			}
			else {
				//Reordering hand.
				this.moveTile(this.contents[elem.tileIndex], false, targetIndex)
			}
		}).bind(this)

		let dropOnPlacemat = (function dropOnPlacemat(ev) {
			ev.preventDefault();
			let randomClass = ev.dataTransfer.getData("randomClass");
			let elem = document.getElementsByClassName(randomClass)[0]
			elem.classList.remove(randomClass)

			this.moveTile(this.contents[elem.tileIndex])
		}).bind(this)

		if (this.interactive) {
			this.handToRender.addEventListener("dragover", allowDrop)
			this.handToRender.addEventListener("dragenter", allowDrop)
			this.handToRender.addEventListener("drop", dropOnHand)

			if (this.tilePlacemat) {
				this.tilePlacemat.addEventListener("dragover", allowDrop)
				this.tilePlacemat.addEventListener("dragenter", allowDrop)
				this.tilePlacemat.addEventListener("drop", dropOnPlacemat)

				this.tilePlacemat.addEventListener("dragover", function() {
					this.style.backgroundColor = "lightblue"
				})
				this.tilePlacemat.addEventListener("dragleave", function() {
					this.style.backgroundColor = ""
				})
				this.tilePlacemat.addEventListener("drop", function() {
					this.style.backgroundColor = ""
				})
			}
		}

		this.renderPlacemat = (function renderPlacemat(classForFirst) {
			classForFirst = classForFirst ?? this.tilePlacemat.firstChild?.className //Don't clear existing class unless classForFirst is ""
			while (this.tilePlacemat.firstChild) {this.tilePlacemat.firstChild.remove()} //Delete everything currently rendered in the hand.

			for (let i=0;i<this.placematLength;i++) {
				let tile = this.inPlacemat[i]

				let elem;
				if (tile) {
					elem = tile.createImageElem({
						gameStyle: stateManager?.lastState?.message?.settings?.gameStyle
					})
					elem.draggable = true //Is this even neccessary? It wasn't set earlier, yet it was working fine. Do browsers just assume or something?
					elem.placematIndex = i
					elem.addEventListener("dragstart", dragstart)
					elem.addEventListener("click", (function() {
						this.moveTile(tile) //Closure.
					}).bind(this))
				}
				else {
					elem = document.createElement("img")
					elem.src = "assets/tiles/tile-outline.png"
					elem.alt = "Placemat Slot for Tile"
				}

				if (i === 0 && classForFirst) {
					elem.className = classForFirst
				}
				this.tilePlacemat.appendChild(elem)
			}
		}).bind(this)

		this.renderTiles = (function renderTiles(displayElevated) {
			if (!this.handToRender) {throw "Unable to render hand. You must pass config.handToRender to the constructor. "}

			if (typeof displayElevated === "string") {displayElevated = Tile.fromJSON(displayElevated)}

			let unexposedTiles = []
			let exposedTiles = []

			for (let i=0;i<this.contents.length;i++) {
				let item = this.contents[i]
				if (item instanceof Tile)	{
					unexposedTiles.push(item)
				}
				else if (item instanceof Pretty) {
					exposedTiles.push(item)
				}
				else if (item instanceof Match || item instanceof Sequence) {
					let items = item.tiles;
					if (item instanceof Match) {
						if (item.amount === 4) {
							//kong. Flip 1 tile.
							items[0].faceDown = true
							items[0] = Tile.fromJSON(items[0].toJSON()) //Regenerate tile. This fixes the image url and name.
						}
					}
					if (item.exposed) {
						exposedTiles.push(items)
					}
					else {
						if (item instanceof Match && item.amount === 4) {
							//In hand kong. Expose with 2 flipped tiles. (One already flipped)
							items[3].faceDown = true
							items[3] = Tile.fromJSON(items[3].toJSON()) //Regenerate tile. This fixes the image url and name.
							exposedTiles.push(items)
						}
						else {
							console.log(items)
							unexposedTiles.push(items)
						}
					}
				}
				else if (item instanceof TileContainer) {
					exposedTiles.push(item.tiles)
				}
				else {console.error("Unknown item " + item)}
			}

			let processingIndex = 0; //Index of the element we are processing.
			let drawTiles = (function drawTiles(tiles, type, applyColorShading = false) {
				//TODO: If flashing remains a problem, instead of deleting the entire hand and redrawing, try replacing each item individually.
				//Ideally we wouldn't replace if not needed, but that doesn't seem easy to implement, and would likely be buggy with matches, etc.

				//We will reset processingIndex UNLESS there is not an exposed hand and we are currently unexposed.
				if (type === "unexposed" && !this.handForExposed) {
					//In this case, both hands are the same, so we want to only clear the first time.
				}
				else {
					processingIndex = 0
				}

				let drawTile = (function(tile, indexInGroup) {
					let handBeingUsed = this.handToRender;
					if (type === "exposed" && this.handForExposed) {
						handBeingUsed = this.handForExposed
					}

					let currentElem = handBeingUsed.children[processingIndex++]

					let refElem = tile.createImageElem({
						gameStyle: stateManager?.lastState?.message?.settings?.gameStyle
					})

					if (!currentElem) {
						currentElem = refElem
						handBeingUsed.appendChild(currentElem)
					}
					else {
						currentElem.src = refElem.src
						currentElem.title = refElem.title
					}

					//Group tiles in a match together.
					if (indexInGroup && indexInGroup !== 0) {
						currentElem.style.setProperty("--negativeMarginMultiplier", 2)
					}
					else if (indexInGroup === 0) {
						currentElem.style.setProperty("--negativeMarginMultiplier", 0)
					}
					else {
						currentElem.style.setProperty("--negativeMarginMultiplier", "")
					}

					if (type === "exposed") {
						if (applyColorShading) {
							//There is no hand specifically for exposed tiles. We'll apply some style to make it clear this was exposed.
							currentElem.style.filter = "brightness(1.2)"
						}
						else {
							currentElem.style.filter = ""
						}
					}
					else if (type === "unexposed") {
						if (!this.handForExposed && applyColorShading) {
							//There is no hand for exposed tiles, let's make it clear this is unexposed
							currentElem.style.filter = "brightness(0.8)"
						}
						else {
							currentElem.style.filter = ""
						}
						if (this.interactive) {
							currentElem.classList.remove("animateTile")
							if (displayElevated && tile.matches(displayElevated)) {
								displayElevated = undefined
								currentElem.classList.add("animateTile")
							}
							currentElem.draggable = true
							currentElem.onclick = (function() {
								this.moveTile(tile) //Closure.
							}).bind(this)
							currentElem.ondragstart = dragstart
							currentElem.tileIndex = this.contents.findIndex((item) => {return item === tile})
						}
					}
				}).bind(this)

				for (let i=0;i<tiles.length;i++) {
					let tile = tiles[i]
					if (tile instanceof Array) {
						for (let j=0;j<tile.length;j++) {
							drawTile(tile[j], j)
						}
					}
					else if (type === "unexposed" && i===0) {
						drawTile(tile, 0) //Add extra margin in front of the first unexposed tile.
					}
					else {
						drawTile(tile)
					}
				}

				//Note: If the window is resized, tiles will not adjust until the hand is redrawn.

				//TODO: Only set for left and right hands (which don't use flexbox)
				function resizeHandTiles(hand) {
					if (hand.children.length > 14) {
						//Downscale tiles to fit.
						let baseVh = parseFloat(document.documentElement.style.getPropertyValue("--vh")) //Pixels.
						baseVh /= hand.children.length / 14
						let baseVw = parseFloat(document.documentElement.style.getPropertyValue("--vw")) //Pixels.
						baseVw /= hand.children.length / 14

						for (let i=0;i<hand.children.length;i++) {
							let child = hand.children[i]
							child.style.setProperty("--vh", baseVh + "px")
							child.style.setProperty("--vw", baseVw + "px")
						}
					}
				}

				resizeHandTiles(this.handToRender)
				if (this.handForExposed) {resizeHandTiles(this.handForExposed)}
			}).bind(this)

			let applyColorShading = false
			//If there are any tiles in unexposedTiles that are not face down, or there are no unexposed tiles.
			if (unexposedTiles.some((tile) => {return !(tile.faceDown)}) || unexposedTiles.length === 0) {
				applyColorShading = true
			}
			drawTiles(exposedTiles, "exposed", applyColorShading)
			if (this.handForExposed) {
				//Remove all excess tiles.
				while (this.handForExposed.children.length > processingIndex) {
					this.handForExposed.lastChild.remove()
				}
			}
			drawTiles(unexposedTiles, "unexposed", applyColorShading)
			while (this.handToRender.children.length > processingIndex) {
				//Remove all excess tiles.
				this.handToRender.lastChild.remove()
			}
			if (this.tilePlacemat) {
				this.renderPlacemat()
			}
		}).bind(this)
	}


	add(obj) {
		//We will insert the tile where our sorting algorithm would find it most appropriate.
		//TODO: this should probably receive some improvement, as if the user changes the location of suits, or puts, say honors first, it will fail to properly insert.
		let newItemScore;
		if (obj instanceof Sequence) {
			newItemScore = obj.tiles[0].getTileValue() //Use value of first tile in sequence.
		}
		else if (obj instanceof TileContainer) {
			//Same as sequence for now - use first tile.
			newItemScore = obj.tiles[0].getTileValue() //Use value of first tile in TileContainer.
		}
		else {
			newItemScore = obj.getTileValue()
		}

		for (let i=0;i<this.contents.length;i++) {
			//Find where to insert this tile.
			let currentItem = this.contents[i]
			if (currentItem instanceof Sequence) {
				//Not quite sure how to handle this.
				currentItem = currentItem.tiles[2] //Get the value using the last tile in sequence.
			}
			if (currentItem instanceof TileContainer) {
				//Use the first tile in container.
				currentItem = currentItem.tiles[0]
			}
			let currentScore = currentItem.getTileValue() //Value of the tile in that position

			if (newItemScore < currentScore) {
				this.contents.splice(i, 0, obj)
				return
			}
		}
		this.contents.push(obj)
	}

	remove(obj) {
		let index = this.contents.indexOf(obj)
		let placematIndex = this.inPlacemat.indexOf(obj)
		if (index !== -1) {
			this.contents.splice(index, 1)
		}
		else if (placematIndex !== -1) {
			this.inPlacemat.splice(placematIndex, 1)
		}
		else {throw obj + " does not exist in hand. "}
	}


	moveTile(tile, switchPlace = true, targetPosition) {
		//Tile is the object in either the hand or placemat.
		//targetPosition is the position to the left of where we want to move this tile.

		let placematIndex = this.inPlacemat.indexOf(tile)
		let contentsIndex = this.contents.indexOf(tile)

		console.log(targetPosition)

		if (placematIndex + contentsIndex === -2) {
			console.error("Tile does not exist. ")
			return
		}

		let target = [this.inPlacemat, this.contents];
		if (switchPlace) {
			if (placematIndex === -1) {
				//Moving from hand to placemat.
				if (this.inPlacemat.length >= this.placematLength) {
					alert("Placemat is already full. ")
					return
				}
				else {
					this.inPlacemat.push(this.contents.splice(contentsIndex, 1)[0])
				}
			}
			else {
				//Moving from placemat to hand.
				if (placematIndex === 0 && this.inPlacemat[0].evicting) {
					alert("This tile was discarded. To claim it, select the tiles you would like to match with it, then hit proceed. ")
					return;
				}
				let currentTile = this.inPlacemat.splice(placematIndex, 1)[0]
				if (!isNaN(targetPosition)) {
					//Moving to specfic place in hand.
					this.contents.splice(targetPosition, 0, currentTile)
				}
				else {
					//Add with auto sort.
					this.add(currentTile)
				}
			}
		}
		else if (!isNaN(targetPosition)) {
			if (contentsIndex === -1) {
				console.error("Reordering in placemat is not supported. Must be in hand.")
			}
			else {
				if (targetPosition > contentsIndex) {targetPosition--} //Compensate for the splice.

				this.contents.splice(targetPosition, 0, this.contents.splice(contentsIndex, 1)[0])
			}
		}
		else {console.error("Unable to determine how this tile should be moved. ")}

		this.renderTiles() //Re-render.
		this.renderPlacemat() //Not sure if this is needed?
	}

	removeMatchingTile(obj) {
		//Removes a Tile that matches the object passed, although may not be the same object.

		if (!obj instanceof Tile) {throw "removeMatchingTile only supports Tiles"}
		if (this.inPlacemat.length > 0) {console.warn("Hand.removeMatchingTile is intended for server side use only. ")}
		if (this.contents.some(((item, index) => {
			if (obj.matches(item)) {
				this.contents.splice(index, 1)
				return true
			}
			return false
		}).bind(this))) {return true}
		return false
	}

	getExposedTiles(includeFaceDown = false) {
		let exposedTiles = []
		this.contents.forEach((item) => {
			if (item.exposed) {
				exposedTiles.push(item)
			}
			else if (item instanceof Match && item.amount === 4) {
				//If it is stored as a match, but not exposed, is in hand kong.
				//Is not stored as a match if the user never placed them down
				exposedTiles.push(item)
			}
			else if (includeFaceDown) {
				exposedTiles.push(new Tile({faceDown: true}))
			}
		})
		return exposedTiles
	}

	removeMatchingTilesFromHand(obj, amount = 1, simulated = false) {
		if (!obj instanceof Tile) {throw "You must send a tile. "}
		return this.removeTilesFromHand(new Array(amount).fill(obj), simulated)
	}

	removeTilesFromHand(tiles, simulated = false) {
		if (tiles instanceof Sequence || tiles instanceof TileContainer) {tiles = tiles.tiles}
		if (tiles instanceof Tile) {tiles = [tiles]}
		else if (!tiles instanceof Array) {throw "Must send a Sequence, Tile, or Array. "}

		//We will verify that the tiles CAN be removed before removing them.
		let indexes = []
		tiles.forEach((tile, index) => {
			if (!(tile instanceof Tile)) {throw "Your Sequence or Array contains non-tiles. "}

			for (let i=this.contents.length-1;i>=0;i--) {
				let matchResult = tile.matches(this.contents[i])

				if (!indexes.includes(i)) {
					if (matchResult === 2) {
						//Non-exact match (like a 1 flower vs 4 season - same in gameplay, not visually)
						//We will prefer exact matches, but accept non exact ones.
						indexes[index] = i
					}
					else if (matchResult) {
						indexes[index] = i
						return
					}
				}
			}
		})

		let allDefined = true
		for (let i=0;i<tiles.length;i++) {
			if (indexes[i] === undefined) {
				allDefined = false
			}
		}
		if (allDefined) {
			if (simulated) {return true}
			//Remove the item the farthest back in the hand to avoid position shifting.
			indexes.sort((a,b) => {return b-a}).forEach((index) => {
				this.contents.splice(index, 1)
			})
			return true
		}
		else {return false}
	}

	setEvictingThrownTile(tile) {
		//Clear the other evicting tile, even if it's position has moved due to some glitch or user hacking.
		for (let i=this.inPlacemat.length - 1;i>=0;i--) {
			let item = this.inPlacemat[i]
			if (item.evicting) {
				this.inPlacemat.splice(i, 1)
			}
		}
		if (tile) {
			if (this.inPlacemat.length >= this.placematLength) {
				this.contents.push(this.inPlacemat.pop())
			}
			this.inPlacemat.unshift(tile)
			tile.evicting = true
		}
	}

	getStringContents(prop = "contents") {
		//Can also pass "inPlacemat" for placemat contents.
		return this[prop].map((item) => {return item.toJSON()})
	}

	toJSON() {
		return JSON.stringify({
			wind: this.wind,
			contents: this.contents,
			status: this.status
		})
	}

	static sortTiles(tiles) {
		return tiles.sort(function (tile1, tile2) {
			return tile1.getTileValue() - tile2.getTileValue()
		})
	}

	static convertStringsToTiles(arr) {
		//arr is an array, with the stringified contents of the hand.
		let contents = arr.map((itemStr) => {
			let obj = JSON.parse(itemStr)
			if (obj.class === "Pretty") {
				return Pretty.fromJSON(itemStr)
			}
			else if (obj.class === "Tile") {
				return Tile.fromJSON(itemStr)
			}
			else if (obj.class === "Sequence") {
				return Sequence.fromJSON(itemStr)
			}
			else if (obj.class === "TileContainer") {
				return TileContainer.fromJSON(itemStr)
			}
			else if (obj.class === "Match") {
				return Match.fromJSON(itemStr)
			}
			else {throw "Unable to identify itemString " + itemStr}
		})
		return contents
	}

	static fromString(str) {
		//Hand.fromString is only meant to be used on the server side. Therefore, it will not attempt to carry over any functionality that would be client side.
		let obj = JSON.parse(str)
		let wind = obj.wind

		let hand = new Hand({wind: obj.wind})
		hand.status = obj.status
		hand.contents = Hand.convertStringsToTiles(obj.contents)
		return hand
	}
}

module.exports = Hand
