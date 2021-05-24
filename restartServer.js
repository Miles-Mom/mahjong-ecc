const WebSocket = require("ws")
const child_process = require("child_process")

let port = "7591" //Websockets port.

let restartCounter = 0;
let restartAbove = 5 //If restartCounter exceeds restartAbove, reboot.

function checkForRestart() {
	if (restartCounter !== 0) {
		console.log("Restart Counter at " + restartCounter)
	}

	let lastRebooted;
	try {
		lastRebooted = new Date(child_process.execSync("uptime -s").toString())
	}
	catch (e) {
		restartAbove = 20 //If there are errors detecting last reboot, we need to give a lot more time. We don't want a reboot loop.
		console.error("Can't detect last reboot time. ")
		console.error(e)
	}
	//If we rebooted within the last 90 minutes, do nothing.
	if (Date.now() - lastRebooted < 90 * 60 * 1000) {
		console.log(`Rebooted Recently (${lastRebooted}, is ${new Date()}), Skipping`)
	}
	else if (restartCounter > restartAbove) {
		//Right now, reboot. OS issues are quite likely, as failures tend to be every few weeks at most.
		console.log(`Rebooting At ${new Date()}`)
		child_process.execSync("sudo reboot")
	}
}

//Try every 20 seconds.
let interval = setInterval(function() {
	//There may be ways for this to not open or error -
	//Therefore, we'll increment by 1 attempting to open, and once again on error.
	checkForRestart()
	restartCounter++

	let socket = new WebSocket("http://127.0.0.1:" + port)
	socket.addEventListener("open", function() {
		if (restartCounter !== 0) {
			console.log("Resetting Restart Counter")
		}
		restartCounter = 0 //It's working!
		socket.close() //Not sure if it's needed, but we don't want to risk triggering any server side memory leaks, etc.
	})
	socket.addEventListener("error", function(e) {
		console.log("Error. Increasing Restart Counter")
		console.error(e)
		restartCounter += 1
		checkForRestart()
	})
}, 1000 * 20)


let stopAfter = 1000 * 60 * 30 //This script is run every 30 minutes.
setTimeout(function() {
	clearInterval(interval)
}, stopAfter)
