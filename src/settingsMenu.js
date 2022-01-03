const {BooleanSetting, Setting, NumberSetting, NumberSliderSetting} = require("./Settings.js")


//General
let singlePlayerDebuggingData = new BooleanSetting("settingCollectDebuggingData", true)
let tipOfTheDay = new BooleanSetting("settingTipOfTheDay", true)
let soundEffects = new BooleanSetting("settingSoundEffects", false)













//
//
//
//
// let gameStyleSetting = new StringSetting("gameStyle") //Default undefined - force user to select something first.
//
//
// //Multiple Variants
//
// //Chinese
// let chineseTableLimitEnabled = new BooleanSetting("chinese.tableLimitEnabled", false)
// let chineseTableLimit = new NumberSetting("chinese.tableLimit", 500)
// let chineseAllow4thTilePickup = new BooleanSetting("chinese.allow4thTilePickup", true)
// let chineseBotCanStartCharleston = new BooleanSetting("chinese.botCanStartCharleston", false)
// let chinesePickupDiscardForDraw = new BooleanSetting("chinese.pickupDiscardForDraw", false)
//
// //American
// let americanCard = new StringSetting("american.card", "2021 National Mahjong League")
// let americanSuggestedHandsEnabled = new BooleanSetting("american.suggestedHands", true)
// let americanBotDifficulty = new RangeSetting("american.botDifficulty", 50)
// let americanIgnoreBotMahjong = new BooleanSetting("american.ignoreBotMahjong", false)
//
//
//















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
settingsIcon.addEventListener("click", async function() {

	await singlePlayerDebuggingData.loaded



	let elem = document.createElement("div")

	//Create a container div for the actual settings inside the settings menu. This will be left justified. TODO: Right justify checkboxes/sliders
	let settingsMenuDiv = document.createElement("div")
	settingsMenuDiv.className = "settingsMenuDiv"
	elem.appendChild(settingsMenuDiv)


	singlePlayerDebuggingData.createSelector("Single Player Debugging Data: ", settingsMenuDiv)

	//Add offline data collection setting.
	let offlineDataCollectionEnabledMessage = "Debugging data is collected for all games. "
	let offlineDataCollectionDisabledMessage = "Debugging data is collected for multiplayer games only. "

	let dataCollectionMessage = document.createElement("p")

	settingsMenuDiv.appendChild(dataCollectionMessage)

	function setDataCollectionMessage() {
		if (singlePlayerDebuggingData.value) {
			dataCollectionMessage.innerHTML = offlineDataCollectionEnabledMessage
		}
		else {
			dataCollectionMessage.innerHTML = offlineDataCollectionDisabledMessage
		}
	}
	setDataCollectionMessage()
	singlePlayerDebuggingData.onValueSet = setDataCollectionMessage


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
