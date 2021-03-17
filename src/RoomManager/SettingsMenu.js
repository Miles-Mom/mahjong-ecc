function SettingsMenu(settingsDiv, isHost = false) {
	while (settingsDiv.firstChild) {settingsDiv.firstChild.remove()}

	//Construct header.
	let header = document.createElement("h2")
	header.innerHTML = "Game Settings"
	header.style.marginTop = "0"
	header.style.marginBottom = "0.5em"
	settingsDiv.appendChild(header)


	let options = {}
	//Use Object.assign so GameStyleSelector can get a reference to all selectors.
	Object.assign(options, {
		gameStyle: new GameStyleSelector(options),
		maximumSequences: new MaximumSequencesSelector(),
		checkForCalling: new CheckForCallingSelector(),
		botSettings: new BotSettings()
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

	let p = document.createElement("p")
	p.innerHTML = "American Mahjong does not support bots at the moment. Play with your own card. "
	p.style.fontSize = "1.3em"
	settingsDiv.appendChild(p)

	if (Object.keys(options).length === 0) {header.remove()} //No settings to show.

	this.getChoices = function(excludeClient = true) {
		let obj = {}
		for (let option in options) {
			obj[option] = options[option].get()
		}
		return obj
	}
	this.setChoices = function(obj = {}) {
		for (let option in obj) {
			if (options[option]) {
				options[option].set(obj[option])
			}
		}
	}
}

function GameStyleSelector(allSettingsSelectors) {
	let elem = document.createElement("div")
	elem.id = "gameStyleSelectorDiv"

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
	this.set = function(value = "chinese") {
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

module.exports = SettingsMenu
