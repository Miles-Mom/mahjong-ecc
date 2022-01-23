const Popups = require("../Popups.js")

const variants = [
	"Please Select Variant...",
	{
		name: "American (NMJL/Marvelous)",
		value: "american"
	},
	{
		name: "Chinese/British/HK",
		value: "chinese"
	},
	{
		name: "Panama Rules",
		value: "panama"
	}
]


const cardOptions = [
	"Select Card:",
	"2021 National Mahjongg League",
	{
		name: "2022 Marvelous Mah Jongg",
		value: "2022 Marvelous Mahjongg"
	},
	"2020 National Mahjongg League",
	{
		name: "2021 Marvelous Mah Jongg",
		value: "2021 Marvelous Mahjongg"
	},
	"Other Card - Bots Use Random Card"
]


class SettingsMenu {
	constructor(settingsDiv) {
		this.settingsDiv = settingsDiv
	}

	render() {
		//Renders settingsDiv with required settings.
		while (this.settingsDiv.firstChild) {this.settingsDiv.firstChild.remove()}
		if (!this.isHost) {return}

		window.settings.gameStyle.createSelector("Mahjong Variant: ", variants, this.settingsDiv)
		window.settings.gameStyle.onValueSet = this.render.bind(this)

		let gameStyle = window.settings.gameStyle.value
		if (gameStyle === "american") {
			window.settings.american.card.createSelector("Select Card: ", cardOptions, this.settingsDiv)
		}
	}

	openMenu() {
		//Opens the full menu - all non-required settings (where defaults are acceptable).
		let gameStyle = window.settings.gameStyle.value

		let elem = document.createElement("div")

		//Create a container div for the actual settings inside the settings menu. This will be left justified. TODO: Right justify checkboxes/sliders
		let settingsMenuDiv = document.createElement("div")
		settingsMenuDiv.className = "settingsMenuDiv"
		elem.appendChild(settingsMenuDiv)

		let info = ""
		if (gameStyle === "american") {
			//info = "Play with bots or friends (link and/or QR below!) You can play with any card you want - just pick Other Card!<br>You can purchase cards from the <a target='_blank' href='https://www.nationalmahjonggleague.org/'>National Mah Jongg League</a> or from <a target='_blank' href='https://marvelousmahjongg.com/'>Marvelous Mah Jongg</a>"

			window.settings.american.suggestedHands.createSelector("Suggested Hands: ", settingsMenuDiv)
			//window.settings.american.botDifficulty.createSelector("Bot Difficulty: ", settingsMenuDiv)
			window.settings.american.suggestedHands.createSelector("Ignore Bot Mahjong: ", settingsMenuDiv)
		}
		else if (gameStyle === "chinese") {
			info = "Most variants should be supported - self-scoring and overrides may be needed. Can't play your way? Send an email to support@mahjong4friends.com!"

			window.settings.chinese.tableLimitEnabled.createSelector("Table Limit: ", settingsMenuDiv)
			//window.settings.chinese.tableLimit.createSelector("Table Limit Amount: ", settingsMenuDiv)
			window.settings.chinese.allow4thTilePickup.createSelector("Allow 4th Tile Pickup: ", settingsMenuDiv)
			window.settings.chinese.botCanStartCharleston.createSelector("Bots Can Initiate Charleston: ", settingsMenuDiv)
			window.settings.chinese.pickupDiscardForDraw.createSelector("Pickup Discard for Draw: ", settingsMenuDiv)
		}
		else if (gameStyle === "panama") {
			info = "Chinese, but with a limit of 1 sequence/chow, and an optional 3 pass charleston (decided by East wind)"

			window.settings.chinese.tableLimitEnabled.createSelector("Table Limit: ", settingsMenuDiv)
			//window.settings.chinese.tableLimit.createSelector("Table Limit Amount: ", settingsMenuDiv)
		}

		window.settings.soundEffects.createSelector("Sound Effects: ", settingsMenuDiv)

		let infoDisplayElem = document.createElement("p")
		infoDisplayElem.innerHTML = info
		elem.appendChild(infoDisplayElem)

		//Display elem inside a popup.
		let popup = new Popups.Notification("Game Settings", elem)
		let popupElem = popup.show()
		popupElem.style.width = "100vw" //Force max width allowed. Prevents jumping.
	}

	setHost(isHost = false) {
		this.isHost = isHost
		this.render()
	}

	getChoices() {
		let gameStyle = window.settings.gameStyle.value
		if (gameStyle === "panama") {gameStyle = "chinese"}

		let settingsToExtract = window.settings[gameStyle]

		let outputObj = {
			gameStyle
		}

		for (let prop in settingsToExtract) {
			outputObj[prop] = settingsToExtract[prop].value
		}
		return outputObj
	}
}

module.exports = SettingsMenu
