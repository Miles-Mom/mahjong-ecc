//We need to use SaveManager because localStorage doesn't persist on iOS (and maybe not on Android)
const {readSave, writeSave, deleteSave} = require("./SaveManager.js")

class Setting {
	//Setting class converts all data types to strings (other data types won't store on disk)
	//Subclasses will handle conversions back and forth.

	//this.value - value of setting, has getters and settings
	//this.loaded - Promise that resolved when setting loaded from disk.
	//this.saved - Promise that resolves when setting saves to disk.
	constructor(saveKey, defaultValue) {
		this.saveKey = saveKey
		this.defaultValue = String(defaultValue)
		this.loaded = this.getValueFromDisk() //Begin loading value from disk immediately.
	}

	async getValueFromDisk() {
		this.currentValue = await readSave(this.saveKey)
		return this.currentValue
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

	// EXC Note to Tucker:  chicken and egg problem, settings comes before i18n in initialization, but we need the yes/no text, hence the change. 
	createSelector(labelText, yesText, noText, appendToElem) {
		let booleanSettingLabel = document.createElement("label")
		booleanSettingLabel.innerHTML = labelText

		let tempId = "booleanSetting" + (Math.random() * (2**52)) //TODO: Should probably utilize labelText to eliminate any possibility of collisions.

		let booleanSettingToggle = document.createElement("input")
		booleanSettingToggle.type = "checkbox"
		booleanSettingToggle.classList.add("switch")
		booleanSettingToggle.id = tempId

		//<label for="switch3" data-on-label="Yes" data-off-label="No"></label>
		let booleanSettingToggleLabel = document.createElement("label")
		booleanSettingToggleLabel.setAttribute("for", tempId)
		booleanSettingToggleLabel.setAttribute("data-on-label", yesText)		
		booleanSettingToggleLabel.setAttribute("data-off-label", noText)

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
}


class NumberSliderSetting extends NumberSetting {
	constructor(saveKey, defaultValue) {
		super(saveKey, String(defaultValue))
	}
}


// added multiple choices setting
class SelectSetting extends Setting {

	constructor(saveKey, defaultValue) {
		super(saveKey, String(defaultValue))
	}
	
	// eg: createSelector("Choose Language: ", [{value:"en", text:"English"}, {value:"zh", text:"Chinese"}], appendToElem)
	createSelector(labelText, choices, appendToElem ) {
		let settingLabel = document.createElement("label")
		settingLabel.innerHTML = labelText

		let tempId = "ListSetting" + (Math.random() * (2**52)) //TODO: Should probably utilize labelText to eliminate any possibility of collisions.

		let settingSelect = document.createElement("select")
		settingSelect.id = tempId
	
		for (let i=0; i<choices.length; i++) {
			let settingOption = document.createElement("option")
			settingOption.value = choices[i].value
			settingOption.text = choices[i].text
			settingSelect.appendChild(settingOption)
		}

		//Initialize
		settingSelect.value = this.value

		settingSelect.addEventListener("change", (function() {
			this.value = settingSelect.value
		}).bind(this))

		let container = document.createElement("div")
		container.appendChild(settingLabel)
		container.appendChild(settingSelect)
		if (appendToElem) {
			appendToElem.appendChild(container)
		}
		return container
	}

}


module.exports = {BooleanSetting, Setting, NumberSetting, NumberSliderSetting, SelectSetting}
