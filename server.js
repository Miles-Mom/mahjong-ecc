const fs = require("fs")
const path = require("path")
const http = require("http")
const WebSocket = require('ws');
const crypto = require('crypto'); //For admin auth.

const hostname = "0.0.0.0"
const httpport = 7591

const serverDataDirectory = path.join(__dirname, "server", "data")
if (!fs.existsSync(serverDataDirectory)) {fs.mkdirSync(serverDataDirectory, {recursive: true})}

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

function saveServerState(filePath) {
	let outputPath = path.join(serverDataDirectory, filePath + ".server.json")
	fs.writeFileSync(outputPath, stateManager.toJSON())
	return "State saved to " + outputPath
}

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
