function SettingsMenu(settingsDiv, isHost = false) {
	while (settingsDiv.firstChild) {settingsDiv.firstChild.remove()}

	//Construct header.
	let header = document.createElement("h2")
	header.innerHTML = "Game Settings"
	header.style.marginTop = "0"
	header.style.marginBottom = "0.5em"
	settingsDiv.appendChild(header)

	//Appended later, so it is last.
	let americanMahjongInfo = document.createElement("p")
	americanMahjongInfo.innerHTML = "2021 Card Now Supported! Play with bots or friends (link and/or QR below!) You can play with any card you want - the selected card is only used for automated scoring and bots (which will still run, just on whichever card is selected). <br><br>Not all moves are validated - if you make a mistake, you can use the \"Revert\" button to undo it. "
	americanMahjongInfo.style.fontSize = "1.3em"

	let options = {}
	//Use Object.assign so GameStyleSelector can get a reference to all selectors.
	Object.assign(options, {
		gameStyle: new GameStyleSelector(options, {americanMahjongInfo}),

		//Chinese
		maximumSequences: new MaximumSequencesSelector(),
		checkForCalling: new CheckForCallingSelector(),
		botSettings: new BotSettings(),

		//American
		card: new CardSelector(),
		americanBotDifficulty: new AmericanBotDifficulty()

		//Both
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

	if (Object.keys(options).length === 0) {header.remove()} //No settings to show.

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

function GameStyleSelector(allSettingsSelectors, {americanMahjongInfo}) {
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

	let buttons = [chinese, american]
	function setSelectedButton(selectedButton) {
		//Switch the button selected.
		buttons.forEach((button) => {
			if (button === selectedButton) {
				button.disabled = "disabled"
			}
			else {button.disabled = ""}
		})

		americanMahjongInfo.style.display = selectedButton.value === "american"?"":"none"

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
	label.innerHTML = "Maximum Sequences: "

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
	checkbox.id = "botSelectorCheckbox"
	checkbox.type = "checkbox"

	let label = document.createElement("label")
	label.for = "botSelectorCheckbox"
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

function CardSelector() {
	let elem = document.createElement("div")
	elem.style.marginBottom = "5px"

	let select = document.createElement("select")
	select.style.fontSize = "1.4em"

	;["2021 National Mahjongg League", "2020 National Mahjongg League"].forEach((value, index) => {
		let option = document.createElement("option")
		option.value = value
		option.innerHTML = value
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
	this.set = function(value = 60) {
		input.value = value
	}
	this.displayFor = ["american"]
	this.isHost = true
}

module.exports = SettingsMenu
