//TODO: Update client side code to rename guaranteedHands as well.
//TODO: Acutally insert code to call syncSaveFiles periodicially.
const fs = require("fs")
const path = require("path")

//We'll use an internet hosted Git repo to allow for dynamic updates - things can be manually added as long as they don't collide.
//If we need to do multiple directories in the future (one from local, one from GitHub, etc, that can be done)
const child_process = require("child_process")
const saveFileProjectName = "mahjong-tutorials" //TODO: RoomManager.js has this hardcoded - it needs to change as well (search for "mahjong-tutorials" - no quotes - in the file)
const saveFileProjectUrl = `https://github.com/ecc521/${saveFileProjectName}`

const saveFileDirectory = path.join(__dirname, saveFileProjectName)

function syncSaveFiles() {
	//We'll clone if absent, otherwise fetch/pull.
	let process;

	if (fs.existsSync(saveFileDirectory)) {
		//Fetch + Pull
		process = child_process.exec("git fetch && git pull", {cwd: saveFileDirectory})
	}
	else {
		//Clone
		process = child_process.spawn("git", ["clone", saveFileProjectUrl], {cwd: __dirname})
	}

	return new Promise((resolve, reject) => {
		process.on('close', resolve);
	})
}


function processDir(dirSrc, res = {}, allowFiles = true) {
	fs.readdirSync(dirSrc).forEach((itemName) => {
		let itemSrc = path.join(dirSrc, itemName)
		if (itemName === ".git") {return;}

		if (fs.statSync(itemSrc).isDirectory()) {
			//Is directory. Call processDir
			res[itemName] = {}
			processDir(itemSrc, res[itemName])
		}
		//Files in the root component are skipped.
		else if (allowFiles) {
			//Is file. Add to res.
			if (!itemName.endsWith(".server.json")) {return}
			res[itemName.replace(".server.json", "")] = fs.statSync(itemSrc).size

		}
	})
	return res
}

function findSaveFiles(saveFileDir = saveFileDirectory) {
	options = processDir(saveFileDir, {}, allowFiles = false)

	return options
}

module.exports = {
	findSaveFiles,
	syncSaveFiles
}
