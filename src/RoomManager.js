const Popups = require("./Popups.js")
const SettingsMenu = require("./RoomManager/GameSettings.js")
const {readSave, writeSave, deleteSave} = require("./SaveManager.js") //TODO: Should we use a Setting to store saves instead of [read/write/delete]Save?
const {i18n} = require("./i18nHelper.js")

const QRCode = require("qrcode-generator")

require("./configureInAppRatings.js")

//Allow the user to join and create rooms.
let roomManager = document.createElement("div")
roomManager.id = "roomManager"
document.body.appendChild(roomManager)


//In order to get the "4 friends" part styled differently, we will need 3 elements for our heading.
let heading = document.createElement("div")
heading.id = "heading"
roomManager.appendChild(heading)

let mahjongHeading = document.createElement("h1")
mahjongHeading.innerHTML = i18n.__("Mahjong")
mahjongHeading.id = "mahjongHeading"
heading.appendChild(mahjongHeading)

let fourFriendsHeading = document.createElement("h1")
fourFriendsHeading.innerHTML = i18n.__("4 Friends")
fourFriendsHeading.id = "fourFriendsHeading"
heading.appendChild(fourFriendsHeading)

//notInRoomContainer: The stuff to create or join a room.
let notInRoomContainer = document.createElement("div")
notInRoomContainer.id = "notInRoomContainer"
roomManager.appendChild(notInRoomContainer)

//Intended for maintenance warnings, etc.
let staticMessageBar = document.createElement("h4")
staticMessageBar.style.marginTop = 0
staticMessageBar.style.display = "none"
notInRoomContainer.appendChild(staticMessageBar)

window.stateManager.onSetStaticMessageBar = function({message}) {
	if (message) {
		staticMessageBar.innerHTML = message
		staticMessageBar.style.display = ""
	}
	else {
		staticMessageBar.style.display = "none"
	}
}

let roomIdInput = document.createElement("input")
roomIdInput.id = "roomIdInput"
roomIdInput.placeholder = i18n.__("Enter Room Name...")
roomIdInput.setAttribute("enterkeyhint", "next")
notInRoomContainer.appendChild(roomIdInput)

//Put the nickname input on a new line.
notInRoomContainer.appendChild(document.createElement("br"))

let nicknameInput = document.createElement("input")
nicknameInput.id = "nicknameInput"
nicknameInput.placeholder = i18n.__("Nickname (Optional)")
nicknameInput.setAttribute("enterkeyhint", "done")
notInRoomContainer.appendChild(nicknameInput)

//Advance to nicknameInput when enter pressed.
roomIdInput.addEventListener("keydown", function(event) {
	if (event.keyCode === 13) {
		roomIdInput.blur()
		nicknameInput.focus()
	}
})

//Blur nicknameInput when enter pressed.
nicknameInput.addEventListener("keydown", function(event) {
	if (event.keyCode === 13) {
		nicknameInput.blur()
	}
})


//Allow query params.
let hashParams = new URLSearchParams(window.location.hash.slice(1))
let searchParams = new URLSearchParams(window.location.search)
if (hashParams.has("roomId")) {
	roomIdInput.value = hashParams.get("roomId")
}
if (hashParams.has("name")) {
	nicknameInput.value = hashParams.get("name")
}

//window.nativePlatform is used for setting up some UI components in a platform specific manner (like rating links)
//Used for screenshots and things like the Microsoft PWA.
if (hashParams.has("fakeNative")) {
	window.nativePlatform = hashParams.get("fakeNative")
}
else if (window.Capacitor) {
	window.nativePlatform = Capacitor.getPlatform()
}
else if (searchParams.get("app-install-source") === "microsoft-store") {
	window.nativePlatform = "windows"
}

//The join/create room buttons.
let joinOrCreateRoom = document.createElement("div")
joinOrCreateRoom.id = "joinOrCreateRoom"
notInRoomContainer.appendChild(joinOrCreateRoom)

let joinCreateSpan = document.createElement("span")
joinOrCreateRoom.appendChild(joinCreateSpan)

let joinRoom = document.createElement("button")
joinRoom.id = "joinRoom"
joinRoom.innerHTML = i18n.__("Join Room")
joinRoom.addEventListener("click", function() {
	stateManager.offlineMode = false

	if (roomIdInput.value.trim().length === 0) {
		return new Popups.Notification(i18n.__("Whoops!"), i18n.__("Please enter the name of the room you would like to join into the box labeled \"Enter Room Name\"")).show()
	}
	window.stateManager.joinRoom(roomIdInput.value.toLowerCase(), nicknameInput.value)
})
joinCreateSpan.appendChild(joinRoom)
joinCreateSpan.style.position = "relative"
joinCreateSpan.style.display = "inline-block"

let offlineOverlay = document.createElement("div")
offlineOverlay.style.position = "absolute"
offlineOverlay.style.top = offlineOverlay.style.left = offlineOverlay.style.right = "0"
offlineOverlay.style.height = "100%"
offlineOverlay.style.backgroundColor = "#000000bb"
joinCreateSpan.appendChild(offlineOverlay)

let createRoom = document.createElement("button")
createRoom.id = "createRoom"
createRoom.innerHTML = i18n.__("Create Room")
createRoom.addEventListener("click", function() {
	stateManager.offlineMode = false
	window.stateManager.createRoom(roomIdInput.value.toLowerCase(), nicknameInput.value)
})
joinCreateSpan.appendChild(createRoom)


let offlineGameDiv = document.createElement("div")
notInRoomContainer.appendChild(offlineGameDiv)

let savedGameDiv = document.createElement("div")
savedGameDiv.id = "savedGameDiv"
savedGameDiv.style.display = "none"
offlineGameDiv.appendChild(savedGameDiv)

let offlineSinglePlayer = document.createElement("button")
offlineSinglePlayer.id = "offlineSinglePlayer"
offlineSinglePlayer.innerHTML = i18n.__("Single Player")
offlineSinglePlayer.addEventListener("click", function() {
	stateManager.offlineMode = true //Send to local server.

	stateManager.getCurrentRoom() //This syncs locale to the offline server.

	let roomId = i18n.__("Offline")

	let nickname = nicknameInput.value || i18n.__("Player 1")

	window.stateManager.createRoom(roomId, nickname)

	for (let i=0;i<3;i++) {
		window.stateManager.addBot()
	}
})
offlineGameDiv.appendChild(offlineSinglePlayer)

function resumeOfflineGame(saveText, resumeAtStart = false) {
	let {startRooms} = serverStateManager.loadState(saveText)

	//TODO: We need to reset clientId back after offline games are closed.
	//Set our clientId to the offline mode clientId. Note that clientId should be static now.

	let roomId = serverStateManager.getAllRoomIds()[0] //Room ID could be "Offline", or a translated version of it.
	window.clientId = serverStateManager.getAllClients().find((client) => {
		console.log(client)
		if (!client.isBot) {return true}
	}).clientId
	stateManager.offlineMode = true
	stateManager.getCurrentRoom() //Sync locale
	startRooms()

	stateManager.getCurrentRoom() //Sync (room now exists, so will load room)

	if (resumeAtStart) {
		stateManager.revertState(0)
		//TODO: We need to load at the beginning, instead of loading the end and reverting.
		//There needs to be a way to only resume the first few moves.
		setTimeout(function() {
			stateManager.revertState(0)
		}, 300)

		//Start at the beginning by default.
		let messageBar = new Popups.MessageBar(i18n.__("Click Here to Load End of Game (Closes Automatically)"))
		messageBar.elem.addEventListener("click", function() {
			resumeOfflineGame(saveText)
			messageBar.dismiss()
		})
		messageBar.elem.style.cursor = "pointer"
		messageBar.show(10000)
	}
}

let uploadSaveButton = document.createElement("button")
uploadSaveButton.innerHTML = i18n.__("Use Save File")
uploadSaveButton.id = "uploadSaveButton"
offlineGameDiv.appendChild(uploadSaveButton)

//Dummy file input.
let fileInput = document.createElement("input")
fileInput.style.display = "none"
fileInput.type = "file"
fileInput.accept = "application/json"
document.body.appendChild(fileInput)

uploadSaveButton.addEventListener("click", function() {
	//Alert the user about the save.
	let elem = new DocumentFragment() //We want the dismiss button to be on the same line, so use a fake container.
	let popup;

	let p = document.createElement("p")
	p.innerHTML = i18n.__("You can upload/drag a save file from your device, or download one of ours: ")
	p.id = "messageText"
	elem.appendChild(p)


	function addColumn(row, text) {
		let sectionNameColumn = document.createElement("td")
		sectionNameColumn.innerHTML = `<span>${text}</span>`
		row.appendChild(sectionNameColumn)
	}

	let tableContainer = document.createElement("div")
	tableContainer.className = "guaranteedHandsTableContainer"
	tableContainer.innerHTML = i18n.__("Loading Tutorials and Challenges...")
	elem.appendChild(tableContainer)

	;((async function() {
		let obj;
		try {
			let req = await fetch((window.Capacitor?"https://mahjong4friends.com/":"") + "guaranteedHands.json")
			obj = await req.json()
			console.log(obj)
		}
		catch (e) {
			tableContainer.innerHTML = i18n.__("Error Loading Tutorials and Challenges...")
			return
		}

		let table = document.createElement("table")
		table.className = "guaranteedHandsTable"
		tableContainer.innerHTML = ""
		tableContainer.appendChild(table)

		let header = document.createElement("tr")
		table.appendChild(header)
		addColumn(header, i18n.__("Card"))
		addColumn(header, i18n.__("Section"))
		addColumn(header, i18n.__("Option"))
		addColumn(header, i18n.__("Item"))

		class ExpandableItem {
			constructor({obj, key, columns = [], depth = 0}) {
				this.elem = document.createElement("tr")

				this.columns = columns.slice(0)
				this.columns.push(key)

				this.depth = depth

				for (let i=0;i<this.columns.length;i++) {
					//Adjust text without adjusting other contents.
					let columnKey = this.columns[i]

					if (i === 2) {
						columnKey = "#" + columnKey
					}
					addColumn(this.elem, columnKey)
				}

				columns = this.columns.slice(0)

				this.elem.className = "guaranteedHands" + depth

				this.obj = obj[key]

				this.elem.addEventListener("click", (function() {
					this.setExpanded()
				}).bind(this))
			}

			emptyColumns = 0
			addEmptyColumns(amount) {
				this.emptyColumns = amount
				while (this.elem.children.length < amount) {
					addColumn(this.elem, "")
				}
				this.items.forEach((item) => {item.addEmptyColumns(amount)})
			}

			items = []
			setExpanded(expanded) {
				console.log(this.obj)
				//If expanded is false, collapse. If true, expand. If undefined, toggle.
				this.items.forEach((item) => {
					item.setExpanded(false)
					item.elem.remove()
				})

				let insertBeforeElem = this.elem.nextSibling
				if (expanded === true || expanded === undefined && this.items.length === 0) {
					this.items = []
					for (let key in this.obj) {

						let item = this.obj[key]
						let itemToInsert;
						if (item instanceof Object) {
							itemToInsert = new ExpandableItem({obj: this.obj, key, columns: this.columns, depth: this.depth + 1})
						}
						else {
							itemToInsert = new GameSaveItem({obj: this.obj, key, columns: this.columns, depth: this.depth + 1})
						}

						itemToInsert.addEmptyColumns(this.emptyColumns)
						this.items.push(itemToInsert)
						this.elem.parentNode.insertBefore(itemToInsert.elem, insertBeforeElem)
					}
				}
				else {
					this.items = []
				}
			}
		}

		class GameSaveItem extends ExpandableItem {
			constructor(config) {
				super(config)
				this.elem.className = "saveRow"
				this.elem.lastChild.remove()
				addColumn(this.elem, config.key + ` (${Math.round(config.obj[config.key] / 1000)}kB)`)
			}

			setExpanded(status) {
				if (status !== false) {
					//We were clicked.
					let baseUrl = window.location.origin + window.location.pathname
					if (window.Capacitor) {
						baseUrl = "https://mahjong4friends.com/"
					}
					console.log(this.columns)
					//TODO: The base URI needs to be included in the file.
					baseUrl += encodeURI(`server/mahjong-tutorials/${this.columns.join("/")}.server.json`)
					console.log(baseUrl)
					;(async function() {
						try {
							let req = await fetch(baseUrl)
							let text = await req.text()
							console.log(text)
							resumeOfflineGame(text, true)
						}
						catch (e) {
							console.error(e)
							alert("Error Downloading Save File")
						}
					}())
				}
			}
		}

		Object.keys(obj).forEach((cardName) => {
			let expandable = new ExpandableItem({obj, key: cardName})
			expandable.addEmptyColumns(4)
			table.appendChild(expandable.elem)
		})
	})())

	async function processSaveFile(file) {
		if (file) {
			let reader = new FileReader()
			await new Promise((r, j) => {
				reader.onload = r
				reader.onerror = j
				reader.readAsText(file)
			})
			let text = reader.result
			try {
				resumeOfflineGame(text, true)
				popup.dismiss()
				//Reset any selected files - if the user uploads the same file twice, we should load it twice. (they may have closed the game the first time)
				fileInput.value = ""
			}
			catch (e) {
				console.error(e)
				alert("Error loading save. Please make sure you selected the correct file. ")
			}
		}
	}

	let uploadFromDevice = document.createElement("button")
	uploadFromDevice.innerHTML = i18n.__("Upload From Device")
	fileInput.oninput = function() {
		processSaveFile(fileInput.files[0])
	}

	uploadFromDevice.addEventListener("click", function() {
		fileInput.click()
	})
	uploadFromDevice.id = "resumeSaveNowButton"
	elem.appendChild(uploadFromDevice)

	popup = new Popups.Notification(i18n.__("Select Save File"), elem)
	let popupBox = popup.show()

	;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
		popupBox.addEventListener(eventName, preventDefaults, false)
	})

	function preventDefaults (e) {
		e.preventDefault()
		e.stopPropagation()
	}

	//Allow drag drop
	;['dragenter', 'dragover'].forEach(eventName => {
		popupBox.addEventListener(eventName, highlight, false)
	})

	;['dragleave', 'drop'].forEach(eventName => {
		popupBox.addEventListener(eventName, unhighlight, false)
	})

	function highlight(e) {
		popupBox.style.filter = "brightness(1.25)"
	}

	function unhighlight(e) {
		popupBox.style.filter = ""
	}

	popupBox.addEventListener('drop', handleDrop, false)

	function handleDrop(e) {
		unhighlight()
		processSaveFile(e.dataTransfer.files[0])
	}
})

//Save offline games.
const saveKey = "save0.server.json"

let previouslySaved; //When we have zero rooms, we need to detect if the room was closed, or if the page was reloaded.
async function saveOfflineGame() {
	if (serverStateManager.getAllRoomIds().length === 0) {
		//Since previouslySaved is cleared on reloads, if it is set, we were currently writing the saved game.
		//If that game no longer exists (room closed), there is no game we should save.
		if (previouslySaved) {
			console.error("Deleting")
			await deleteSave(saveKey)
		}
		return //No rooms to save.
	}

	let toSave = serverStateManager.toJSON()
	let currentlySaved = await readSave(saveKey)

	previouslySaved = true //Set previouslySaved. The save was written while this tab was open.

	if (toSave !== currentlySaved) {
		console.log(`Saving Game (${toSave.length} characters)`)
		await writeSave(saveKey, toSave)

		if (window.settings.singlePlayerDebuggingData.value) {
			//Upload the offline game for debugging and analysis purposes.
			//TODO: We don't want to do this constantly, as we could be uploading a bit.
			//Also, there is no guarantee this goes through - we could legitimately be offline.
			try {
				console.log("Attempting Offline Upload")
				// stateManager.uploadOfflineSave({
				// 	saveId: serverStateManager.getRoom("Offline").logFileSaveId,
				// 	message: toSave
				// })
			}
			catch (e) {console.error(e)}
		}
	}
}

try {
	//Shouldn't error.
	readSave(saveKey).then((res) => {
		if (res) {
			//Alert the user about the save.
			//TODO: Do we want to have this overlay the Single Player button, or otherwise indicate Single Player and Saved
			//Offline Game will overwrite this?
			savedGameDiv.style.display = ""

			let span = document.createElement("span")
			span.innerHTML = i18n.__("Saved Game: ")
			span.style.fontSize = "1.7em"
			savedGameDiv.appendChild(span)

			let resumeButton = document.createElement("button")
			resumeButton.innerHTML = i18n.__("Resume")
			resumeButton.addEventListener("click", function() {
				resumeOfflineGame(res)
				savedGameDiv.remove()
			})
			resumeButton.id = "resumeSaveNowButton"
			savedGameDiv.appendChild(resumeButton)


			let downloadSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
			downloadSvg.setAttribute("viewBox", "0 0 24 24")

			let svgPath = document.createElementNS("http://www.w3.org/2000/svg", "path")
			svgPath.setAttribute("d", "M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z")

			downloadSvg.appendChild(svgPath)

			downloadSvg.addEventListener("click", async function() {
				let downloadName = "mahjong4friends.server.json"
				if (window?.Capacitor?.getPlatform()) {
					//iOS and Android Capacitor don't support link downloads. Use share menu.
					//Android share menu isn't as good, as it doesn't provide a way to download the file.
					//Not sure there's a great solution to that though.
					let saveInfo = await writeSave(downloadName, res, "CACHE")
					let shareConfig = {
						title: downloadName,
						url: saveInfo.uri,
						//text: 'Save/Share to Play Later on Other Devices!' //Haven't seen this in testing, and it works without it, so not messing with it yet.
						//dialogTitle: "" //Same as above.
					}
					await Capacitor.Plugins.Share.share(shareConfig)
				}
				else {
					var elem = document.createElement('a');
					elem.download = downloadName

					let blob = new Blob([res], {type: "application/json"})
					let url = URL.createObjectURL(blob)

					elem.href = url

					document.body.appendChild(elem);
					elem.click();
					elem.remove()

					URL.revokeObjectURL(url)
				}
			})
			downloadSvg.id = "downloadSaveNowButton"
			savedGameDiv.appendChild(downloadSvg)

			let deleteButton = document.createElement("span")
			deleteButton.innerHTML = "✖︎"
			deleteButton.addEventListener("click", function() {
				//TODO: Requiring confirmation is too obnoxious, but we might want some sort of undo or something.
				deleteSave(saveKey)
				savedGameDiv.remove()
			})
			deleteButton.id = "deleteSaveNowButton"
			savedGameDiv.appendChild(deleteButton)
		}
	})
}
catch (e) {
	console.error(e)
}

window.saveOfflineGame = saveOfflineGame //The sync button calls this on iOS.
setInterval(saveOfflineGame, 5000) //Save game relatively frequently
window.onbeforeunload = function() {saveOfflineGame()} //This is async, so it might not actually finish.
if (window.Capacitor) {
	//Save when app is closed, etc.
	Capacitor?.Plugins?.App?.addListener("appStateChange", function(event) {
		if (event.isActive === false) {saveOfflineGame()}
	})
}

let connectionStatus = document.createElement("p")
connectionStatus.id = "connectionStatus"

joinOrCreateRoom.appendChild(connectionStatus)

let dots = 1 //We could make these go a bit faster...
window.setConnectionStatus = function({connected}) {
	connectionStatus.innerHTML = i18n.__("Multiplayer Needs Internet") + ".".repeat(1 + (++dots % 5))
	offlineOverlay.style.display = connected ? "none":""
	joinRoom.disabled = createRoom.disabled = connected?"":"disabled"
	connectionStatus.style.display = connected ? "none":""
}

window.setConnectionStatus({
	connected: (window?.stateManager?.websocket?.readyState === 1) //If websocket is open, true. Else false. 
})


//Inform user to use landscape.
let screenRotationAlert = document.createElement("p")
screenRotationAlert.id = "screenRotationAlert"
screenRotationAlert.innerHTML = i18n.__("Rotating your screen to Landscape mode is recommended. ")
notInRoomContainer.appendChild(screenRotationAlert)

function setScreenRotationAlert(event) {
	let orientation = window.screen?.orientation?.type
	//Window.innerWidth is returning the wrong value in simulator. May not be an issue on actual devices, but screen.width works fine.
	if (
		(orientation?orientation.includes("portrait"):(Math.abs(window.orientation) !== 90)) //Support iOS window.orientation
		&& screen.width < 900) {
		screenRotationAlert.style.display = ""
	}
	else {
		screenRotationAlert.style.display = "none"
	}
}
window.addEventListener("orientationchange", setScreenRotationAlert);
setScreenRotationAlert()

let inRoomContainer = document.createElement("div")
inRoomContainer.id = "inRoomContainer"
inRoomContainer.style.display = "none"
roomManager.appendChild(inRoomContainer)

let roomInfo = document.createElement("h2")
roomInfo.id = "roomInfo"
inRoomContainer.appendChild(roomInfo)

let gameSettingsElem = document.createElement("div")
gameSettingsElem.id = "gameSettingsElem"
inRoomContainer.appendChild(gameSettingsElem)

let playerView = document.createElement("div")
playerView.id = "playerView"
inRoomContainer.appendChild(playerView)

let leaveRoomButton = document.createElement("button")
leaveRoomButton.innerHTML = i18n.__("Leave Room")
leaveRoomButton.id = "leaveRoomButton"
inRoomContainer.appendChild(leaveRoomButton)

leaveRoomButton.addEventListener("click", function() {
	window.stateManager.leaveRoom(window.stateManager.roomId)
})

let addBotButton = document.createElement("button")
addBotButton.innerHTML = i18n.__("Add Bot")
addBotButton.id = "addBotButton"
addBotButton.style.display = "none"
inRoomContainer.appendChild(addBotButton)

addBotButton.addEventListener("click", function() {
	window.stateManager.addBot()
})

let startGameButton = document.createElement("button")
startGameButton.innerHTML =i18n.__( "Start Game")
startGameButton.id = "startGameButton"
startGameButton.style.display = "none"
inRoomContainer.appendChild(startGameButton)

let gameSettings = new SettingsMenu(gameSettingsElem)

let settingsMenuButton = document.createElement("button")
settingsMenuButton.innerHTML = i18n.__("Settings")
settingsMenuButton.id = "settingsMenuButton"
inRoomContainer.appendChild(settingsMenuButton)

settingsMenuButton.addEventListener("click", function() {
	gameSettings.openMenu()
})

startGameButton.addEventListener("click", function() {

	function start() {
		window.stateManager.startGame(gameSettings.getChoices())
	}

	//We want users to play offline if they are doing single player games.
	//Give them the option to switch now.
	try {
		if (!stateManager.offlineMode && !window.settings.overruledOnlineSinglePlayerAlert.value) {
			let nonBotCount = 0
			stateManager.lastState.message.clients.forEach((client) => {
				if (!client.isBot) {nonBotCount++}
			})

			if (nonBotCount === 1) {
				//TODO: Copy over bot nicknames.
				//Maybe player nickname as well, but very few players are likely to change their name in a single player game,
				//and Player 1 is a better default that userxxx

				let elem = new DocumentFragment() //We want the buttons to be on the same line, so use a fake container.
				let popup;

				let p = document.createElement("p")
				p.innerHTML = i18n.__("You're playing online - Rooms created with the Single Player button are faster <i>and</i> work offline! You can find it on the main page, below the Join Room button.")
				p.id = "messageText"
				elem.appendChild(p)

				let goOfflineButton = document.createElement("button")
				goOfflineButton.innerHTML = i18n.__("Go Offline")
				goOfflineButton.addEventListener("click", function() {
					stateManager.addEventListener("onLeaveRoom", startOfflineGame)
					leaveRoomButton.click()

					function startOfflineGame() {
						offlineSinglePlayer.click()
						startGameButton.click()
						stateManager.removeEventListener("onLeaveRoom", startOfflineGame)
					}

					popup.dismiss()
				})
				goOfflineButton.id = "goOfflineButton"
				elem.appendChild(goOfflineButton)


				let stayOnlineButton = document.createElement("button")
				stayOnlineButton.innerHTML = i18n.__("Stay Online")
				stayOnlineButton.addEventListener("click", function() {
					window.settings.overruledOnlineSinglePlayerAlert.value = true
					start()
					popup.dismiss()
				})
				stayOnlineButton.id = "stayOnlineButton"
				elem.appendChild(stayOnlineButton)

				popup = new Popups.Notification(i18n.__("Play Offline?"), elem)
				popup.show()
				return;
			}
		}
	}
	catch (e) {
		console.error(e)
	}

	start()
})

let inviteYourFriendsElem = document.createElement("div")
inviteYourFriendsElem.id = "inviteYourFriendsElem"
inRoomContainer.appendChild(inviteYourFriendsElem)

let inviteYourFriendsDiv = document.createElement("div")
inviteYourFriendsDiv.id = "inviteYourFriendsDiv"
inviteYourFriendsElem.appendChild(inviteYourFriendsDiv)

let inviteYourFriendsHeader = document.createElement("h2")
inviteYourFriendsHeader.innerHTML = i18n.__("Invite Players to Join This Game!")
inviteYourFriendsDiv.appendChild(inviteYourFriendsHeader)

let joinRoomLinkElem = document.createElement("p")
joinRoomLinkElem.id = "joinRoomLinkElem"
joinRoomLinkElem.innerHTML = i18n.__("Share the link: <br>")

let joinRoomLink = document.createElement("a")
joinRoomLink.target = "_blank"
joinRoomLinkElem.appendChild(joinRoomLink)
inviteYourFriendsDiv.appendChild(joinRoomLinkElem)

let QRImageElement = document.createElement("img")
QRImageElement.id = "QRImageElement"
inviteYourFriendsElem.appendChild(QRImageElement)

//Create link to tutorial.
let tutorial = document.createElement("a")
tutorial.href = "tutorial.html"
tutorial.id = "tutorialLink"
tutorial.innerHTML = i18n.__("Mahjong 4 Friends Tutorial")
roomManager.appendChild(tutorial)

roomManager.appendChild(document.createElement("br"))

//Create link to tutorial.
let documentation = document.createElement("a")
documentation.href = "documentation.html"
documentation.id = "documentationLink"
documentation.innerHTML = i18n.__("See Full Documentation")
roomManager.appendChild(documentation)

let supportInfo = document.createElement("p")
supportInfo.id = "supportInfo"
supportInfo.innerHTML = i18n.__("Questions, Comments, or Concerns? ") + i18n.__("Contact %s", "<a href='mailto:support@mahjong4friends.com'>support@mahjong4friends.com</a>")

roomManager.appendChild(supportInfo)

if (window.nativePlatform) {
	let ratingPrompt = document.createElement("p")
	ratingPrompt.id = "supportInfo"
	let link
	let prompt
	if (window.nativePlatform === "ios") {
		link = "https://apps.apple.com/us/app/mahjong-4-friends/id1552704332"
		prompt = "rate us in the App Store"
	}
	else if ( window.nativePlatform === "android") {
		link = "https://play.google.com/store/apps/details?id=com.mahjong4friends.twa"
		prompt = "leave a review on Google Play"
	}
	else if (window.nativePlatform === "windows") {
		link = "ms-windows-store://pdp/?productid=9NQS9Z5JJJ8P"
		prompt = "leave a review in the Microsoft Store"
	}
	link =  `href="${link}" target="_blank"` //Properties for anchor element
	ratingPrompt.innerHTML = i18n.__("Enjoying Mahjong 4 Friends? Please <a %s>%s</a>", link, i18n.__(prompt))
	roomManager.appendChild(ratingPrompt)
}
else {
	let externalAppStoresDiv = document.createElement("div")
	externalAppStoresDiv.id = "externalAppStoresDiv"
	roomManager.appendChild(externalAppStoresDiv)

	function createButton({href, src, text}) {
		let link = document.createElement("a")
		link.href = href
		link.target = "_blank"
		link.rel = "noopener"

		let img = document.createElement("img")
		img.src = src
		img.alt = text

		link.appendChild(img)
		externalAppStoresDiv.appendChild(link)
	}

	//We will display the current platform first.
	//Ordering for other the non-current platform is currently ordered App Store/Windows/Google Play.
	//Not sure if this is ideal or not. It aligns with the userbase relatively well (Android is smallest)
	let buttons = [
		{
			href: "https://apps.apple.com/us/app/mahjong-4-friends/id1552704332",
			src: `assets/badges/${i18n.locale}/appstore.svg`,
			text: "Get Mahjong 4 Friends on the App Store",
			strings: ["iPad", "iPhone", "Mac OS X"]
		},
		{
			href: "https://www.microsoft.com/store/apps/9NQS9Z5JJJ8P",
			src: `assets/badges/${i18n.locale}/microsoft.svg`,
			text: "Get Mahjong 4 Friends from Microsoft",
			strings: "Windows"
		},
		{
			href: "https://play.google.com/store/apps/details?id=com.mahjong4friends.twa",
			src: `assets/badges/${i18n.locale}/googleplay.svg`,
			text: "Get Mahjong 4 Friends on Google Play",
			strings: ["Android", "CrOS"]
		},
	]

	function getVal(button) {
		if (!button.strings) {return 0}
		if (!(button.strings instanceof Array)) {
			button.strings = [button.strings]
		}

		for (let i=0;i<button.strings.length;i++) {
			if (navigator?.userAgent?.includes(button.strings[i])) {
				return 1
			}
		}
		return -1
	}

	buttons.sort((a, b) => {
		return getVal(b) - getVal(a)
	}).forEach((button) => {createButton(button)})
}

try {
	roomManager.appendChild(require("./settingsMenu.js")) //Add general settings menu.
}
catch (e) {
	console.error(e)
}

setTimeout(function() {
	if (stateManager.inRoom && stateManager.inRoom.includes("ratingtest")) {
		AppRate.promptForRating(true)
	}
}, 2000)

let copyrightNotice = document.createElement("p")
copyrightNotice.innerHTML = i18n.__("Copyright © 2022, All Rights Reserved")
copyrightNotice.id = "copyrightNotice"
roomManager.appendChild(copyrightNotice)

//TODO: Need a way to deal with reloads.
if (window.speechSynthesis) {
	try {
		//Workaround for iOS speechSynthesis weirdness.
		const isiOS = navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
		if (isiOS) {
			const simulateSpeech = () => {
				const lecture = new SpeechSynthesisUtterance('hello');
				lecture.volume = 0;
				speechSynthesis.speak(lecture);
				document.removeEventListener('click', simulateSpeech);
			};

			document.addEventListener('click', simulateSpeech);
		}
	}
	catch (e) {console.error(e)}
}

let voiceChoices = {} //Voices selected by user.
let availableVoices = {}; //Voice selection options
function setVoices() {
	availableVoices = {}
	if (window.speechSynthesis) {
		let voices = speechSynthesis.getVoices()
		voices.forEach((voice) => {
			let voiceName = `${voice.name} (${voice.lang})`
			availableVoices[voiceName] = voice
		})
	}
	window.dispatchEvent(new Event("voiceoptionschanged"))
}

window.voiceChoices = voiceChoices

if (window.speechSynthesis) {
	try {
		speechSynthesis.onvoiceschanged = setVoices //iOS doesn't define speechSynthesis.addEventListener. Just do this.
		setVoices()
	}
	catch (e) {console.warn("Voice Error", e)}
}

function VoiceSelector() {
	let voiceOptionsSelect = document.createElement("select")

	this.generateOptions = function() {
		while (voiceOptionsSelect.firstChild) {voiceOptionsSelect.firstChild.remove()}

		//We need to have a default, as some browsers (firefox) return an empty array for getVoices, but work.
		let noneChoice = document.createElement("option")
		noneChoice.value = "none"
		noneChoice.innerHTML = i18n.__("No Voice")
		noneChoice.selected = true
		voiceOptionsSelect.appendChild(noneChoice)

		if (Object.keys(availableVoices).length > 0) {
			let defaultChoice = document.createElement("option")
			defaultChoice.value = "default"
			defaultChoice.innerHTML = i18n.__("Default Voice")
			//defaultChoice.selected = true
			voiceOptionsSelect.appendChild(defaultChoice)

			for (let voiceName in availableVoices) {
				let choice = document.createElement("option")
				choice.value = voiceName
				choice.innerHTML = voiceName
				voiceOptionsSelect.appendChild(choice)
			}
		}
	}

	window.addEventListener("voiceoptionschanged", this.generateOptions)
	this.generateOptions()

	this.elem = voiceOptionsSelect

	this.get = function() {
		return  availableVoices[voiceOptionsSelect.value] || voiceOptionsSelect.value
	}
	this.set = function(voiceSelection = "none") {
		voiceOptionsSelect.value = voiceSelection
	}
}

function renderPlayerView(clientList = [], kickUserCallback) {
	while (playerView.firstChild) {playerView.firstChild.remove()}

	clientList.forEach((obj) => {
		let row = document.createElement("div")
		row.classList.add("playerViewRow")

		let nameSpan = document.createElement("span")
		nameSpan.classList.add("playerViewNameSpan")
		nameSpan.innerHTML = obj.nickname
		row.appendChild(nameSpan)

		let card = document.createElement("span")
		card.classList.add("playerViewCard")
		row.appendChild(card)

		let voiceChoice = document.createElement("span")
		voiceChoice.classList.add("playerViewVoiceChoice")
		row.appendChild(voiceChoice)

		function setNicknameEditable(span, targetId) {
			span.classList.add("editableName")

			let promptText = `Enter a new nickname for ${obj.nickname}: `
			if (targetId === window.clientId) {
				promptText = "Enter a new nickname: "
			}

			nameSpan.addEventListener("click", function() {
				let res = prompt(promptText)
				if (res !== null) {
					window.stateManager.setNickname(res, obj.id)
				}
			})
		}

		if (obj.id === window.clientId) {
			voiceChoice.innerHTML = i18n.__("N/A")

			//You can edit your own nickname.
			setNicknameEditable(nameSpan, obj.id)

			if (window.stateManager.isHost) {
				card.innerHTML = i18n.__("You (Host)")
			}
			else {
				card.innerHTML = i18n.__("You")
			}
		}
		else {
			voiceChoices[obj.id] = voiceChoices[obj.id] || new VoiceSelector()
			voiceChoice.appendChild(voiceChoices[obj.id].elem)

			if (obj.isHost) {
				card.innerHTML = i18n.__("Host")
			}
			else if (window.stateManager.isHost) {

				//The host can edit any nicknames.
				setNicknameEditable(nameSpan, obj.id)

				let kickButton = document.createElement("button")
				kickButton.innerHTML = i18n.__("Remove %s", obj.nickname)
				kickButton.classList.add("playerViewKickButton")
				kickButton.addEventListener("click", function() {
					if (obj.isBot || confirm(i18n.__("Are you sure you want to remove %s", obj.nickname))) {
						kickUserCallback(obj.id)
					}
				})
				card.appendChild(kickButton)
			}
			else {
				card.innerHTML = i18n.__("Player")
			}
		}

		playerView.appendChild(row)
	})
}

function getRoomLink() {
	let queryParam = "#roomId=" + stateManager.inRoom
	if (window.Capacitor) {
		return "https://mahjong4friends.com" + queryParam
	}
	return queryParam
}

function enterRoom() {
	heading.style.fontSize = "0.7em" //Shrink heading slightly.
	inRoomContainer.style.display = "block"
	notInRoomContainer.style.display = "none"

	//TODO: In the app, these links need to open in the browser. I believe they do on iOS, but they certainly don't on Android,
	//as the link is captured by our link capturing.
	joinRoomLink.href = getRoomLink()
	joinRoomLink.innerHTML = joinRoomLink.href //We want the full URL, not just the hash.

	inviteYourFriendsElem.style.display = stateManager.offlineMode?"none":"" //Hide invite friends when offline.

	try {
		let dpi = 4

		let qrGenerator = QRCode(0, "H"); //0 is for auto-detection. H is for maximum error correction.

		//Generate the code.
		qrGenerator.addData(joinRoomLink.href)
		qrGenerator.make()

		//Draw the code into a canvas
		let cnv = document.createElement("canvas")
		let pixelsPerBlock = 3 * dpi
		cnv.width = cnv.height = qrGenerator.getModuleCount() * pixelsPerBlock

		let ctx = cnv.getContext("2d")
		qrGenerator.renderTo2dContext(ctx, pixelsPerBlock)

		//Copy the code into a new canvas, width padding added.
		let paddingPixels = 6 * dpi

		let drawCanvas = document.createElement("canvas")
		drawCanvas.width = drawCanvas.height = cnv.width + paddingPixels * 2

		let drawCtx = drawCanvas.getContext("2d")
		drawCtx.fillStyle = "white"
		drawCtx.fillRect(0, 0, drawCanvas.width, drawCanvas.height)

		drawCtx.drawImage(cnv, paddingPixels, paddingPixels)


		//Insert the Mahjong logo.
		let img = document.createElement("img")
		img.src = "assets/tiles/dragons/green.png"
		img.addEventListener("load", function() {
			let centerPadding = 3 * dpi //Pixels to pad the center image.

			let maxCenterSize = drawCanvas.width * 0.3 //No hard requirement on what we can do, but 20% is fine.

			let width = img.width
			let height = img.height

			let ratio = Math.max(1, Math.max(width, height)/maxCenterSize)

			width /= ratio
			height /= ratio

			let left = drawCanvas.width / 2 - width / 2
			let top = drawCanvas.height / 2 - height / 2

			drawCtx.fillRect(left - centerPadding, top - centerPadding, width + centerPadding * 2, height + centerPadding * 2);

			drawCtx.drawImage(img, left, top, width, height)
			QRImageElement.src = drawCanvas.toDataURL("image/png")
			QRImageElement.width = QRImageElement.height = drawCanvas.width / dpi
		})

		QRImageElement.src = drawCanvas.toDataURL("image/png")
		QRImageElement.width = QRImageElement.height = drawCanvas.width / dpi
	}
	catch (e) {
		console.error(e)
	}
}

function exitRoom() {
	heading.style.fontSize = "" //Set heading back to default size.
	inRoomContainer.style.display = "none"
	notInRoomContainer.style.display = "block"
}

let showRestoreNotice = true
window.stateManager.onJoinRoom = function(obj) {
	if (obj.status === "error") {
		return new Popups.Notification(i18n.__("Unable to Join Room"), i18n.__(obj.message)).show()
	}
	else {
		if (showRestoreNotice && hashParams.has("roomId") && hashParams.get("roomId") !== obj.message) {

			new Popups.Notification(i18n.__("Room Restored"), i18n.__("You followed a link to room %1%s, but were already in room %2%s. Your room has been restored - to join a new room, leave your current one. ", hashParams.get("roomId"), obj.message)).show()
			showRestoreNotice = false
		}

		enterRoom()
	}
}

window.stateManager.onCreateRoom = function(obj) {
	if (obj.status === "error") {
		return new Popups.Notification(i18n.__("Unable to Create Room"), i18n.__(obj.message)).show()()
	}
	else {
		enterRoom()
	}
}

window.stateManager.addEventListener("onLeaveRoom", function(obj) {
	exitRoom()
	if (stateManager.offlineMode) {
		//If we resumed an offline game from an online game, go back to the online game.
		stateManager.offlineMode = false
		stateManager.getCurrentRoom()
	}
	//Don't show somebody that they left the room. Just exit.
	//Don't show the host that they closed the room. Just exit.
	if (obj.message !== "You closed the room. " && obj.message !== "You left the room. ") {
		new Popups.Notification(i18n.__("Out of Room"), i18n.__(obj.message)).show()()
	}
})

window.stateManager.addEventListener("onStateUpdate", function(obj) {
	//Link room name when online.
	let roomNameText = stateManager.offlineMode ? stateManager.inRoom : `<a href="${getRoomLink()}" target="_blank">${stateManager.inRoom}</a>`
	let playerCount = obj.message.clients.length
	roomInfo.innerHTML = i18n.__(`%d player${playerCount > 1 ? "s are":" is"} present in room %s`, playerCount, roomNameText)

	if (window.stateManager.isHost) {
		startGameButton.style.display = ""
		addBotButton.style.display = ""

		if (obj.message.clients.length >= 4) {
			addBotButton.style.display = "none" //No reason to allow adding bots when game is full.
		}
	}
	else {
		addBotButton.style.display = "none"
		startGameButton.style.display = "none"
	}

	gameSettings.setHost(window.stateManager.isHost)

	renderPlayerView(obj.message.clients, function kickUserCallback(userId) {
		window.stateManager.kickUser(window.stateManager.roomId, userId)
	})
})

window.stateManager.getCurrentRoom() //If we are already in a room, this will issue the correct callbacks to enter us into it.


window.stateManager.addEventListener("onStartGame", function() {
	roomManager.style.display = "none"
})

window.stateManager.addEventListener("onEndGame", function(obj) {
	roomManager.style.display = ""
	if (obj.message !== "State Sync") {
		//State Sync game ends happen to the person that ends the game, as well as in development mode.
		new Popups.Notification(i18n.__("Game Ended"), i18n.__(obj.message)).show()()
	}
})


//Height of document.body is used by Facebook Messenger and for our Error Popups.

//We will run this on requestAnimationFrame for 1 second after the last scroll event.
let activated;
let resizeInterval;
function setDocumentBodyHeight() {
	let maxHeight = roomManager.scrollHeight
	let browserArea =  Math.max(document.documentElement.clientHeight, window.innerHeight)
	if (roomManager.style.display === "none") {maxHeight = browserArea}
	document.body.style.height = Math.min(maxHeight, window.pageYOffset + browserArea) + "px"
	if (Date.now() - activated > 1000) {
		clearInterval(resizeInterval)
		resizeInterval = undefined
	}
}

window.addEventListener("scroll", function() {
	activated = Date.now()
	setDocumentBodyHeight()
	if (!resizeInterval) {
		setInterval(function() {
			setDocumentBodyHeight()
		}, 16)
	}
})
setDocumentBodyHeight()
window.addEventListener("resize", setDocumentBodyHeight)

module.exports = roomManager
