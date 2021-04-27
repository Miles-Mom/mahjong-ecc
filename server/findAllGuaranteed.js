let fs, path;
try {
	fs = require("fs")
	path = require("path")
}
catch (e) {console.warn(e)}

function processDir(dirSrc, res = {}, allowFiles = true) {
	fs.readdirSync(dirSrc).forEach((itemName) => {
		let itemSrc = path.join(dirSrc, itemName)

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

function findAllGuaranteed(guaranteedDir = path.join(__dirname, "guaranteed")) {
	options = processDir(guaranteedDir, {}, allowFiles = false)

	return options
}

module.exports = findAllGuaranteed
