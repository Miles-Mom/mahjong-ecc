const Popups = require("./Popups.js")
const SettingsMenu = require("./RoomManager/SettingsMenu.js")
const {readSave, writeSave, deleteSave} = require("./SaveManager.js")

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
mahjongHeading.innerHTML = "Mahjong"
mahjongHeading.id = "mahjongHeading"
heading.appendChild(mahjongHeading)

let fourFriendsHeading = document.createElement("h1")
fourFriendsHeading.innerHTML = "4 Friends"
fourFriendsHeading.id = "fourFriendsHeading"
heading.appendChild(fourFriendsHeading)

//notInRoomContainer: The stuff to create or join a room.
let notInRoomContainer = document.createElement("div")
notInRoomContainer.id = "notInRoomContainer"
roomManager.appendChild(notInRoomContainer)

let roomIdInput = document.createElement("input")
roomIdInput.id = "roomIdInput"
roomIdInput.placeholder = "Enter Room Name..."
notInRoomContainer.appendChild(roomIdInput)

//Put the nickname input on a new line.
notInRoomContainer.appendChild(document.createElement("br"))

let nicknameInput = document.createElement("input")
nicknameInput.id = "nicknameInput"
nicknameInput.placeholder = "Choose a Nickname..."
notInRoomContainer.appendChild(nicknameInput)

//Allow query params.
let params = new URLSearchParams(window.location.hash.slice(1))
if (params.has("roomId")) {
	roomIdInput.value = params.get("roomId")
}
if (params.has("name")) {
	nicknameInput.value = params.get("name")
}

//Development only - fakes native UI somewhat. Intended for automated screenshotting.
if (!window.Capacitor && params.has("fakeNative")) {
	window.Capacitor = {
		getPlatform: function() {return params.get("fakeNative")}
	}
}

//The join/create room buttons.
let joinOrCreateRoom = document.createElement("div")
joinOrCreateRoom.id = "joinOrCreateRoom"
notInRoomContainer.appendChild(joinOrCreateRoom)

let joinRoom = document.createElement("button")
joinRoom.id = "joinRoom"
joinRoom.innerHTML = "Join Room"
joinRoom.addEventListener("click", function() {
	stateManager.offlineMode = false

	if (roomIdInput.value.trim().length === 0) {
		return new Popups.Notification("Room Name Invalid", "The room name contains at least one character. Please enter it into the box labeled \"Enter Room Name\" ").show()
	}
	window.stateManager.joinRoom(roomIdInput.value.toLowerCase(), nicknameInput.value)
})
joinOrCreateRoom.appendChild(joinRoom)

let createRoom = document.createElement("button")
createRoom.id = "createRoom"
createRoom.innerHTML = "Create Room"
createRoom.addEventListener("click", function() {
	stateManager.offlineMode = false

	if (roomIdInput.value.trim().length === 0) {
		return new Popups.Notification("Unable to Create Room", "Please pick a 1+ character long name, and enter it into the box labeled \"Enter Room Name\" ").show()
	}
	window.stateManager.createRoom(roomIdInput.value.toLowerCase(), nicknameInput.value)
})
joinOrCreateRoom.appendChild(createRoom)

let singlePlayerGame = document.createElement("button")
singlePlayerGame.id = "singlePlayerGame"
singlePlayerGame.innerHTML = "Single Player"
singlePlayerGame.addEventListener("click", function() {
	stateManager.offlineMode = false

	let roomId = roomIdInput.value.trim() || ("sp-" + Math.floor(Math.random() * 1e10)) //We need to stop depending on randomness - collisions are possible.
	//Websockets guarantees delivery order, so we should be safe here, unless any calls error.

	let nickname = nicknameInput.value || "Player 1"

	window.stateManager.createRoom(roomId, nickname)
	window.stateManager.addBot("Bot 1")
	window.stateManager.addBot("Bot 2")
	window.stateManager.addBot("Bot 3")
})
joinOrCreateRoom.appendChild(singlePlayerGame)

let br = document.createElement("br")
joinOrCreateRoom.appendChild(br)

let offlineSinglePlayer = document.createElement("button")
offlineSinglePlayer.id = "offlineSinglePlayer"
offlineSinglePlayer.innerHTML = "Offline (Single Player)"
offlineSinglePlayer.addEventListener("click", function() {
	stateManager.offlineMode = true //Send to local server.

	let roomId = "Offline"

	let nickname = nicknameInput.value || "Player 1"

	window.stateManager.createRoom(roomId, nickname)
	window.stateManager.addBot("Bot 1")
	window.stateManager.addBot("Bot 2")
	window.stateManager.addBot("Bot 3")
})
joinOrCreateRoom.appendChild(offlineSinglePlayer)

function resumeOfflineGame(saveText) {
	serverStateManager.init(saveText)
	//Set our clientId to the offline mode clientId. Note that clientId should be static now.
	window.clientId = serverStateManager.getRoom("Offline").clientIds.find((clientId) => {
		if (!serverStateManager.getClient(clientId).isBot) {return clientId}
	})
	stateManager.offlineMode = true
	stateManager.getCurrentRoom()
}

let uploadSaveButton = document.createElement("button")
uploadSaveButton.innerHTML = "Use Save File (Offline)"
uploadSaveButton.id = "uploadSaveButton"
joinOrCreateRoom.appendChild(uploadSaveButton)

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
	p.innerHTML = "You can upload a save file from your device, or download one of ours, guaranteed winnable with specific hands: "
	p.id = "messageText"
	elem.appendChild(p)


	function addColumn(row, text) {
		let sectionNameColumn = document.createElement("td")
		sectionNameColumn.innerHTML = `<span>${text}</span>`
		row.appendChild(sectionNameColumn)
	}

	let tableContainer = document.createElement("div")
	tableContainer.className = "guaranteedHandsTableContainer"
	tableContainer.innerHTML = "Loading Guaranteed Hands..."
	elem.appendChild(tableContainer)

	;((async function() {
		let obj;
		try {
			let req = await fetch("guaranteedHands.json")
			obj = await req.json()
			console.log(obj)
		}
		catch (e) {
			tableContainer.innerHTML = "Error Loading Guaranteed Hands..."
			return
		}



		let table = document.createElement("table")
		table.className = "guaranteedHandsTable"
		tableContainer.innerHTML = ""
		tableContainer.appendChild(table)

		let header = document.createElement("tr")
		table.appendChild(header)
		addColumn(header, "Card")
		addColumn(header, "Section")
		addColumn(header, "Option")
		addColumn(header, "Item")

		class ExpandableItem {
			constructor({obj, key, columns = [], depth = 0}) {
				this.elem = document.createElement("tr")

				this.columns = columns.slice(0)
				this.columns.push(key)

				this.depth = depth

				for (let i=0;i<this.columns.length;i++) {
					//Adjust text without adjusting other contents.
					let columnKey = this.columns[i]?.replace("National Mahjongg League", "NMJL (In Development!)")

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
					let baseUrl = window.location.href
					if (window.Capacitor) {
						baseUrl = "https://mahjong4friends.com/"
					}
					console.log(this.columns)
					baseUrl += encodeURI(`server/guaranteed/${this.columns.join("/")}.server.json`)
					console.log(baseUrl)
					;(async function() {
						try {
							let req = await fetch(baseUrl)
							let text = await req.text()
							console.log(text)
							resumeOfflineGame(text)
							stateManager.revertState(0)

							//Start at the beginning by default.
							let messageBar = new Popups.MessageBar("Click Here to Load End of Game (Closes Automatically)")
							messageBar.elem.addEventListener("click", function() {
								resumeOfflineGame(text)
								messageBar.dismiss()
							})
							messageBar.elem.style.cursor = "pointer"
							messageBar.show(10000)
						}
						catch (e) {
							console.error(e)
							alert("Error Downloading Save File")
						}
					}())
				}
			}
		}

		//Could use Object.keys(obj), but that doesn't get a custom ordering.
		;["Tutorial", "2021 National Mahjongg League"].forEach((cardName) => {
			let expandable = new ExpandableItem({obj, key: cardName})
			expandable.addEmptyColumns(4)
			table.appendChild(expandable.elem)
		})
	})())


	let uploadFromDevice = document.createElement("button")
	uploadFromDevice.innerHTML = "Upload From Device"
	fileInput.oninput = async function() {
		let file = fileInput.files[0]
		if (file) {
			let reader = new FileReader()
			await new Promise((r, j) => {
				reader.onload = r
				reader.onerror = j
				reader.readAsText(file)
			})
			let text = reader.result
			try {
				resumeOfflineGame(text)
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
	uploadFromDevice.addEventListener("click", function() {
		fileInput.click()
	})
	uploadFromDevice.id = "resumeSaveNowButton"
	elem.appendChild(uploadFromDevice)

	popup = new Popups.Notification("Select Save File", elem)
	popup.show()
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
	}
}

try {
	//Shouldn't error.
	readSave(saveKey).then((res) => {
		if (res) {
			//Alert the user about the save.
			let elem = new DocumentFragment() //We want the dismiss button to be on the same line, so use a fake container.
			let popup;

			let p = document.createElement("p")
			p.innerHTML = "If you start another <strong><i>offline</i></strong> game, your save will be overwritten. You can optionally download this save to share with other devices or play later. "
			p.id = "messageText"
			elem.appendChild(p)

			let resumeButton = document.createElement("button")
			resumeButton.innerHTML = "Resume"
			resumeButton.addEventListener("click", function() {
				resumeOfflineGame(res)
				popup.dismiss()
			})
			resumeButton.id = "resumeSaveNowButton"
			elem.appendChild(resumeButton)

			let downloadButton = document.createElement("button")
			downloadButton.innerHTML = "Download"
			downloadButton.addEventListener("click", async function() {
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
			downloadButton.id = "downloadSaveNowButton"
			elem.appendChild(downloadButton)

			let deleteButton = document.createElement("button")
			deleteButton.innerHTML = "Delete"
			deleteButton.addEventListener("click", function() {
				deleteSave(saveKey)
				popup.dismiss()
			})
			deleteButton.id = "deleteSaveNowButton"
			elem.appendChild(deleteButton)

			popup = new Popups.Notification("Saved Offline Game", elem)
			popup.show()
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

notInRoomContainer.appendChild(connectionStatus)

let dots = 1 //We could make these go a bit faster...
window.setConnectionStatus = function({connected}) {
	connectionStatus.innerHTML = connected?"✓ Connected to Server":"Trying To Connect" + ".".repeat(1 + (++dots % 5))
	connectionStatus.className = connected?"connected":""
	joinRoom.disabled = createRoom.disabled = singlePlayerGame.disabled = connected?"":"disabled"
}

window.setConnectionStatus({connected: false})


//Inform user to use landscape.
let screenRotationAlert = document.createElement("p")
screenRotationAlert.id = "screenRotationAlert"
screenRotationAlert.innerHTML = "Rotating your screen to Landscape mode is recommended. "
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

let currentRoom = document.createElement("h2")
currentRoom.id = "currentRoom"
inRoomContainer.appendChild(currentRoom)

let playerCount = document.createElement("h2")
playerCount.id = "playerCount"
inRoomContainer.appendChild(playerCount)

let playerView = document.createElement("div")
playerView.id = "playerView"
inRoomContainer.appendChild(playerView)

let leaveRoomButton = document.createElement("button")
leaveRoomButton.innerHTML = "Leave Room"
leaveRoomButton.id = "leaveRoomButton"
inRoomContainer.appendChild(leaveRoomButton)

leaveRoomButton.addEventListener("click", function() {
	window.stateManager.leaveRoom(window.stateManager.roomId)
})


let closeRoomButton = document.createElement("button")
closeRoomButton.innerHTML = "Close Room"
closeRoomButton.id = "closeRoomButton"
closeRoomButton.style.display = "none"
inRoomContainer.appendChild(closeRoomButton)

closeRoomButton.addEventListener("click", function() {
	window.stateManager.closeRoom(window.stateManager.roomId)
})

let startGameButton = document.createElement("button")
startGameButton.innerHTML = "Start Game"
startGameButton.id = "startGameButton"
startGameButton.style.display = "none"
inRoomContainer.appendChild(startGameButton)

let gameSettings;
startGameButton.addEventListener("click", function() {
	window.stateManager.startGame(gameSettings.getChoices())
})

let addBotButton = document.createElement("button")
addBotButton.innerHTML = "Add Bot"
addBotButton.id = "addBotButton"
addBotButton.style.display = "none"
inRoomContainer.appendChild(addBotButton)

addBotButton.addEventListener("click", function() {
	let name = prompt("Please enter a name for the bot: ")
	window.stateManager.addBot(name)
})

let gameSettingsElem = document.createElement("div")
gameSettingsElem.id = "gameSettingsElem"
inRoomContainer.appendChild(gameSettingsElem)

let inviteYourFriendsElem = document.createElement("div")
inviteYourFriendsElem.id = "inviteYourFriendsElem"
inRoomContainer.appendChild(inviteYourFriendsElem)

let inviteYourFriendsDiv = document.createElement("div")
inviteYourFriendsDiv.id = "inviteYourFriendsDiv"
inviteYourFriendsElem.appendChild(inviteYourFriendsDiv)

let inviteYourFriendsHeader = document.createElement("h2")
inviteYourFriendsHeader.innerHTML = "Invite Players to Join This Game!"
inviteYourFriendsDiv.appendChild(inviteYourFriendsHeader)

let joinRoomLinkElem = document.createElement("p")
joinRoomLinkElem.id = "joinRoomLinkElem"
joinRoomLinkElem.innerHTML = "Share the link: <br>"

let joinRoomLink = document.createElement("a")
joinRoomLink.target = "_blank"
joinRoomLinkElem.appendChild(joinRoomLink)
inviteYourFriendsDiv.appendChild(joinRoomLinkElem)

let QRImageElement = document.createElement("img")
QRImageElement.id = "QRImageElement"
inviteYourFriendsElem.appendChild(QRImageElement)

//Create link to tutorial.
let tutorial = document.createElement("a")
tutorial.target = "_blank"
tutorial.href = "https://drive.google.com/file/d/1aGyekkldVouVY2Hy7SXTTvhS7I5X6o8O/view"
tutorial.id = "tutorialLink"
tutorial.innerHTML = "Mahjong 4 Friends Tutorial"
roomManager.appendChild(tutorial)

roomManager.appendChild(document.createElement("br"))

//Create link to tutorial.
let documentation = document.createElement("a")
documentation.target = "_blank"
documentation.href = "https://docs.google.com/document/d/1sSGxlRHMkWYHjYhxJTLvHoFsVPAgSs7DFRpsZLmgIvc/edit#heading=h.t7shfpx0qwex"
documentation.id = "documentationLink"
documentation.innerHTML = "See Full Documentation"
roomManager.appendChild(documentation)

let supportInfo = document.createElement("p")
supportInfo.id = "supportInfo"
supportInfo.innerHTML = "Questions, Comments, or Concerns? Contact <a href='mailto:support@mahjong4friends.com'>support@mahjong4friends.com</a>"
roomManager.appendChild(supportInfo)

if (window.Capacitor) {
	let ratingPrompt = document.createElement("p")
	ratingPrompt.id = "supportInfo"
	if (window?.Capacitor?.getPlatform() === "ios") {
		ratingPrompt.innerHTML = `Enjoying Mahjong 4 Friends? Please <a href="https://apps.apple.com/us/app/mahjong-4-friends/id1552704332" target="_blank">rate us in the App Store</a>!`
	}
	else if (window?.Capacitor?.getPlatform() === "android") {
		ratingPrompt.innerHTML = `Enjoying Mahjong 4 Friends? Please <a href="https://play.google.com/store/apps/details?id=com.mahjong4friends.twa" target="_blank">leave a review on Google Play</a>!`
	}
	roomManager.appendChild(ratingPrompt)
}
else {
	let externalAppStoresDiv = document.createElement("div")
	externalAppStoresDiv.id = "externalAppStoresDiv"
	roomManager.appendChild(externalAppStoresDiv)

	function createButton(href, src, text) {
		let link = document.createElement("a")
		link.href = href
		link.target = "_blank"

		let img = document.createElement("img")
		img.src = src
		img.alt = text

		link.appendChild(img)
		externalAppStoresDiv.appendChild(link)
	}

	createButton(
		"https://apps.apple.com/us/app/mahjong-4-friends/id1552704332",
		"assets/badges/appstore.svg",
		"Get Mahjong 4 Friends on the App Store"
	)

	createButton(
		"https://play.google.com/store/apps/details?id=com.mahjong4friends.twa",
		"assets/badges/googleplay.svg",
		"Get Mahjong 4 Friends on Google Play"
	)
}


setTimeout(function() {
	if (stateManager.inRoom.includes("fbtest")) {
		require("./addFacebookMessenger.js")
	}
}, 2000)

let copyrightNotice = document.createElement("p")
copyrightNotice.innerHTML = "Copyright © 2020, All Rights Reserved"
copyrightNotice.id = "copyrightNotice"
roomManager.appendChild(copyrightNotice)

//TODO: Need some ERROR HANDLING!!!!! speechSynthesis may not work/exist.
//TODO: Also need a way to deal with reloads.

//TODO: Use speechSynthesis onvoiceschange event (or whatever it is).
if (window.speechSynthesis) {
	speechSynthesis?.getVoices()
}

let voiceChoices = {}
window.voiceChoices = voiceChoices

function VoiceSelector() {
	let voiceOptionsSelect = document.createElement("select")
	let availableVoices = [];
	if (window.speechSynthesis) {
		try {
			availableVoices = speechSynthesis?.getVoices() || []
		}
		catch (e) {console.warn("Voice Error", e)}
	}

	console.log(availableVoices)

	//We need to have a default, as some browsers (firefox) return an empty array for getVoices, but work.
	let noneChoice = document.createElement("option")
	noneChoice.value = "none"
	noneChoice.innerHTML = "No Voice"
	noneChoice.selected = true
	voiceOptionsSelect.appendChild(noneChoice)

	let defaultChoice = document.createElement("option")
	defaultChoice.value = "default"
	defaultChoice.innerHTML = "Default Voice"
	//defaultChoice.selected = true
	voiceOptionsSelect.appendChild(defaultChoice)

	availableVoices.forEach((voice, index) => {
		let choice = document.createElement("option")
		choice.value = index
		choice.innerHTML = voice.lang + "(" + voice.name + ")"
		voiceOptionsSelect.appendChild(choice)
	})

	this.elem = voiceOptionsSelect

	this.get = function() {
		return  availableVoices[Number(voiceOptionsSelect.value)] || voiceOptionsSelect.value
	}
	this.set = function(voiceSelection = "none") {
		voiceOptionsSelect.value = voiceSelection
		if (availableVoices.indexOf(voiceSelection) !== -1) {
			voiceOptionsSelect.value = availableVoices.indexOf(voiceSelection)
		}
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
			voiceChoice.innerHTML = "N/A"

			//You can edit your own nickname.
			setNicknameEditable(nameSpan, obj.id)

			if (window.stateManager.isHost) {
				card.innerHTML = "You (Host)"
			}
			else {
				card.innerHTML = "You"
			}
		}
		else {
			voiceChoices[obj.id] = voiceChoices[obj.id] || new VoiceSelector()
			voiceChoice.appendChild(voiceChoices[obj.id].elem)

			if (obj.isHost) {
				card.innerHTML = "Host"
			}
			else if (window.stateManager.isHost) {

				//The host can edit any nicknames.
				setNicknameEditable(nameSpan, obj.id)

				let kickButton = document.createElement("button")
				kickButton.innerHTML = "Remove " + obj.nickname
				kickButton.classList.add("playerViewKickButton")
				kickButton.addEventListener("click", function() {
					if (confirm("Are you sure you want to remove " + obj.nickname)) {
						kickUserCallback(obj.id)
					}
				})
				card.appendChild(kickButton)
			}
			else {
				card.innerHTML = "Player"
			}
		}

		playerView.appendChild(row)
	})
}

function enterRoom() {
	inRoomContainer.style.display = "block"
	notInRoomContainer.style.display = "none"
	let queryParam = "#roomId=" + stateManager.inRoom
	joinRoomLink.href = queryParam
	if (window.Capacitor) {
	    joinRoomLink.href = "https://mahjong4friends.com" + queryParam
	}

	inviteYourFriendsElem.style.display = stateManager.offlineMode?"none":"" //Hide invite friends when offline.

	joinRoomLink.innerHTML = joinRoomLink.href
	try {
		let dpi = 4

		let qrGenerator = QRCode(0, "H"); //0 is for auto-detection. We want maximum error correction.

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
	inRoomContainer.style.display = "none"
	notInRoomContainer.style.display = "block"
}

let showRestoreNotice = true
window.stateManager.onJoinRoom = function(obj) {
	if (obj.status === "error") {
		return new Popups.Notification("Unable to Join Room", obj.message).show()
	}
	else {
		if (showRestoreNotice && params.has("roomId") && params.get("roomId") !== obj.message) {
			new Popups.Notification("Room Restored", "You followed a link to room " + params.get("roomId") + ", but were already in room " + obj.message + ". Your room has been restored - to join a new room, leave your current one. ").show()
			showRestoreNotice = false
		}

		currentRoom.innerHTML = "You are in room " + obj.message
		enterRoom()
	}
}

window.stateManager.onCreateRoom = function(obj) {
	if (obj.status === "error") {
		return new Popups.Notification("Unable to Create Room", obj.message).show()
	}
	else {
		currentRoom.innerHTML = "You are hosting room " + obj.message
		enterRoom()
	}
}

window.stateManager.onLeaveRoom = function(obj) {
	exitRoom()
	if (stateManager.offlineMode) {
		//If we resumed an offline game from an online game, go back to the online game.
		stateManager.offlineMode = false
		stateManager.getCurrentRoom()
	}
	//Don't show somebody that they left the room. Just exit.
	//Don't show the host that they closed the room. Just exit.
	if (obj.message !== "You closed the room. " && obj.message !== "You left the room. ") {
		new Popups.Notification("Out of Room", obj.message).show()
	}
}

window.stateManager.addEventListener("onStateUpdate", function(obj) {
	playerCount.innerHTML = obj.message.clients.length + "/4 Players are Present"

	let choices = gameSettings?.getChoices()

	if (window.stateManager.isHost) {
		startGameButton.style.display = "none"
		addBotButton.style.display = ""
		closeRoomButton.style.display = ""
		leaveRoomButton.style.display = ""

		gameSettings = new SettingsMenu(gameSettingsElem, true)
		gameSettings.setChoices(choices)

		if (obj.message.clients.length === 1) {
			//This player is the only one in the room. (So if they aren't host, there's a bug)
			//If they leave, the room closes. Hide the leave room button.
			leaveRoomButton.style.display = "none"
		}
		else if (obj.message.clients.length >= 4) {
			startGameButton.style.display = ""
			addBotButton.style.display = "none" //No reason to allow adding bots when game is full.
		}

	}
	else {
		addBotButton.style.display = "none"
		closeRoomButton.style.display = "none"
		startGameButton.style.display = "none"
		leaveRoomButton.style.display = ""

		gameSettings = new SettingsMenu(gameSettingsElem, false)
		gameSettings.setChoices(choices)
	}

	window.gameSettings = gameSettings //FOR TESTING!

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
		new Popups.Notification("Game Ended", obj.message).show()
	}
})


//Height of document.body is used by Facebook Messenger and for our Error Popups.

//We will run this on requestAnimationFrame for 1 second after the last scroll event.
let activated;
function setDocumentBodyHeight() {
	let maxHeight = roomManager.scrollHeight
	let browserArea =  Math.max(document.documentElement.clientHeight, window.innerHeight)
	if (roomManager.style.display === "none") {maxHeight = browserArea}
	document.body.style.height = Math.min(maxHeight, window.pageYOffset + browserArea) + "px"
	if (Date.now() - activated < 1000) {
		window.requestAnimationFrame(setDocumentBodyHeight)
	}
}

window.addEventListener("scroll", function() {
	activated = Date.now()
	setDocumentBodyHeight()
})
setDocumentBodyHeight()
window.addEventListener("resize", setDocumentBodyHeight)

module.exports = roomManager
