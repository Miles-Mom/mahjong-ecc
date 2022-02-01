//Setup express server to serve static files, etc.

//TODO: Do something better than this for unhandledRejections
//TODO: This doesn't seem to be working all the time.
const process = require("process")
process
  .on('unhandledRejection', (reason, p) => {
    console.error(reason, 'Unhandled Rejection at Promise', p);
  })

const fs = require("fs")
const path = require("path")
const http = require("http")
const url = require("url")

const compression = require('compression')
const express = require('express')
const serveIndex = require('serve-index') //Dev stuff - just viewing directories. Should probably be removed or replaced.

const WebSocket = require('ws');


let app = express()
app.disable('x-powered-by')

//Compress all responses
app.use(compression({
	//Max GZIP options.
	level: 9,
	memLevel: 9,
	windowBits: 15,
}))

function assureRelativePathSafe(relSrc) {
    let hypoDir = "/a/b"
    let hypoDirSame = "\\a\\b"		// windows path.join will return "\\a\\b\\" from joining of "/a/b" and "/"
    let absSrc = path.join(hypoDir, relSrc)
    if (! (absSrc.startsWith(hypoDir) || absSrc.startsWith(hypoDirSame))) {
        throw "Path Traversal Forbidden"
    }
}

//Gets the body of a request.
function getData(request) {
	return new Promise((resolve, reject) => {
		let body = []
		request.on("data", function(chunk) {
			body.push(chunk)
		})
		request.on("end", function() {
			resolve(Buffer.concat(body))
		})
	})
}


//Serve remaining files.
app.all('*', (req, res, next) => {
	res.set("Access-Control-Allow-Origin", "*");

    let relativeSrc = decodeURIComponent(req.path)
	let extensions = ["", ".html", "index.html"]
	let src;
	let extension = extensions.find((ext) => {
        let relPath = relativeSrc + ext
        assureRelativePathSafe(relPath)
		src = path.join(__dirname, relPath)
		if (fs.existsSync(src)) {
			return !fs.statSync(src).isDirectory()
		}
	})

    //TODO: Use something more like startsWith, not includes
    if (src.includes("assets")) {
        res.set("Cache-Control", `max-age=${60 * 60 * 24 * 7}`); //Cache for 7 days
    }

	if (fs.existsSync(src)) {
		res.type(path.extname(src))
		let readStream = fs.createReadStream(src)
		readStream.pipe(res)
	}
	else {
		next()
	}
})

//serveIndex - can be removed.
app.all("*", (req, res, next) => {
	serveIndex(__dirname, {
		'icons': true,
		'view': "details" //Gives more info than tiles.
	})(req, res, next)
})

app.all("*", (req, res, next) => {
	res.status(404)
	res.type("text/plain")
	res.end("File Not Found")
})

const httpport = 8080
const httpserver = app.listen(httpport)




//Setup WebSocket server to handle multiplayer.

let serverDataDirectory = path.join(__dirname, "server", "data")

if (process.argv.includes("--serverDataDirectory")) {
	serverDataDirectory = process.argv[process.argv.indexOf("--serverDataDirectory") + 1]
}

//Log timestamp every 60 seconds.
console.log(new Date())
setInterval(function() {
	console.log(new Date())
}, 60 * 1000)

if (!fs.existsSync(serverDataDirectory)) {fs.mkdirSync(serverDataDirectory, {recursive: true})}

let serverLogFile = path.join(serverDataDirectory, "server.log")
try {
	if (fs.existsSync(serverLogFile)) {
		console.log("Moving Server Log File")
		fs.renameSync(serverLogFile, path.join(serverDataDirectory, `server-${Date.now()}.log`))
	}
}
catch (e) {
	console.error(e)
}


async function cleanUpLogFiles() {
	//Delete all log files over 7 days old.
	let maxAge = 1000 * 60 * 60 * 24 * 7
	//TODO: Should we compress old files at some point, etc? Storing them might be useful in some way,
	//and we might want to generate statistics for them before deleting them (would need to update data policy)

	let files = await fs.promises.readdir(serverDataDirectory)
	for (let i=0;i<files.length;i++) {
		let file = path.join(serverDataDirectory, files[i])
		let stats = await fs.promises.stat(file)
		if (Date.now() - stats.mtime > maxAge) {
			await fs.promises.unlink(file)
		}
	}
}
try {
	cleanUpLogFiles()
	setInterval(cleanUpLogFiles, 1000 * 60 * 60 * 24) //Run daily
}
catch (e) {
	console.error(e)
}


const saveFileManager = require("./server/saveFileManager.js")
function updateAvailableSaveFiles() {
	saveFileManager.syncSaveFiles().then(() => {
		fs.writeFileSync(path.join(__dirname, "guaranteedHands.json"), JSON.stringify(saveFileManager.findSaveFiles()))
	})
}
try {
	updateAvailableSaveFiles()
	setInterval(updateAvailableSaveFiles, 1000 * 60 * 60 * 24) //Run every 24 hours
}
catch (e) {
	console.error(e)
}

if (process.argv.includes("--avoidFSWrites")) {globalThis.avoidFSWrites = true}

if (process.argv.includes("--runBotClientAutoPlay")) {globalThis.runBotClientAutoPlay = true}

if (process.argv.includes("--simulatedGamesToRun")) {
	//TODO: This setting should be TOTALLY seperate from here.
	globalThis.simulatedGamesToRun = Number(process.argv[process.argv.indexOf("--simulatedGamesToRun") + 1])
}


const websocketServer = new WebSocket.Server({
	server: httpserver,
	//TODO: How to test if permesssage-deflate is actually working? Not seeing it in consoles.
	//Also, our current messages are insanely large, as we send all state, not just changes (meaning ~6KB, not ~200 bytes per message). Compression should get this down to
	//a few hundred bytes though, especially if window is carried over between messages.
	perMessageDeflate: {
	  threshold: 150, // Size (in bytes) below which messages should not be compressed.
	  memLevel: 9,
		level: 9,
		serverMaxWindowBits: 15,
	}
});

const StateManager = require("./server/StateManager.js")

globalThis.serverStateManager = new StateManager()
globalThis.serverStateManager.serverDataDirectory = serverDataDirectory

function saveServerState(filePath) {
	let outputPath = path.join(serverDataDirectory, filePath + ".server.json")
	fs.writeFileSync(outputPath, globalThis.serverStateManager.toJSON())
	return "State saved to " + outputPath
}
globalThis.saveServerState = saveServerState

if (process.argv.includes("--loadState")) {
	let filePath = process.argv[process.argv.indexOf("--loadState") + 1]
	if (filePath) {
		let inputPath = path.join(serverDataDirectory, filePath) + ".server.json"
		console.log("Loading state from " + inputPath)
		globalThis.serverStateManager.loadState(fs.readFileSync(inputPath)).startRooms()
	}
}

const onConnection = require("./server/server.js")
websocketServer.on('connection', onConnection);


process.stdin.on("data", function(data) {
	let command = data.toString()
	if (command.startsWith("save ")) {
		let filePath = command.trim().slice(5)
		console.log(saveServerState(filePath))
	}
})
