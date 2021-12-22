//TODO: Only upload settings available for the selected game mode.
function SettingsMenu(settingsDiv, isHost = false) {
	while (settingsDiv.firstChild) {settingsDiv.firstChild.remove()}

	//Construct header.
	let header = document.createElement("h2")
	header.innerHTML = "Game Settings"
	header.style.marginTop = "0"
	header.style.marginBottom = "0.5em"
	settingsDiv.appendChild(header)

	//Appended later, so these are last.
	let americanMahjongInfo = document.createElement("p")
	americanMahjongInfo.innerHTML = "2021 Card Now Supported! Play with bots or friends (link and/or QR below!) You can play with any card you want - just pick Other Card!<br>You can purchase cards from the <a target='_blank' href='https://www.nationalmahjonggleague.org/'>National Mah Jongg League</a> or from <a target='_blank' href='https://marvelousmahjongg.com/'>Marvelous Mah Jongg</a>"
	americanMahjongInfo.style.fontSize = "1.3em"

	let chineseMahjongInfo = document.createElement("p")
	chineseMahjongInfo.innerHTML = "Most variants should be supported, although overrides may be needed, and you might need to score your own hands. Can't play your way? Have suggestions? Need different bots? Send an email to support@mahjong4friends.com!"
	chineseMahjongInfo.style.fontSize = "1.3em"

	let panamaRulesInfo = document.createElement("p")
	panamaRulesInfo.innerHTML = "Chinese, but with a limit of 1 sequence/chow, and an optional 3 pass charleston (decided by East wind)"
	panamaRulesInfo.style.fontSize = "1.3em"

	let options = {}
	//Use Object.assign so GameStyleSelector can get a reference to all selectors.
	Object.assign(options, {
		gameStyle: new GameStyleSelector(options, {americanMahjongInfo, chineseMahjongInfo, panamaRulesInfo}),

		//Chinese
		maximumSequences: new MaximumSequencesSelector(),
		tableLimit: new TableLimitSelector(),
		checkForCalling: new CheckForCallingSelector(),
		botSettings: new BotSettings(),
		allow4thTilePickup: new Allow4thTilePickupSelector(),

		//American
		card: new CardSelector(),
		americanBotDifficulty: new AmericanBotDifficulty(),
		disableHints: new DisableHintsSelector(),
		pickupDiscardForDraw: new PickupDiscardForDrawSelector(),

		//Both
		ignoreBotMahjong: new IgnoreBotMahjongSelector(), //Currently works in American only - coded to appear only for American.
	})

	let hasChoices = false
	for (let option in options) {
		let item = options[option]
		if (item.isHost && !isHost) {
			delete options[option];
			continue;
		}
		else {
			hasChoices = true
		}
		settingsDiv.appendChild(item.elem)
		item.set() //Set default choice.
	}

	settingsDiv.style.display = hasChoices?"":"none"

	settingsDiv.appendChild(americanMahjongInfo)
	settingsDiv.appendChild(chineseMahjongInfo)
	settingsDiv.appendChild(panamaRulesInfo)

	if (Object.keys(options).length === 0) {header.remove()} //No settings to show.

	//TODO: We currently send all choices (for chinese and american) -
	//right now, all choices have different names, but some (like tableLimit)
	//may end up reused in the future. This should be changed to only send choices relevant to selected gameStyles.
	//Note that this may not actually be an issue - we can configure the same selector to display for multiple different gamestyles,
	//by changing displayFor - we might just need a way to have seperate defaults for every game mode.
	this.getChoices = function(excludeClient = true) {
		let obj = {}
		for (let option in options) {
			obj[option] = options[option].get()
		}

		try {
			//TODO: Should we save all changes, or just when getChoices is called (it's called when games are started, etc)
			localStorage.setItem("gameSettings", JSON.stringify(obj))
		}
		catch (e) {console.error(e)}

		return obj
	}
	this.setChoices = function(obj = {}) {
		for (let option in obj) {
			if (options[option]) {
				options[option].set(obj[option])
			}
		}
	}

	//Remember settings across reloads.
	if (localStorage.getItem("gameSettings")) {
		this.setChoices(JSON.parse(localStorage.getItem("gameSettings")))
	}
}

function GameStyleSelector(allSettingsSelectors, {americanMahjongInfo, chineseMahjongInfo, panamaRulesInfo}) {
	let elem = document.createElement("div")
	elem.id = "gameStyleSelectorDiv"
	elem.style.marginBottom = "10px"

	let chinese = document.createElement("button")
	chinese.innerHTML = "Chinese/British/HK Mahjong"
	chinese.value = "chinese"
	chinese.id = "selectChineseMahjong"
	elem.appendChild(chinese)

	let american = document.createElement("button")
	american.innerHTML = "American Mahjong"
	american.value = "american"
	american.id = "selectAmericanMahjong"
	elem.appendChild(american)

	let panama = document.createElement("button")
	panama.innerHTML = "Panama Rules"
	panama.value = "panama"
	panama.id = "selectPanamaRules"
	elem.appendChild(panama)

	let buttons = [chinese, american, panama]
	function setSelectedButton(selectedButton) {
		//Switch the button selected.
		buttons.forEach((button) => {
			if (button === selectedButton) {
				button.disabled = "disabled"
			}
			else {button.disabled = ""}
		})

		americanMahjongInfo.style.display = selectedButton.value === "american"?"":"none"
		chineseMahjongInfo.style.display = selectedButton.value === "chinese"?"":"none"
		panamaRulesInfo.style.display = selectedButton.value === "panama"?"":"none"

		//Hide all settings not for this mode.
		for (let prop in allSettingsSelectors) {
			let selector = allSettingsSelectors[prop]
			if (!selector.displayFor || selector.displayFor.includes(selectedButton.value)) {
				selector.elem.style.display = ""
			}
			else {selector.elem.style.display = "none"}
		}
	}

	buttons.forEach((button) => {
		button.addEventListener("click", function() {
			setSelectedButton(button)
		})
	})

	this.elem = elem

	this.get = function() {
		for (let i=0;i<buttons.length;i++) {
			let button = buttons[i]
			if (button.disabled) {
				return button.value
			}
		}
	}
	this.set = function(value) {
		setSelectedButton("mustbeset")
		buttons.forEach((item, i) => {
			if (item.value === value) {setSelectedButton(item)}
		});
	}
	this.isHost = true
}

function CheckForCallingSelector() {
	let elem = document.createElement("div")
	elem.id = "checkForCallingSelectorDiv"

	let checkbox = document.createElement("input")
	checkbox.id = "checkForCallingSelectorCheckbox"
	checkbox.type = "checkbox"

	let label = document.createElement("label")
	label.for = "checkForCallingSelectorCheckbox"
	label.innerHTML = "Check and Alert for Calling/Ready Hands"
	label.addEventListener("click", function() {checkbox.click()})

	label.style.fontSize = "1.4em"
	checkbox.style.fontSize = "1.4em"

	this.elem = elem
	elem.appendChild(checkbox)
	elem.appendChild(label)

	this.get = function() {
		return checkbox.checked
	}
	this.set = function(boolean = true) {
		checkbox.checked = boolean
	}
	this.displayFor = ["chinese"]
	this.isHost = true
}

function MaximumSequencesSelector() {
	let elem = document.createElement("div")
	elem.id = "maximumSequencesSelectorDiv"

	let input = document.createElement("input")
	input.id = "maximumSequencesSelector"
	input.type = "number"

	let label = document.createElement("label")
	label.for = "maximumSequencesSelector"
	label.innerHTML = "Maximum Sequences/Chows: "

	label.style.fontSize = "1.4em"
	input.style.fontSize = "1.4em"

	this.elem = elem
	elem.appendChild(label)
	elem.appendChild(input)

	this.get = function() {
		return input.value
	}
	this.set = function(value) {
		input.value = value ?? 4
	}
	this.displayFor = ["chinese"]
	this.isHost = true
}

function BotSettings() {
	let elem = document.createElement("div")
	elem.id = "botSelectorDiv"

	let checkbox = document.createElement("input")
	checkbox.type = "checkbox"

	let label = document.createElement("label")
	label.innerHTML = "Allow bot to charleston"
	label.addEventListener("click", function() {checkbox.click()})

	label.style.fontSize = "1.4em"
	checkbox.style.fontSize = "1.4em"

	this.elem = elem
	elem.appendChild(checkbox)
	elem.appendChild(label)

	this.get = function() {
		return {
			canCharleston: checkbox.checked
		}
	}
	this.set = function(obj = {}) {
		checkbox.checked = obj?.canCharleston ?? false
	}
	this.displayFor = ["chinese"]
	this.isHost = true
}

function TableLimitSelector() {
	let elem = document.createElement("div")

	let input = document.createElement("input")
	input.type = "number"

	let label = document.createElement("label")
	label.innerHTML = "Max Points (type 0 for Infinty): "

	label.style.fontSize = "1.4em"
	input.style.fontSize = "1.4em"

	this.elem = elem
	elem.appendChild(label)
	elem.appendChild(input)

	this.get = function() {
		return input.value
	}
	this.set = function(value) {
		input.value = value ?? 0
	}
	this.displayFor = ["chinese", "panama"]
	this.isHost = true
}

function CardSelector() {
	let elem = document.createElement("div")
	elem.style.marginBottom = "5px"

	let select = document.createElement("select")
	select.style.fontSize = "1.4em"

	let cardOptions = [
		"2021 National Mahjongg League",
		"2020 National Mahjongg League",
		{
			name: "2021 Marvelous Mah Jongg",
			value: "2021 Marvelous Mahjongg"
		},
		{
			name: "2022 Marvelous Mah Jongg",
			value: "2022 Marvelous Mahjongg"
		}
	]

	cardOptions.push("Other Card - Bots Use Random Card")

	cardOptions.forEach((value, index) => {
		let option = document.createElement("option")
		option.value = value.value || value
		option.innerHTML = value.name || value
		select.appendChild(option)
	})

	let label = document.createElement("label")
	label.innerHTML = "Select Mahjong Card: "
	label.style.fontSize = "1.4em"

	this.elem = elem
	elem.appendChild(label)
	elem.appendChild(select)

	this.get = function() {
		return select.value
	}
	this.set = function(value = "2021 National Mahjongg League") {
		select.value = value
	}
	this.displayFor = ["american"]
	this.isHost = true
}

function AmericanBotDifficulty() {
	let elem = document.createElement("div")
	elem.style.fontSize = "1.4em"

	let input = document.createElement("input")
	input.type = "range"
	input.min = 0
	input.max = 100

	let label = document.createElement("label")
	label.innerHTML = "Bot Difficulty:  Medium"

	//Right now, no browser supports labeled tick marks, so we'll just do this.
	let label2 = document.createElement("label")
	label2.innerHTML = "Superhuman"

	this.elem = elem
	elem.appendChild(label)
	elem.appendChild(input)
	elem.appendChild(label2)

	this.get = function() {
		return input.value
	}
	this.set = function(value = 50) {
		input.value = value
	}
	this.displayFor = ["american"]
	this.isHost = true
}

function DisableHintsSelector() {
	let elem = document.createElement("div")

	let checkbox = document.createElement("input")
	checkbox.type = "checkbox"

	let label = document.createElement("label")
	label.innerHTML = "Disable Hints/Suggested Hands"
	label.addEventListener("click", function() {checkbox.click()})

	label.style.fontSize = "1.4em"
	checkbox.style.fontSize = "1.4em"

	this.elem = elem
	elem.appendChild(checkbox)
	elem.appendChild(label)

	this.get = function() {
		return checkbox.checked
	}
	this.set = function(value = false) {
		checkbox.checked = value
	}
	this.displayFor = ["american"]
	this.isHost = true
}

function IgnoreBotMahjongSelector() {
	let elem = document.createElement("div")

	let checkbox = document.createElement("input")
	checkbox.type = "checkbox"

	let label = document.createElement("label")
	label.innerHTML = "Allow Play after Bot Mahjong"
	label.addEventListener("click", function() {checkbox.click()})

	label.style.fontSize = "1.4em"
	checkbox.style.fontSize = "1.4em"

	this.elem = elem
	elem.appendChild(checkbox)
	elem.appendChild(label)

	this.get = function() {
		return checkbox.checked
	}
	this.set = function(value = false) {
		checkbox.checked = value
	}
	this.displayFor = ["american"]
	this.isHost = true
}

function Allow4thTilePickupSelector() {
	let elem = document.createElement("div")

	let checkbox = document.createElement("input")
	checkbox.type = "checkbox"

	let label = document.createElement("label")
	label.innerHTML = "Automatically call 4th tile for exposed pong"
	label.addEventListener("click", function() {checkbox.click()})

	label.style.fontSize = "1.4em"
	checkbox.style.fontSize = "1.4em"

	this.elem = elem
	elem.appendChild(checkbox)
	elem.appendChild(label)

	this.get = function() {
		return checkbox.checked
	}
	this.set = function(value = true) {
		checkbox.checked = value
	}
	this.displayFor = ["chinese"]
	this.isHost = true
}

function PickupDiscardForDrawSelector() {
	let elem = document.createElement("div")

	let checkbox = document.createElement("input")
	checkbox.type = "checkbox"

	let label = document.createElement("label")
	label.innerHTML = "Allow claiming discard from prior player instead of draw"
	label.addEventListener("click", function() {checkbox.click()})

	label.style.fontSize = "1.4em"
	checkbox.style.fontSize = "1.4em"

	this.elem = elem
	elem.appendChild(checkbox)
	elem.appendChild(label)

	this.get = function() {
		return checkbox.checked
	}
	this.set = function(value = false) {
		checkbox.checked = value
	}
	this.displayFor = ["chinese"]
	this.isHost = true
}


module.exports = SettingsMenu
