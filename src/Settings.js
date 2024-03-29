//We need to use SaveManager because localStorage doesn't persist on iOS (and maybe not on Android)
const {readSave, writeSave, deleteSave} = require("./SaveManager.js")
const {i18n} = require("./i18nHelper.js")

class Setting {
	//Setting class converts all data types to strings (other data types won't store on disk)
	//Subclasses will handle conversions back and forth.

	//this.value - value of setting, has getters and settings
	//this.loaded - Promise that resolved when setting loaded from disk.
	//this.saved - Promise that resolves when setting saves to disk.

	//this.onValueSet - If set, this callback will be called with the new value whenever the value is SET (doesn't necessarily change).
	constructor(saveKey, defaultValue) {
		this.saveKey = saveKey
		this.defaultValue = String(defaultValue)
		this.loaded = this.getValueFromDisk() //Begin loading value from disk immediately.
	}

	async getValueFromDisk() {
		this.currentValue = await readSave(this.saveKey)
	}

	async setValueToDisk() {
		if (this.currentValue === this.defaultValue) {
			return await deleteSave(this.saveKey)
		}
		await writeSave(this.saveKey, this.currentValue)
	}

	getValue() {
		return this.currentValue ?? this.defaultValue
	}

	setValue(newValue) {
		this.currentValue = String(newValue)
		this.saved = this.setValueToDisk()
		try {
			if (this.onValueSet) {this.onValueSet(newValue)}
		}
		finally {
			return this.saved
		}
	}
	
	get value() {return this.getValue()}
	set value(newValue) {this.setValue(newValue)}

	createSelector(labelText, optionsArr, appendToElem) {
		let container = document.createElement("div")

		let settingLabel = document.createElement("label")
		settingLabel.innerHTML = i18n.__(labelText)
		container.appendChild(settingLabel)

		let selectElem = document.createElement("select")
		container.appendChild(selectElem)

		optionsArr.forEach((option, index) => {
			if (typeof option === "string") {
				option = {name: option, value: option}
			}

			let optionElem = document.createElement("option")

			if (option.value === undefined) {
				optionElem.disabled = true
			}

			optionElem.value = option.value
			optionElem.innerHTML = i18n.__(option.name)
			selectElem.appendChild(optionElem)
		})

		selectElem.value = this.value

		selectElem.addEventListener("change", (function() {
			this.value = selectElem.value
		}).bind(this))

		if (appendToElem) {
			appendToElem.appendChild(container)
		}
		return container
	}
}

class BooleanSetting extends Setting {
	//Store booleans as strings
	constructor(saveKey, defaultValue) {
		super(saveKey, String(defaultValue))
	}

	get value() {
		let strVal = this.getValue()
		if (strVal === "false") {return false}
		return true
	}
	set value(newValue) {this.setValue(newValue)}

	createSelector(labelText, appendToElem) {
		let booleanSettingLabel = document.createElement("label")
		booleanSettingLabel.innerHTML = i18n.__(labelText)

		let tempId = "booleanSetting" + (Math.random() * (2**52)) //TODO: Should probably utilize labelText to eliminate any possibility of collisions.

		let booleanSettingToggle = document.createElement("input")
		booleanSettingToggle.type = "checkbox"
		booleanSettingToggle.classList.add("switch")
		booleanSettingToggle.id = tempId

		//<label for="switch3" data-on-label="Yes" data-off-label="No"></label>
		let booleanSettingToggleLabel = document.createElement("label")
		booleanSettingToggleLabel.setAttribute("for", tempId)
		booleanSettingToggleLabel.setAttribute("data-on-label", i18n.__("Yes"))
		booleanSettingToggleLabel.setAttribute("data-off-label", i18n.__("No"))

		//Initialize
		booleanSettingToggle.checked = this.value
		booleanSettingToggle.classList.add("animate")

		booleanSettingToggle.addEventListener("click", (function() {
			this.value = booleanSettingToggle.checked
		}).bind(this))

		let container = document.createElement("div")
		container.appendChild(booleanSettingLabel)
		container.appendChild(booleanSettingToggle)
		container.appendChild(booleanSettingToggleLabel)
		if (appendToElem) {
			appendToElem.appendChild(container)
		}
		return container
	}
}

class NumberSetting extends Setting {
	//Store numbers as strings
	constructor(saveKey, defaultValue) {
		super(saveKey, String(defaultValue))
	}

	get value() {
		return Number(this.getValue())
	}
	set value(newValue) {this.setValue(newValue)}

	createSelector(labelText, appendToElem) {
		let settingLabel = document.createElement("label")
		settingLabel.innerHTML = i18n.__(labelText)

		let inputElem = document.createElement("input")
		inputElem.type = "number"
		inputElem.value = this.value

		inputElem.addEventListener("change", (function() {
			this.value = inputElem.value
		}).bind(this))

		let container = document.createElement("div")
		container.appendChild(settingLabel)
		container.appendChild(inputElem)
		if (appendToElem) {
			appendToElem.appendChild(container)
		}
		return container
	}
}


class NumberSliderSetting extends NumberSetting {
	constructor(saveKey, defaultValue) {
		super(saveKey, String(defaultValue))
	}

	createSelector(labelText, bounds, appendToElem) {
		let input = document.createElement("input")
		input.type = "range"
		input.min = bounds.min.value
		input.max = bounds.max.value

		let label = document.createElement("label")
		label.innerHTML = i18n.__(bounds.min.label)

		//Right now, no browser supports labeled tick marks, so we'll just do this.
		let label2 = document.createElement("label")
		label2.innerHTML = i18n.__(bounds.max.label)

		input.value = this.value

		input.addEventListener("change", (function() {
			this.value = input.value
		}).bind(this))

		let container = document.createElement("div")
		container.appendChild(label)
		container.appendChild(input)
		container.appendChild(label2)
		if (appendToElem) {
			appendToElem.appendChild(container)
		}
		return container
	}
}


module.exports = {BooleanSetting, Setting, NumberSetting, NumberSliderSetting}
