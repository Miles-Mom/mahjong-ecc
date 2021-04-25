let fs, path;
try {
	fs = require("fs")
	path = require("path")
}
catch (e) {console.warn(e)}

function findAllGuaranteed(guaranteedDir = path.join(__dirname, "guaranteed")) {
	let options = {}
	fs.readdirSync(guaranteedDir).forEach((cardName) => {
		let cardDir = path.join(guaranteedDir, cardName)

		if (!fs.statSync(cardDir).isDirectory()) {return}

		let card = {}
		options[cardName] = card

		fs.readdirSync(cardDir).forEach((dirname) => {
			let dirSrc = path.join(cardDir, dirname)

			if (!fs.statSync(dirSrc).isDirectory()) {return}

			let dir = {}
			card[dirname] = dir

			fs.readdirSync(dirSrc).forEach((subdirName) => {
				let subdirSrc = path.join(dirSrc, subdirName)

				if (!fs.statSync(subdirSrc).isDirectory()) {return}

				let subdir = {}
				dir[subdirName] = subdir

				let files = fs.readdirSync(subdirSrc).sort((a, b) => {
					//Compare as numbers, not strings. 
					return parseFloat(a) - parseFloat(b)
				}).slice(0, 20) //Limit max files offered.
				files.forEach((fileName) => {
					if (!fileName.endsWith(".server.json")) {return}
					let filePath = path.join(subdirSrc, fileName)
					subdir[fileName.replace(".server.json", "")] = fs.statSync(filePath).size
				})
			})
		})
	})

	return options
}

module.exports = findAllGuaranteed
