const Popups = require("./Popups.js")
const SettingsMenu = require("./RoomManager/SettingsMenu.js")
const {readSave, writeSave, deleteSave} = require("./SaveManager.js")

const QRCode = require("qrcode-generator")

if (window.Capacitor) {
	//Configure AppRate plugin.
	try {
		AppRate.setPreferences({
			displayAppName: 'Mahjong 4 Friends',
			simpleMode: false, //Worth considering - the negative feedback filtering is a bit excessive for repeat players, though it is friendly.
			usesUntilPrompt: 10, //We might want to configure this a bit better.
			promptAgainForEachNewVersion: false,
			reviewType: {
				ios: 'InAppReview',
			},
			storeAppURL: {
				ios: "1552704332",
			},
			customLocale: {
				title: "Would you mind rating %@?",
				message: "It won’t take more than a minute and helps others find our app. Thanks for your support!",
				cancelButtonLabel: "No, Thanks",
				laterButtonLabel: "Remind Me Later",
				rateButtonLabel: "Rate It Now",
				yesButtonLabel: "Yes!",
				noButtonLabel: "Not Yet",
				appRatePromptTitle: 'Do you like using %@',
				feedbackPromptTitle: "Would you like to give us feedback?",
			},
			callbacks: {
				handleNegativeFeedback: function(){
					cordova.plugins.email.open({
					  to: 'support@mahjong4friends.com',
					  subject: 'Mahjong 4 Friends iOS Feedback',
					  body: '',
					  isHtml: true
					})
				},
				onRateDialogShow: function(callback) {
					console.log("Click")
					callback(1) // cause immediate click on 'Rate Now' button
				},
				onButtonClicked: function(buttonIndex){
					console.log("onButtonClicked -> " + buttonIndex);
				}
			}
		});
	}
	catch (e) {
		console.error(e)
	}
}

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
if (params.has("fakeNative")) {
	if (params.get("fakeNative") === "android") {
		window.isAndroid = true
	}
	else if (params.get("fakeNative") === "ios") {
		window.Capacitor = true
	}
	else {
		console.error("fakeNative set and invalid")
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
fileInput.addEventListener("change", async function() {
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
		}
		catch (e) {
			console.error(e)
			alert("Error loading save. Please make sure you selected the correct file. ")
		}
	}
})
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
		addColumn(header, "Save")

		Object.keys(obj).forEach((cardName) => {
			//We can display all cards and options at once right now.

			let card = obj[cardName]
			let baseRows = [`${cardName.replace("National Mahjongg League", "NMJL")}`]

			Object.keys(card).forEach((sectionName) => {
				let section = card[sectionName]
				let row = document.createElement("tr")
				row.className = "sectionRow"
				table.appendChild(row)

				baseRows.push(`${sectionName}`)
				baseRows.forEach((text) => {
					addColumn(row, text)
				})
				addColumn(row, `${Object.keys(section).length} hands`)
				addColumn(row, "")

				let cachedBaseRows = baseRows.slice(0)
				let expansion = [];
				row.addEventListener("click", function() {
					if (expansion[0]) {
						while (expansion[0]) {expansion.pop().remove()}
					}
					else {
						let insertBefore = row.nextSibling
						Object.keys(section).forEach((itemName) => {
							let saves = section[itemName]

							let savesRow = document.createElement("tr")
							savesRow.className = "savesRow"
							table.insertBefore(savesRow, insertBefore)

							let baseRows = cachedBaseRows
							baseRows.push(`Hand #${itemName}`)
							baseRows.forEach((text, index) => {
								addColumn(savesRow, text)
							})
							addColumn(savesRow, `${Object.keys(saves).length} saves`)

							expansion.push(savesRow)

							let cachedBaseRows2 = baseRows.slice(0);
							let savesExpansion = []
							savesRow.addEventListener("click", function() {
								if (savesExpansion[0]) {
									while (savesExpansion[0]) {savesExpansion.pop().remove()}
								}
								else {
									let insertBefore = savesRow.nextSibling
									Object.keys(saves).forEach((saveName) => {
										let save = saves[saveName]

										let saveRow = document.createElement("tr")
										saveRow.className = "saveRow"
										table.insertBefore(saveRow, insertBefore)

										let baseRows = cachedBaseRows2
										baseRows.forEach((text) => {
											addColumn(saveRow, text)
										})
										addColumn(saveRow, `Save #${saveName} (${Math.round(save/1000)}kB)`)
										saveRow.addEventListener("click", async function() {
											let baseUrl = window.location.href
											if (window.Capacitor) {
												baseUrl = "https://mahjong4friends.com/"
											}
											baseUrl += encodeURI(`server/guaranteed/${cardName}/${sectionName}/${itemName}/${saveName}.server.json`)
											console.log(baseUrl)
											let req = await fetch(baseUrl)
											let text = await req.text()
											console.log(text)
											resumeOfflineGame(text)
											//TODO: We need to create a revert menu and open it.
										})

										savesExpansion.push(saveRow)
										expansion.push(saveRow)
									})
								}
							})

							baseRows.pop()
						})
					}
				})
				baseRows.pop()
			})
		})
	})())

	let uploadFromDevice = document.createElement("button")
	uploadFromDevice.innerHTML = "Upload From Device"
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
				if (window.Capacitor) {
					//iOS Capacitor doesn't support link downloads. Use share menu.
					let saveInfo = await writeSave(downloadName, res, "CACHE")
					await Capacitor.Plugins.Share.share({
						title: downloadName,
						url: saveInfo.uri
					})
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

if (window.Capacitor || window.isAndroid) {
	let ratingPrompt = document.createElement("p")
	ratingPrompt.id = "supportInfo"
	if (window.Capacitor) {
		ratingPrompt.innerHTML = `Enjoying Mahjong 4 Friends? Please <a href="https://apps.apple.com/us/app/mahjong-4-friends/id1552704332" target="_blank">rate us in the App Store</a>!`
	}
	else if (window.isAndroid) {
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

//Facebook Embed - https://developers.facebook.com/docs/plugins/page-plugin/
let facebookDiv = document.createElement("div")
setTimeout(function() {
	if (stateManager.inRoom.includes("fbtest")) {
		facebookDiv.innerHTML += `<iframe sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox" src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FMahjong-4-Friends-103233541852386&tabs=timeline&width=500&height=500&small_header=true&adapt_container_width=true&hide_cover=true&show_facepile=true&appId" width="500" height="500" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>`
	}
}, 2000)
roomManager.appendChild(facebookDiv)

let copyrightNotice = document.createElement("p")
copyrightNotice.innerHTML = "Copyright © 2020, All Rights Reserved"
copyrightNotice.id = "copyrightNotice"
roomManager.appendChild(copyrightNotice)

//TODO: Need some ERROR HANDLING!!!!! speechSynthesis may not work/exist.
//TODO: Also need a way to deal with reloads.

//TODO: Use speechSynthesis onvoiceschange event (or whatever it is).
speechSynthesis.getVoices()

let voiceChoices = {}
window.voiceChoices = voiceChoices

function VoiceSelector() {
	let voiceOptionsSelect = document.createElement("select")
	let availableVoices = speechSynthesis.getVoices()
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


module.exports = roomManager
