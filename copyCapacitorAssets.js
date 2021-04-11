const fs = require("fs")
const path = require("path")

let assets = require("./neededOfflineAssets.js")

assets.forEach((item) => {
	let outputPath = path.join(__dirname, "capacitorDir", item)
	let inputPath = path.join(__dirname, item)

	if (!fs.existsSync(path.dirname(outputPath))) {
		fs.mkdirSync(path.dirname(outputPath), {recursive: true})
	}

	fs.writeFileSync(outputPath, fs.readFileSync(inputPath))
})
