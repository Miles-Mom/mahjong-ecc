const Popup = require("./Popups.js")

//We need to use SaveManager because localStorage doesn't persist on iOS (and maybe not on Android)
const {readSave, writeSave, deleteSave} = require("./SaveManager.js")

const debuggingDataSavePath = "settingCollectDebuggingData"


let settingsIcon = document.createElement("img")
if (window?.Capacitor) {
	//Until app is updated.
	settingsIcon.src = "https://mahjong4friends.com/assets/settings.svg"
}
else {
	settingsIcon.src = "assets/settings.svg"
}
settingsIcon.className = "settingsIcon"
settingsIcon.addEventListener("click", function() {
	let elem = document.createElement("div")

	//Create a container div for the actual settings inside the settings menu. This will be left justified. TODO: Right justify checkboxes/sliders
	let settingsMenuDiv = document.createElement("div")
	settingsMenuDiv.className = "settingsMenuDiv"
	elem.appendChild(settingsMenuDiv)


	//Add offline data collection setting.
	let offlineDataCollectionEnabledMessage = "Debugging data is collected for all games. "
	let offlineDataCollectionDisabledMessage = "Debugging data is collected for multiplayer games only. "

	let dataCollectionMessage = document.createElement("p")

	let dataCollectionLabel = document.createElement("label")

	let dataCollectionToggle = document.createElement("input")
	dataCollectionToggle.type = "checkbox"
	dataCollectionToggle.classList.add("switch")
	dataCollectionToggle.id = "dataCollectionToggle"


	//<label for="switch3" data-on-label="Yes" data-off-label="No"></label>
	let dataCollectionToggleLabel = document.createElement("label")
	dataCollectionToggleLabel.setAttribute("for", "dataCollectionToggle")
	dataCollectionToggleLabel.setAttribute("data-on-label", "Yes")
	dataCollectionToggleLabel.setAttribute("data-off-label", "No")


	settingsMenuDiv.appendChild(dataCollectionLabel)
	settingsMenuDiv.appendChild(dataCollectionToggle)
	settingsMenuDiv.appendChild(dataCollectionToggleLabel)
	settingsMenuDiv.appendChild(dataCollectionMessage)

	async function updateDataCollectionSetting() {
		let savedData = await readSave(debuggingDataSavePath)

		dataCollectionLabel.innerHTML = "Single Player Debugging Data: " //Don't set the text until we load the checkbox properly.

		let canCollect = (savedData !== "false")
		dataCollectionToggle.checked = canCollect

		dataCollectionToggle.classList.add("animate") //Don't animate the initialization. 

		if (canCollect) {
			dataCollectionMessage.innerHTML = offlineDataCollectionEnabledMessage
		}
		else {
			dataCollectionMessage.innerHTML = offlineDataCollectionDisabledMessage
		}
	}
	updateDataCollectionSetting()

	dataCollectionToggle.addEventListener("click", async function() {
		if (dataCollectionToggle.checked) {
			//Data collection enabled.
			await deleteSave(debuggingDataSavePath)
			updateDataCollectionSetting()
		}
		else {
			//Data collection disabled.
			await writeSave(debuggingDataSavePath, "false")
			updateDataCollectionSetting()
		}
	})


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
	popup = new Popups.Notification("Settings", elem)
	let popupElem = popup.show()
	popupElem.style.width = "100vw" //Force max width allowed. Prevents jumping.
})


module.exports = settingsIcon
