//TODO: Do something better than this......
const process = require("process")
process
  .on('unhandledRejection', (reason, p) => {
    console.error(reason, 'Unhandled Rejection at Promise', p);
  })

const fs = require("fs")
const path = require("path")
const http = require("http")

const os = require("os")
const zlib = require("zlib")

const compression = require('compression')
const express = require('express')
const serveIndex = require('serve-index') //Dev stuff - just viewing directories. Should probably be removed or replaced.

const WebSocket = require('ws');


let app = express()

//Compress all responses
app.use(compression({
	level: zlib.Z_BEST_COMPRESSION,
	filter: (req, res) => {
		let type = res.getHeader("Content-Type")
		if (
			type === "image/jpeg"
			|| type === "image/png"
		) {
			return false
		}
		else {
			return true
		}
	},
}))

//app.set('trust proxy', 1) // trust first proxy

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
app.use('*', (req, res, next) => {
	res.set("Access-Control-Allow-Origin", "*");

	let relativeSrc = req.originalUrl

	let extensions = ["", ".html", "index.html"]
	let src;
	let extension = extensions.find((ext) => {
		src = path.join(__dirname, relativeSrc + ext)
		if (fs.existsSync(src)) {
			return !fs.statSync(src).isDirectory()
		}
	})

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
app.use("*", (req, res, next) => {
	serveIndex(path.join(__dirname, req.originalUrl), {
		'icons': true,
		'view': "details" //Gives more info than tiles.
	})(req, res, next)
})

app.use("*", (req, res, next) => {
	res.status(404)
	res.type("text/plain")
	res.end("File Not Found")
})

const httpport = 8080
app.listen(httpport)






const findAllGuaranteed = require("./server/findAllGuaranteed.js")

const hostname = "0.0.0.0"
const httpport = 7591

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

try {
	fs.writeFileSync(path.join(__dirname, "guaranteedHands.json"), JSON.stringify(findAllGuaranteed()))
}
catch (e) {
	console.error(e)
}

if (process.argv.includes("--avoidFSWrites")) {globalThis.avoidFSWrites = true}

if (process.argv.includes("--runBotClientAutoPlay")) {globalThis.runBotClientAutoPlay = true}

if (process.argv.includes("--simulatedGamesToRun")) {
	globalThis.simulatedGamesToRun = Number(process.argv[process.argv.indexOf("--simulatedGamesToRun") + 1])
}




const httpserver = http.createServer();
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
		globalThis.serverStateManager.init(fs.readFileSync(inputPath))
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


try {
	httpserver.listen(httpport, hostname, () => {
	  console.log(`Server running at http://${hostname}:${httpport}/`);
	});
}
catch(e) {
	console.error(e)
}
