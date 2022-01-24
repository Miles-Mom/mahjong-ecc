const Popup = require("./Popups.js")

let settingsIcon = document.createElement("img")
if (window?.Capacitor) {
	//Until app is updated.
	settingsIcon.src = "https://mahjong4friends.com/assets/settings.svg"
}
else {
	settingsIcon.src = "assets/settings.svg"
}
settingsIcon.className = "settingsIcon"
settingsIcon.addEventListener("click", async function() {

	await window.settings.singlePlayerDebuggingData.loaded

	let elem = document.createElement("div")

	//Create a container div for the actual settings inside the settings menu. This will be left justified. TODO: Right justify checkboxes/sliders
	let settingsMenuDiv = document.createElement("div")
	settingsMenuDiv.className = "settingsMenuDiv"
	elem.appendChild(settingsMenuDiv)

	window.settings.soundEffects.createSelector("Sound Effects: ", settingsMenuDiv)
	window.settings.insertTilesAtEnd.createSelector("Insert Tiles at End: ", settingsMenuDiv)
	//window.settings.displayTips.createSelector("Display Tips: ", settingsMenuDiv)
	window.settings.singlePlayerDebuggingData.createSelector("Single Player Debugging Data: ", settingsMenuDiv)

	//Add offline data collection setting.
	let offlineDataCollectionEnabledMessage = "Debugging data is collected for all games. "
	let offlineDataCollectionDisabledMessage = "Debugging data is collected for multiplayer games only. "

	let dataCollectionMessage = document.createElement("p")

	settingsMenuDiv.appendChild(dataCollectionMessage)

	function setDataCollectionMessage() {
		if (window.settings.singlePlayerDebuggingData.value) {
			dataCollectionMessage.innerHTML = offlineDataCollectionEnabledMessage
		}
		else {
			dataCollectionMessage.innerHTML = offlineDataCollectionDisabledMessage
		}
	}
	setDataCollectionMessage()
	window.settings.singlePlayerDebuggingData.onValueSet = setDataCollectionMessage

	//Add button to delete collected data.
	let deleteDataButton = document.createElement("button")
	deleteDataButton.innerHTML = "Delete Collected Data"
	deleteDataButton.className = "deleteDataButton"
	deleteDataButton.addEventListener("click", function() {
		let dataPolicyPopup = new Popups.Notification("Data Storage Policy", "All server logs are anonymous and deleted within 7 days, unless you specified a game to be pulled for debugging - if so, please email <a href='mailto:support@mahjong4friends.com'>support@mahjong4friends.com</a> if you wish for that game to be deleted. ")
		dataPolicyPopup.show()
	})
	elem.appendChild(deleteDataButton)


	//Display elem inside a popup.
	popup = new Popups.Notification("General Settings", elem)
	let popupElem = popup.show()
	popupElem.style.width = "100vw" //Force max width allowed. Prevents jumping.
})


module.exports = settingsIcon
