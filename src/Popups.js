class Notification {
	constructor(errorText, messageText) {
		let cover = document.createElement("div")
		cover.id = "errorPopupCover"
		cover.style.display = "none"
		document.body.appendChild(cover)

		let popup = document.createElement("div")
		popup.id = "errorPopup"
		cover.appendChild(popup)

		let error = document.createElement("p")
		error.innerHTML = errorText
		error.id = "errorText"
		popup.appendChild(error)

		if (typeof messageText === "string") {
			let message = document.createElement("p")
			message.innerHTML = messageText.split("\n").join("<br>")
			message.id = "messageText"
			popup.appendChild(message)
		}
		else {
			popup.appendChild(messageText) //Allow appending divs to this.
			messageText.id = "messageText"
		}

		let dismissButton = document.createElement("button")
		dismissButton.id = "dismissButton"
		dismissButton.innerHTML = "Dismiss"
		popup.appendChild(dismissButton)

		let dismiss = (function dismiss(ev) {
			if (this.ondismissed) {this.ondismissed()}
			cover.remove()
		}).bind(this)

		//Prevent people from accidentally closing the message before they can read it.
		setTimeout(function() {
			dismissButton.addEventListener("click", dismiss)
			cover.addEventListener("click", function(event) {
				if (event.target === cover) {dismiss()}
			})
		}, 500)

		this.show = function() {
			cover.style.display = ""
			return popup
		}
		this.dismiss = dismiss
	}
}

let previousMessagePromise = new Promise((resolve) =>{resolve()});

let counters = {
	messages: 0,
	optionalMessages: 0
}

class BlocklessAlert {
	constructor(messageText, duration = 3200, config = {}) {
		let cover = document.createElement("div")
		cover.classList.add("blocklessAlertCover")
		cover.style.display = "none"
		document.body.appendChild(cover)

		let message = document.createElement("p")
		message.innerHTML = messageText
		cover.appendChild(message)

		let onStart = previousMessagePromise
		previousMessagePromise = new Promise((resolve) => {
			counters.messages++
			counters.optionalMessages += !!config.optional

			function undoCounters(optionalTriggered = false) {
				counters.messages--
				counters.optionalMessages -= !!config.optional - optionalTriggered
			}

			previousMessagePromise.then(() => {
				const triggerLevel = 2 //More than 2, so 3 optional messages waiting. Once this threshold is exceeded once,
				//we don't display more optional messages.
				if (counters.optionalMessages > triggerLevel && config.optional) {
					//Skip
					console.log("Skipping optional message due to time. ")
					undoCounters(true)
					return resolve()
				}

				console.log(`${counters.messages} messages remaining to be posted (${counters.optionalMessages} optional)`)
				//Speed up alerts to eat through queue - if maxCounter exceeds triggerLevel, message volume is reduced, so we stop factoring in maxCounter
				let newDuration = duration / Math.min(2.5, (Math.max(1, counters ** 0.7) || 1)) //2.5x speedup max.
				console.log(`Adjusting duration from ${duration} to ${newDuration}`)
				duration = newDuration
				cover.style.animation = "fadeInAndOut " + duration + "ms ease-in"
				cover.style.display = ""
				setTimeout(function() {
					cover.remove()
					undoCounters()
					resolve()
				}, duration)
			})
		})

		let onEnd = previousMessagePromise
		return {
			onStart,
			onEnd
		}
	}
}


let openMessageBars; //Currently only allow one to be open at once. We should probably adjust to use increasing z-indexes, so multiple can overlap on different timelines.

class MessageBar {
	constructor(text) {
		let bar = document.createElement("div")
		this.elem = bar
		bar.id = "notificationBar"

		//Allow passing elements or text.
		let elem = text
		if (typeof elem === "string") {
			elem = document.createElement("p")
			elem.innerHTML = text
		}
		bar.appendChild(elem)

		this.show = function(duration) {
			if (openMessageBars) {openMessageBars.dismiss()}
			document.body.appendChild(bar)
			openMessageBars = this
			setTimeout(function() {
				bar.remove()
			}, duration)
		}

		this.dismiss = function() {
			bar.remove()
			openMessageBars = undefined
		}
	}
}

module.exports = {
	Notification,
	MessageBar,
	BlocklessAlert
}
