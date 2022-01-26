const Popup = require("./Popups.js")

const {i18n} = require("./i18nHelper.js")

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

	//Create a container div for the actual settings inside the settings menu. This will be left justified. TODO: Right justify checkboxes/sliders
	let settingsMenuDiv = document.createElement("div")
	settingsMenuDiv.className = "settingsMenuDiv"
	elem.appendChild(settingsMenuDiv)

	let choices = [{value:"en", text:i18n.__("English")}, {value:"zh", text:i18n.__("Chinese")}]
	window.settings.locale.createSelector(i18n.__("Choose Language: "), choices, settingsMenuDiv)
	window.settings.locale.value = i18n.getLocale()

	function updateLocaleSetting() {
		let oldLocale = i18n.getLocale()
		let newLocale = window.settings.locale.getValue()
		if (oldLocale !== newLocale)
		{
			i18n.setLocale(newLocale)
			localeSettingChanged = true
		}
	}
	window.settings.locale.onValueSet = updateLocaleSetting

	let langCredit = document.createElement("p")
	langCredit.innerHTML = i18n.__("localization credit")
	settingsMenuDiv.appendChild(langCredit)			// EXC note to Tucker: add localization byline okay?

	window.settings.displayTips.createSelector(i18n.__("Display Tips: "), i18n.__("Yes"), i18n.__("No"), settingsMenuDiv)
	window.settings.soundEffects.createSelector(i18n.__("Sound Effects: "), i18n.__("Yes"), i18n.__("No"), settingsMenuDiv)
	window.settings.singlePlayerDebuggingData.createSelector(i18n.__("Single Player Debugging Data: "), i18n.__("Yes"), i18n.__("No"), settingsMenuDiv)

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
	popup = new Popups.Notification(i18n.__("Settings"), elem)
	popup.ondismissed = refreshScreen

	let popupElem = popup.show()
	popupElem.style.width = "100vw" //Force max width allowed. Prevents jumping.
})


module.exports = settingsIcon
