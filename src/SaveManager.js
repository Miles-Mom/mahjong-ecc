if (window.Capacitor) {
	require("@capacitor/filesystem") //This is necessary. Not sure why. 	
}

async function readSave(path, directory = "DATA") {
	if (window.Capacitor) {
		try {
			return (await Capacitor.Plugins.Filesystem.readFile({
				path,
				directory,
				encoding: "utf8"
			})).data
		}
		catch (e) {
			//Failed to read - probably did not exist.
			//Return null (like localStorage.getItem())
			return null
		}
	}
	else {
		return localStorage.getItem(path)
	}
}

async function writeSave(path, text, directory = "DATA") {
	if (window.Capacitor) {
		return await Capacitor.Plugins.Filesystem.writeFile({
			path,
			directory,
			data: text,
			recursive: true,
			encoding: "utf8"
		})
	}
	else {
		localStorage.setItem(path, text)
	}
}

async function deleteSave(path, directory = "DATA") {
	if (window.Capacitor) {
		await Capacitor.Plugins.Filesystem.deleteFile({
			path,
			directory
		})
	}
	else {
		localStorage.removeItem(path)
	}
}

module.exports = {readSave, writeSave, deleteSave}
