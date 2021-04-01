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
		}
		this.dismiss = dismiss
	}
}

let previousMessagePromise = new Promise((resolve) =>{resolve()});
let counter = 0
let maxCounter = 0 //We want to adjust to the average load somewhat.

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
			counter++
			maxCounter = Math.max(counter, maxCounter)
			previousMessagePromise.then(() => {
				const triggerLevel = 6
				if (maxCounter > triggerLevel && config.optional) {
					//Skip
					console.log("Skipping optional message due to time. ")
					counter--
					return resolve()
				}

				console.log(counter + " messages remaining to be posted. ")
				//Speed up alerts to eat through queue - if maxCounter exceeds triggerLevel, message volume is reduced, so we stop factoring in maxCounter
				let newDuration = duration / Math.min(2.5, (Math.max(1, ((counter + ((maxCounter > triggerLevel)?counter:maxCounter)) / 2) ** 0.7) || 1)) //2.5x speedup max.
				console.log(`Adjusting duration from ${duration} to ${newDuration}`)
				duration = newDuration
				cover.style.animation = "fadeInAndOut " + duration + "ms ease-in"
				cover.style.display = ""
				setTimeout(function() {
					cover.remove()
					counter--
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


class MessageBar {
	constructor(text) {
		let bar = document.createElement("div")
		bar.id = "notificationBar"

		let textHolder = document.createElement("p")
		textHolder.innerHTML = text
		bar.appendChild(textHolder)

		this.show = function(duration) {
			document.body.appendChild(bar)
			setTimeout(function() {
				bar.remove()
			}, duration)
		}
	}
}

module.exports = {
	Notification,
	MessageBar,
	BlocklessAlert
}
