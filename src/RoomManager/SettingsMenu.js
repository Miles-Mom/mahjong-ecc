function SettingsMenu(settingsDiv, isHost = false) {
	while (settingsDiv.firstChild) {settingsDiv.firstChild.remove()}

	//Construct header.
	let header = document.createElement("h2")
	header.innerHTML = "Game Settings"
	header.style.marginTop = "0"
	header.style.marginBottom = "0.5em"
	settingsDiv.appendChild(header)


	let options = {
		maximumSequences: new MaximumSequencesSelector(),
		randomizeWinds: new RandomizeWindsSelector(),
		botSettings: new BotSettings()
	}

	for (let option in options) {
		let item = options[option]
		if (item.isHost && !isHost) {
			delete options[option];
			continue;
		}
		settingsDiv.appendChild(item.elem)
		item.set() //Set default choice.
	}

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



function RandomizeWindsSelector() {
	let elem = document.createElement("div")
	elem.id = "randomizeWindsSelectorDiv"

	let checkbox = document.createElement("input")
	checkbox.id = "randomizeWindsSelectorCheckbox"
	checkbox.type = "checkbox"

	let label = document.createElement("label")
	label.for = "randomizeWindsSelectorCheckbox"
	label.innerHTML = "Randomize Winds (Except East)"
	label.addEventListener("click", function() {checkbox.click()})

	this.elem = elem
	elem.appendChild(checkbox)
	elem.appendChild(label)

	this.get = function() {
		return checkbox.checked
	}
	this.set = function(boolean = false) {
		checkbox.checked = boolean
	}
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
	this.isHost = true
}

module.exports = SettingsMenu
