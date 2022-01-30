const Popup = require("./Popups.js")

const {i18n, initToClientLocale} = require("./i18nHelper.js")

let localeSettingChanged = false

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
    await window.settings.locale.loaded

	let elem = document.createElement("div")

	//Create a container div for the actual settings inside the settings menu. This container is left justified.
	let settingsMenuDiv = document.createElement("div")
	settingsMenuDiv.className = "settingsMenuDiv"
	elem.appendChild(settingsMenuDiv)

	//Language choices are displayed in the target language, to allow users to recognize languages they know (and not get stuck)
	const choices = [
		{
			name: "English",
			value: "en"
		},
		{
			name: "中文",
			value: "zh"
		}
	]

	function updateLocaleSetting() {
		let oldLocale = i18n.getLocale()
		i18n.setLocale(window.settings.locale.getValue())
		let newLocale = i18n.getLocale()
		if (oldLocale !== newLocale){
			localeSettingChanged = true
		}
	}
	window.settings.locale.createSelector("Choose Language: ", choices, settingsMenuDiv)
	window.settings.locale.onValueSet = updateLocaleSetting

	let langCredit = document.createElement("p")
	langCredit.innerHTML = i18n.__("localization credit")
	settingsMenuDiv.appendChild(langCredit)

	window.settings.soundEffects.createSelector("Sound Effects: ", settingsMenuDiv)
	window.settings.autoSortTiles.createSelector("Auto-Sort Tiles: ", settingsMenuDiv)
	//window.settings.displayTips.createSelector("Display Tips: ", settingsMenuDiv)
	window.settings.singlePlayerDebuggingData.createSelector("Single Player Debugging Data: ", settingsMenuDiv)


	//Add offline data collection setting.
	let offlineDataCollectionEnabledMessage = i18n.__("Debugging data is collected for all games. ")
	let offlineDataCollectionDisabledMessage = i18n.__("Debugging data is collected for multiplayer games only. ")

	let dataCollectionMessage = document.createElement("p")

	settingsMenuDiv.appendChild(dataCollectionMessage)

	function setDataCollectionMessage() {
		if (window.settings.singlePlayerDebuggingData.value) {
			dataCollectionMessage.innerHTML = i18n.__( offlineDataCollectionEnabledMessage)
		}
		else {
			dataCollectionMessage.innerHTML = i18n.__( offlineDataCollectionDisabledMessage)
		}
	}
	setDataCollectionMessage()
	window.settings.singlePlayerDebuggingData.onValueSet = setDataCollectionMessage

	//Add button to delete collected data.
	let deleteDataButton = document.createElement("button")
	deleteDataButton.innerHTML = i18n.__("Delete Collected Data")
	deleteDataButton.className = "deleteDataButton"
	deleteDataButton.addEventListener("click", function() {
		let dataPolicyPopup = new Popups.Notification(i18n.__("Data Storage Policy"),
			i18n.__("All server logs are anonymous and deleted within 7 days, unless you specified a game to be pulled for debugging - if so, please email %s if you wish for that game to be deleted. ", "<a href='mailto:support@mahjong4friends.com'>support@mahjong4friends.com</a>"))
		dataPolicyPopup.show()
	})
	elem.appendChild(deleteDataButton)

	//refresh screen upon i18n changes
	function refreshScreen() {
		if (localeSettingChanged) {
			window.location.reload(true)
		}
	}

	//Display elem inside a popup.
	popup = new Popups.Notification(i18n.__("General Settings"), elem)
	popup.ondismissed = refreshScreen
	let popupElem = popup.show()
	popupElem.style.width = "100vw" //Force max width allowed. Prevents jumping.
})


module.exports = settingsIcon
