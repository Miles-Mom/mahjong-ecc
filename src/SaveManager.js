async function readSave(path) {
	if (window.Capacitor) {
		try {
			return (await Capacitor.Plugins.Filesystem.readFile({
				path,
				directory: "DATA",
				encoding: "utf8"
			})).data
		}
		catch (e) {
			console.error("Failed to Read", e)
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
	console.log("Written!")
}

async function deleteSave(path) {
	if (window.Capacitor) {
		Capacitor.Plugins.Filesystem.deleteFile({
			path,
			directory: "DATA"
		})
	}
	else {
		localStorage.removeItem(path)
	}
}


module.exports = {readSave, writeSave, deleteSave}
