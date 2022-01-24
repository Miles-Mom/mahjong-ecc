const Tile = require("./Tile.js")
const Hand = require("./Hand.js")
const Wall = require("./Wall.js")
const Popups = require("./Popups.js")
const Sequence = require("./Sequence.js")
const Match = require("./Match.js")

const {updateTilesInContainer} = require("./updateTilesInContainer.js")
const {displayCenterTilePopup} = require("./displayCenterTilePopup.js")

let gameBoard = document.createElement("div")
gameBoard.id = "gameBoard"
document.body.appendChild(gameBoard)

function createTopOrBottomHand(handId) {
	let hand = document.createElement("div")
	hand.id = handId
	gameBoard.appendChild(hand)
	return hand
}

function createLeftOrRightHand(handId, containerId) {
	let hand = createTopOrBottomHand(handId)

	//We will return the container for the tiles. A container is used for the left and right hands in order to vertically center the tiles.
	let container = document.createElement("div")
	container.id = containerId
	hand.appendChild(container)

	return container
}

function Compass(config = {}) {
	config.id = config.id || "compass"

	this.compass = document.createElement("img")
	this.compass.id = config.id
	this.compass.alt = "Compass"
	gameBoard.appendChild(this.compass)

	this.setDirectionForUserWind = function(userWind) {
		this.compass.src = "assets/compass-" + userWind + ".svg"
	}
}

let compass = new Compass({id: "compass"})


function FullscreenControls(elementId) {

	let goFullscreenImage = "assets/go-full-screen.svg"
	let exitFullscreenImage = "assets/exit-full-screen.svg"

	if (!document.fullscreenEnabled && document.webkitFullscreenEnabled) {
		//We'll add some support for the webkit prefix.
		Object.defineProperty(document, "fullscreenElement", {
			get: function() {return document.webkitFullscreenElement}
		})
		document.documentElement.requestFullscreen = function() {document.documentElement.webkitRequestFullScreen()}
		document.exitFullscreen = function() {document.webkitExitFullscreen()}
		document.addEventListener("webkitfullscreenchange", function() {
			document.dispatchEvent(new Event("fullscreenchange"))
		})
	}

	if (window?.Capacitor?.Plugins?.StatusBar) {
		//TODO: I don't believe there is any event to detect when the StatusBar appears/dissapears.
		//This is possible on Android by swiping down from the top of the screen.

		//These return promises or are async!
		this.goFullscreen = function() {
			return Capacitor.Plugins.StatusBar.hide()
		}

		this.exitFullscreen = function() {
			return Capacitor.Plugins.StatusBar.show()
		}

		this.isFullscreen = async function() {
			let info = await Capacitor.Plugins.StatusBar.getInfo()
			return !info.visible
		}
	}
	else if (document.fullscreenElement !== undefined) {
		//Support check. This allows users to check toggleElement.
		//fullscreenElement is null when supported.

		this.goFullscreen = function() {
			document.documentElement.requestFullscreen()
		}

		this.exitFullscreen = function() {
			document.exitFullscreen()
		}

		this.isFullscreen = function() {
			return document.fullscreenElement
		}
	}

	if (this.goFullscreen) {
		//Confirm that fullscreen is supported.
		this.toggleElement = document.createElement("img")
		this.toggleElement.id = elementId
		this.toggleElement.title = "Toggle Full Screen"

		let setIcon = (async function setIcon() {
			if (await this.isFullscreen()) {
				this.toggleElement.src = exitFullscreenImage
			}
			else {
				this.toggleElement.src = goFullscreenImage
			}
		}).bind(this)

		this.toggleElement.addEventListener("click", (async function() {
			let prom;
			if (await this.isFullscreen()) {
				prom = this.exitFullscreen()
			}
			else {
				prom = this.goFullscreen()
			}
			if (prom) {prom.then(setIcon)} //Capacitor uses promises.
		}).bind(this))

		document.addEventListener("fullscreenchange", setIcon)
		setIcon()
	}

}

let fullscreenControls = new FullscreenControls("fullscreenControls")
if (fullscreenControls.toggleElement) {
	gameBoard.appendChild(fullscreenControls.toggleElement)

	//We will go fullscreen at the very beginning if possible on mobile.
	//If we can't, we will go fullscreen on first document click.
	function callFullScreen() {
	    //Check for mobile or currently being in fullscreen.
		//TODO: This may be too aggressive on browsers. It can be annoying.
	    if ((window.innerWidth < 600 || window.innerHeight < 600)) {
			fullscreenControls.goFullscreen()
	    }
	}

	let wentFullScreenPrior;
	document.addEventListener("click", function(e) {
	    //If the event is not trusted, it's not going to allow fullscreen. Ignore it.
	    if (!e.isTrusted || wentFullScreenPrior) {return}
	    wentFullScreenPrior = true
	    callFullScreen()
	})

	try {
	    callFullScreen()
	}
	catch (e) {console.error(e)}
}


let syncButton = document.createElement("img")
syncButton.src = "assets/reload-icon.svg"
syncButton.id = "syncButton"
syncButton.title = "Sync (Reload)"
gameBoard.appendChild(syncButton)

syncButton.addEventListener("click", async function() {
	try {
		await new Promise((r, j) => {
			window.saveOfflineGame().then(r)
			setTimeout(j, 500, "Ran Out Of Time to Save")
		})
	}
	catch (e) {console.error(e)}
	window.location.reload()
})

window.Tile = Tile
window.Sequence = require("./Sequence.js")
window.Match = require("./Match.js")


function createTilePlacemat() {
	let tilePlacemat = document.createElement("div")
	tilePlacemat.id = "tilePlacemat"
	return tilePlacemat
}

let tilePlacemat = createTilePlacemat()
gameBoard.appendChild(tilePlacemat)


let revertStateButton = document.createElement("button")
revertStateButton.id = "revertStateButton"
revertStateButton.innerHTML = "History"
gameBoard.appendChild(revertStateButton)

revertStateButton.addEventListener("click", function() {
	let elem = document.createElement("div")
	let p = document.createElement("p")
	p.innerHTML = "Loading Game History... (This should only take a second or two - otherwise, close menu and try again)"
	elem.appendChild(p)

	let popup = new Popups.Notification("History", elem)
	popup.show()

	stateManager.getMessageHistory().then((obj) => {
		let history = obj.message
		p.innerHTML = "Click to reset the game back in history: "

		let buttonContainer = document.createElement("div")
		buttonContainer.className = "historyMenuButtonContainer"
		elem.appendChild(buttonContainer)

		history.forEach((move) => {
			let btn = document.createElement("button")
			btn.innerHTML = `Move ${move.move} - ${move.message}`

			buttonContainer.appendChild(btn)
			btn.addEventListener("click", function() {
				if (confirm(`Are you sure you would like to revert the game state to move ${move.move}? This will affect ALL players, and can't be undone!`)) {
					window.stateManager.revertState(move.move)
					popup.dismiss()
				}
			})
		})

		buttonContainer.scrollTo(0, 999999) //Scroll to the bottom.
	})
})

let swapJokerButton = document.createElement("button")
swapJokerButton.id = "swapJokerButton"
swapJokerButton.innerHTML = "Swap Joker"
gameBoard.appendChild(swapJokerButton)

swapJokerButton.addEventListener("click", function() {
	if (userHand.inPlacemat.length !== 1) {
		new Popups.Notification("Error With Swap", "You must have exactly one tile in your placemat to swap - act like you are going to discard the tile, but hit Swap Joker instead of proceed. ").show()
		return
	}

	let elem = document.createElement("div")
	let p = document.createElement("p")
	p.innerHTML = "Who would you like to try and swap with?"
	elem.appendChild(p)

	let popup;

	//TODO: Consider adding an "auto" to this.
	stateManager.lastState.message.clients.forEach((item, i) => {
		let btn = document.createElement("button")
		btn.innerHTML = item.nickname
		btn.className = "swapJokerOptionMenuButton"
		if (item.id === window.clientId) {btn.innerHTML += " (You)"}

		elem.appendChild(btn)
		btn.addEventListener("click", function() {
			window.stateManager.placeTiles(userHand.inPlacemat, false, {swapJoker: item.id})
			popup.dismiss()
		})
	});

	popup = new Popups.Notification("Swap Tile For Joker", elem)
	popup.show()
})


let proceedButton = document.createElement("button")
proceedButton.id = "proceedButton"
proceedButton.innerHTML = "Proceed"
gameBoard.appendChild(proceedButton)

proceedButton.addEventListener("click", function() {

	let placement = userHand.inPlacemat

	//If the user has 0 tiles in placemat, or 1 tile, which is the thrown one, next turn.
	if (placement.length === Number(placement.some((obj) => {return obj.evicting}))) {
		window.stateManager.placeTiles([])
		return;
	}

	console.log(placement)
	window.stateManager.placeTiles(placement)
})

window.stateManager.onPlaceTiles = function(obj) {
	if (obj.status === "error") {
		new Popups.Notification("Error Placing Tiles", obj.message).show()
	}
}

let hintButton = document.createElement("button")
hintButton.id = "hintButton"
hintButton.innerHTML = "Suggested Hands"
gameBoard.appendChild(hintButton)


function createSuggestedHands(hand, playerName = "") {
	let isUser = !playerName

	let popup;
	try {
		//TODO: The card setting (like all settings) is sent even when not applicable to the game mode.
		//Can this be fixed such that we can merely check cardName === undefined?
		let cardName = stateManager.lastState.message.settings.card

		if (stateManager.lastState.message.settings.gameStyle !== "american") {
			window.settings.hasReceivedScoringHint.value = true //The user has opened the scoring menu, so we don't need to give the hint.

			//Not American Mahjong - must be Chinese/Panama.

			let results = hand.score()
			let titleText = results.scoreText //To save space, we'll display scoreText as the header.

			let panel = new Popups.Panel(titleText)

			let itemTableContainer = document.createElement("div")
			itemTableContainer.className = "itemTableContainer"

			panel.panel.appendChild(itemTableContainer)


			function createTable(items, isSetsTable = false) {
				let tableContainer = document.createElement("div")
				tableContainer.className = "tableContainer"

				let table = document.createElement("table")
				tableContainer.appendChild(table)

				function createData(tr) {
					let td = document.createElement("td")
					tr.appendChild(td)
					return td
				}

				let headerRow = document.createElement("tr")
				table.appendChild(headerRow)

				createData(headerRow).innerHTML = isSetsTable ? "Sets (In-Hand Blue)" : "Bonuses"
				createData(headerRow).innerHTML = "Pts"
				createData(headerRow).innerHTML = "Dbs"

				items.forEach((item) => {
					let tr = document.createElement("tr")
					table.appendChild(tr)

					if (item.text) {
						//Display text label.
						createData(tr).innerHTML = item.text
					}
					else {
						let td = createData(tr)
						//Display the tile images as label.
						itemContent = document.createElement("span")

						if (isSetsTable && !item.match.exposed) {
							tr.style.backgroundColor = "rgb(214, 226, 231)"
						}

						item.match.tiles.flat().forEach((tile) => {
							td.appendChild(tile.createImageElem({
								gameStyle: stateManager?.lastState?.message?.settings?.gameStyle
							}))
						})
					}

					createData(tr).innerHTML = item.points
					createData(tr).innerHTML = item.doubles
				})

				return tableContainer
			}

			let matchesTable = createTable(results.matchItems, true)
			let otherTable = createTable(results.otherItems)

			itemTableContainer.appendChild(matchesTable)
			itemTableContainer.appendChild(otherTable)

			panel.show(gameBoard)

			return
		}

		let titleText = isUser ? "Suggested Hands" : playerName + " Possible Hands"

		let tiles = hand.contents.concat(hand.inPlacemat)
		tiles = tiles.filter((tile) => {return !tile.evicting}).filter((tile) => {return !tile.faceDown})

		if (cardName === "Random") {
			popup = new Popups.Notification(titleText, `'Other Card' does not support ${titleText}. `)
		}
		else if (!stateManager.lastState.message.settings.suggestedHands) {
			popup = new Popups.Notification(titleText, `${titleText}/Hints are disabled by the host. `)
		}
		else {
			const cards = require("../server/american/cards.js")
			const utilities = require("../server/american/utilities.js")

			let card = cards[cardName]

			console.time("Gen Options")
			let options = utilities.getTileDifferential(card, tiles)
			console.timeEnd("Gen Options")

			if (options.length === 0) {
				popup = new Popups.Notification("No Hands Found", ` - This hand might be dead<br> - You might be playing with the wrong card (using ${cardName}). <br> - Bots might only support a portion of your card`)
			}
			else {
				let elem = document.createElement("div")
				let p = document.createElement("p")
				//TODO: Exposed tiles could imply that not all tiles are factored in after Mahjong is called. Visible, etc, implies discard is counted.
				p.innerHTML = isUser ? `Discard pile not analyzed` : `Only Exposed Tiles Considered`
				if (options.length > 1) {p.innerHTML += " - Scroll for more"}
				elem.appendChild(p)

				//Progressively render 200 suggestions 2 at a time.
				let table = document.createElement("table")
				let index = 0
				function drawMore() {
					let amount = 2
					for (let i=index;i<(index + amount);i++) {
						let item = options[i]
						if (!item) {return}

						let row = document.createElement("tr")
						table.appendChild(row)

						let nameColumn = document.createElement("td")
						nameColumn.innerHTML = `${item.handOption.section} #${item.handOption.cardIndex + 1} - ${item.diff} Tiles Away (${item.handOption.concealed?"C":"X"}, ${item.handOption.score}pt)`
						row.appendChild(nameColumn)

						let tileRow = document.createElement("tr")
						table.appendChild(tileRow)

						item.handOption.tiles.flat().forEach((tile) => {
							tileRow.appendChild(tile.createImageElem({
								gameStyle: stateManager?.lastState?.message?.settings?.gameStyle
							}))
						})
					}

					index += amount
					if (index > 200) {return}
					window.requestAnimationFrame(drawMore)
				}

				window.requestAnimationFrame(drawMore)

				elem.appendChild(table)
				table.className = "suggestedHandsTable"
				console.log(elem)

				popup = new Popups.Notification(titleText, elem)

				//The first ever that Suggested Hands is dismissed, inform user they can click on opponents' hands for insight.
				if (!window.settings.hasReceivedPossibleHandsHint.value) {
					if (!isUser) {
						//The user opened possible hands. We don't need to tell them about it.
						window.settings.hasReceivedPossibleHandsHint.value = true
					}
					else {
						popup.ondismissed = function() {
							window.settings.hasReceivedPossibleHandsHint.value = true
							new Popups.Notification("Gameplay Tip!", "Wondering what hands your opponents could be playing? <br>You can click on their tiles for a list of hands possible with their exposures!")
							.show()
						}
					}
				}
			}
		}
	}
	catch (e) {
		console.error(e)
		popup = new Popups.Notification("Suggested Hands", "There was an error displaying suggested hands. Sorry. ")
	}
	popup.show()
}

hintButton.addEventListener("click", function() {
	createSuggestedHands(userHand)
})

let claimButton = document.createElement("button")
claimButton.id = "claimButton"
claimButton.innerHTML = "Claim"
claimButton.addEventListener("click", function() {
	stateManager.placeTiles("Claim")
})
gameBoard.appendChild(claimButton)

let instructionBubble = document.createElement("div")
instructionBubble.id = "instructionBubble"
instructionBubble.style.display = "none"
gameBoard.appendChild(instructionBubble)

window.stateManager.addEventListener("onStateUpdate", function(obj) {
	instructionBubble.style.display = ""
	instructionBubble.innerHTML = obj.message.instructions.split("\n").join("<br>")
})

window.stateManager.onGameplayAlert = function(obj) {
	//Play sound.
	let sound = document.createElement("audio");

	let baseUrl = "assets/sounds/"
	let urls = [];
	if (obj.message.includes("thrown")) {
		sound.volume = 0.5
		urls = ["tile-drop-table.mp3"]
	}
	else if (obj.message.includes("mahjong")) {
		sound.volume = 1
		urls = ["tiles-dropping-table.mp3"]
	}

	if (urls.length > 0 && window.settings.soundEffects.value) {
		sound.src = baseUrl + urls[Math.floor(Math.random() * urls.length)];
		sound.setAttribute("preload", "auto");
		sound.setAttribute("controls", "none");
		sound.style.display = "none";
		document.body.appendChild(sound);
		sound.play()
		setTimeout(function() {
			sound.remove()
		}, 2000)
	}

	let alert = new Popups.BlocklessAlert(obj.message, {
		duration: 4000 * (obj?.status?.durationMultiplier || 1),
		optional: obj?.status?.optional,
		onStart: function() {
			if (window.voiceChoices[obj?.status?.clientId] && obj?.status?.speech) {
				//TODO: SPEAK!!!
				let utterance = new SpeechSynthesisUtterance(obj.status.speech)
				let voice = window.voiceChoices[obj.status.clientId].get()
				console.log(window.voiceChoices[obj.status.clientId])
				console.log(window.voiceChoices[obj.status.clientId].get())
				console.log(voice)
				if (typeof voice !== "string") {
					try {
						utterance.voice = voice
					}
					catch(e) {console.error(e)}
				}
				if (voice !== "none") {
					speechSynthesis.speak(utterance)
				}
			}
		}
	})
}

let shouldConfirm = true;
function endGame(confirmMessage) {
	//Require confirmation unless the game is over. Note that this might be slightly bugged with revert.
	if (
		endGameButton.innerHTML === "Leave Room" //Spectating
		|| !shouldConfirm
		|| confirm(confirmMessage)
	) {
		let lastMessage = stateManager.lastState.message
		window.stateManager.endGame()

		try {
			//We will only prompt if this specific user went mahjong.
			if (
				lastMessage.currentTurn.userTurn === window.clientId
				&& lastMessage.isGameOver === 1 //Mahjong only, not wall empty.
			) {
				if (window?.Capacitor) {
					AppRate.promptForRating(false)
				}
			}
		}
		catch (e) {console.error(e)}
		return true
	}
	return false
}

let endGameButton = document.createElement("button")
endGameButton.id = "endGameButton"
gameBoard.appendChild(endGameButton)

let newGameNoLobbyButton = document.createElement("button")
newGameNoLobbyButton.id = "newGameNoLobbyButton"
newGameNoLobbyButton.innerHTML = "New Game"
gameBoard.appendChild(newGameNoLobbyButton)

endGameButton.addEventListener("click", function() {
	endGame("Are you sure you want to end the game?")
})

newGameNoLobbyButton.addEventListener("click", function() {
	if (endGame("Are you sure you want to start a new game?")) {
		document.getElementById("startGameButton").click() //Clicks button on RoomManager - not currently visible.
	}
})

let goMahjongButton = document.createElement("button")
goMahjongButton.id = "goMahjongButton"
gameBoard.appendChild(goMahjongButton)

goMahjongButton.addEventListener("click", function() {
	let placement = userHand.inPlacemat
	console.log(placement)
	window.stateManager.placeTiles(placement, {mahjong: true})
})

let wallAndDiscardContainer = document.createElement("div")
wallAndDiscardContainer.id = "wallAndDiscardContainer"
gameBoard.appendChild(wallAndDiscardContainer)

let wallRendering = document.createElement("div")
wallRendering.className = "wall"
wallAndDiscardContainer.appendChild(wallRendering)

let discardPile = document.createElement("div")
discardPile.id = "discardPile"
wallAndDiscardContainer.appendChild(discardPile)

function renderDiscardPile(tileStrings) {
	let tiles = tileStrings.map((str) => {return Tile.fromJSON(str)})
	tiles = Hand.sortTiles(tiles)

	updateTilesInContainer(discardPile, tiles)

	discardPile.onclick = function() {
		displayCenterTilePopup(tiles, `Discard Pile (${tiles.length} tile${tiles.length === 1 ? "":"s"})`)
	}
}


let userHandElem = createTopOrBottomHand("userHand")
let userHandElemExposed = createTopOrBottomHand("userHandExposed")
let userHand = new Hand({
	handToRender: userHandElem,
	handForExposed: userHandExposed,
	interactive: true,
	tilePlacemat: tilePlacemat
})
window.userHand = userHand

let rightHandContainer = createLeftOrRightHand("rightHand", "rightHandContainer")
let rightHand = new Hand({
	handToRender: rightHandContainer
})

let topHandElem = createTopOrBottomHand("topHand")
let topHand = new Hand({
	handToRender: topHandElem
})

let leftHandContainer = createLeftOrRightHand("leftHand", "leftHandContainer")
let leftHand = new Hand({
	handToRender: leftHandContainer
})


let nametagIds = ["bottomNametag", "rightNametag", "topNametag", "leftNametag"]
let nametags = nametagIds.map((id) => {
	let nametag = document.createElement("p")
	nametag.id = id
	gameBoard.appendChild(nametag)
	return nametag
})

//TODO: Reading the nametags feels like REALLY bad practice. It works, but...
//Probably not worth redoing unless there is a problem.
topHandElem.addEventListener("click", function() {
	createSuggestedHands(topHand, nametags[2].innerHTML)
})

leftHandContainer.addEventListener("click", function() {
	createSuggestedHands(leftHand, nametags[3].innerHTML)
})

rightHandContainer.addEventListener("click", function() {
	createSuggestedHands(rightHand, nametags[1].innerHTML)
})

userHandExposed.addEventListener("click", function() {
	createSuggestedHands(userHand)
})


let showSpectating = true



function clearSyncCache() {
	//Clear contents, but don't render the changes
	//This forces the next sync to sync the entire hand contents,
	//which prevents it from being treated as a Charleston.

	//Without this, reverts into an American Mahjong charleston might result
	//in the changed tiles going into the placemat.
	userHand.contents = []
}

window.stateManager.onRevertState = clearSyncCache
window.stateManager.addEventListener("onEndGame", clearSyncCache) //This is basically irrelevant, as 4+ tiles almost always vary between draws.


window.stateManager.addEventListener("onStateUpdate", function(obj) {
	goMahjongButton.innerHTML = "Mahjong"
	if (window.stateManager.isHost) {
		newGameNoLobbyButton.style.display = ""
	}
	else {
		newGameNoLobbyButton.style.display = "none"
	}

	gameBoard.className = obj?.message?.settings?.gameStyle //Buttons use this class to determine layout and visibility.

	let message = obj.message

	shouldConfirm = !message.isGameOver

	hintButton.style.display = ""
	proceedButton.classList.add("shrinkForHintButton")

	if (!message?.settings?.suggestedHands) {
		hintButton.style.display = "none"
		proceedButton.classList.remove("shrinkForHintButton")
	}

	claimButton.style.display = ""
	proceedButton.classList.add("shrinkForClaimButton")

	function hideClaimButton() {
		claimButton.style.display = "none"
		proceedButton.classList.remove("shrinkForClaimButton")
	}

	if (!message?.settings?.pickupDiscardForDraw) {
		hideClaimButton()
	}

	if (!message.inGame) {
		document.body.style.overflow = ""
		return
	};
	document.body.style.overflow = "hidden"

	if (message.wallTiles !== undefined) {
		if (typeof message.wallTiles === "object") {
			message.wallTiles = Hand.convertStringsToTiles(message.wallTiles)
		}
		else {
			message.wallTiles = new Array(message.wallTiles).fill(new Tile({faceDown: true}))
		}
		Wall.renderWall(wallRendering, message.wallTiles)
	}

	if (message.discardPile) {
		renderDiscardPile(message.discardPile)
	}

	let clients = message.clients
	let winds = ["north", "east", "south", "west"]
	let hands = [userHand, rightHand, topHand, leftHand]

	delete userHand.wind //Make sure this is cleared - if we are spectating, we don't want this to be defined.
	clients.forEach((client) => {
		if (client.hand) {
			client.hand = Hand.fromString(client.hand)
		}

		if (client.id === window.clientId) {
			userHand.sync(client.hand, message?.currentTurn?.charleston)
		}
	})

	let userWindIndex = winds.indexOf(userHand.wind)

	let windOrder = winds.slice(userWindIndex).concat(winds.slice(0, userWindIndex))
	if (!userHand.wind) {
		//Must be spectating.
		compass.setDirectionForUserWind(windOrder[0])
		endGameButton.innerHTML = "Leave Room"

		if (showSpectating) {
			new Popups.MessageBar("You are spectating (message will close automatically)").show(10000)
			showSpectating = false
		}
	}
	else {
		compass.setDirectionForUserWind(userHand.wind)
		endGameButton.innerHTML = "End Game"
	}

	let currentTurnWind;
	clients.forEach((client) => {
		let windPosition = 0;
		if (client.hand.wind) {
			windPosition = windOrder.indexOf(client.hand.wind)
		}

		let hand = hands[windPosition]

		if (client.hand && client.id !== window.clientId) {
			hand.sync(client.hand, message?.currentTurn?.charleston)
		}

		let nametag = nametags[windPosition]
		nametag.innerHTML = client.nickname
		nametag.style.color = ""

		if (message.currentTurn && client.id === message.currentTurn.userTurn) {
			currentTurnWind = client.hand.wind
			nametag.style.color = "red"
		}
	})

	hands.forEach((hand) => {hand.renderTiles(message?.currentTurn?.lastDrawn)}) //lastDrawn only affects unexposed tiles, so there isn't a problem passing it to all.
	swapJokerButton.disabled = ""

	userHand.setEvictingThrownTile() //Clear evictingThrownTile

	if (message.currentTurn.charleston) {hideClaimButton()}

	if (message.currentTurn?.playersReady?.length > 0) {
		//The person has thrown their tile. Waiting on players to ready.
		let clientIdReady = message.currentTurn.playersReady.includes(window.clientId)
		claimButton.disabled =
			goMahjongButton.disabled =
			proceedButton.disabled = clientIdReady?"disabled":""

		//Completely hide the claim button if we aren't the next in order.
		if ((winds.indexOf(currentTurnWind) + 1) % 4 !== winds.indexOf(userHand.wind)) {
			hideClaimButton()
		}

		swapJokerButton.disabled = "disabled"
		proceedButton.innerHTML = "Proceed (" + message.currentTurn.playersReady.length + "/4)"
		//If you haven't thrown, are not in charleston, and it is your turn, override and enable.
		if (!message.currentTurn.thrown && !message.currentTurn.charleston && message.currentTurn.userTurn === clientId) {proceedButton.disabled = ""}
		if (message.currentTurn.charleston && message.currentTurn.userTurn !== clientId) {
			//You have 13 tiles. Mahjong impossible.
			goMahjongButton.disabled = "disabled"
		}
		if (message.currentTurn.userTurn !== clientId && message.currentTurn.thrown) {
			userHand.setEvictingThrownTile(Tile.fromJSON(message.currentTurn.thrown))
		}
		userHand.renderPlacemat("")
	}
	else {
		hideClaimButton()
		proceedButton.disabled = ""
		goMahjongButton.disabled = ""
		proceedButton.innerHTML = "Proceed"

		//The person has not yet thrown a tile.
		if (message.currentTurn.charleston) {
			//TODO: Not sure if East wind is allowed to go Mahjong during a charleston. As of now, Room.js will treat mahjong just like place tiles during charleston,
			//so we'll disable the option
			goMahjongButton.disabled = "disabled"
		}

		if (message.currentTurn.userTurn === window.clientId) {
			userHand.renderPlacemat("pending")
			swapJokerButton.disabled = ""
		}
		else {
			userHand.renderPlacemat("") //Not sure if this is needed, but it isn't harming anything.
			swapJokerButton.disabled = "disabled"
			if (!message.currentTurn.charleston) {
				proceedButton.disabled = "disabled"
				goMahjongButton.disabled = "disabled"
			}
		}
	}

	if (!proceedButton.disabled && !message.isGameOver) {
		proceedButton.classList.add("scaleAnimation")
	}
	else {proceedButton.classList.remove("scaleAnimation")}

	if (message.isGameOver) {
		//Enable proceedButton and goMahjongButton as View Scores
		proceedButton.innerHTML = "View Scores"
		proceedButton.disabled = ""
		goMahjongButton.innerHTML = "Scores"
		goMahjongButton.disabled = ""

		if (message.settings.gameStyle === "chinese") {
			//Alert user about Scoring if in Chinese/Panama.

			//Wrap this in an additional try-catch - we're messing with localStorage, which might be wonky.
			//The first time that a game ends, alert to user as to how scores are calculated.
			try {
				if (!window.settings.hasReceivedScoringHint.value) {
					window.settings.hasReceivedScoringHint.value = true
					new Popups.Notification("Gameplay Tip!", "Confused about scoring? Click on an opponents hand, or on your exposed tiles, for a score summary! You can check the tutorial, linked off the main menu (scroll if not visible), for more details. ")
					.show()
				}
			}
			catch (e) {console.error(e)}
		}
	}
})

proceedButton.addEventListener("click", function() {
	//When clicked, remove proceed button scale animation.
	proceedButton.style.animation = "none"
	setTimeout(function() {
		proceedButton.style.animation = ""
	}, 100)
})

//Add hotkeys
document.addEventListener("keyup", function(e) {
	let chars = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "a", "s", "d", "f"] //qwertyuiopasdf will correspond to first 14 hand spots. Pressing will move to placemat.
	if (!stateManager.inGame) {
		return;
	}
	if (e.code === "Space" && e.shiftKey) {
		goMahjongButton.click()
	}
	else if (e.code === "Space") {
		proceedButton.click()
	}
	else if (Number(e.key) > 0 && Number(e.key) < 5) {
		//1,2,3, and 4 will correspond to the 4 placemat spots. Pressing them will remove the specified tile.
		let pos = Number(e.key) - 1
		userHand.moveTile(userHand.inPlacemat[pos])
	}
	else if (chars.includes(e.key.toLowerCase())) {
		let index = chars.indexOf(e.key.toLowerCase())
		let tiles = userHand.contents.filter((item) => {return item instanceof Tile})
		userHand.moveTile(tiles[index])
	}
})

function handleScreenResize() {
	topHand.renderTiles()
	leftHand.renderTiles()
	rightHand.renderTiles()
	userHand.renderTiles()
}
window.addEventListener("resize", handleScreenResize)
window.addEventListener("orientationchange", handleScreenResize)

window.addEventListener("scroll", function(event) {
	if (window.stateManager.inGame) {
		window.scrollTo(0,0)
	}
})


module.exports = gameBoard
