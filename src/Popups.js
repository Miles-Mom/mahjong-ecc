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



let messageQueue = []

//We will extend alerts to about 6 seconds, but early if a new alert comes in.
//Optional alerts will be terminated instantly. Non-optional alerts will merely be shortened.
class BlocklessAlert {
	constructor(messageText, config = {}) {
		let cover = document.createElement("div")
		cover.classList.add("blocklessAlertCover")
		cover.style.display = "none"
		document.body.appendChild(cover)

		let message = document.createElement("p")
		message.innerHTML = messageText
		cover.appendChild(message)

		this.cover = cover

		this.optional = config.optional
		this.duration = config.duration
		this.shortened = false //Has the duration been shortened (halved?) as a result of new messages?
		this.dismissed = false //Has this been dismissed?
		cover.style.animation = "fadeInAndOut " + this.duration + "ms ease-in"

		this.onStart = config.onStart

		messageQueue.forEach((message) => {
			message.dismissIfOptional()
		})

		messageQueue.push(this)

		//Show this item if it is the first item in the queue.
		if (messageQueue[0] === this) {
			this.show()
		}
	}

	show() {
		this.cover.style.display = ""
		setTimeout(this.remove.bind(this), this.duration)
		this.startTime = Date.now()
		if (this.onStart) {this.onStart()}
	}

	remove(isOptionalDismissal = false) {
		//Remove element, and remove this from queue.
		let index = messageQueue.indexOf(this)
		if (index !== -1) {
			messageQueue.splice(index, 1)
		}
		this.cover.remove()
		if (!isOptionalDismissal && !this.dismissed) {
			this.dismissed = true
			messageQueue?.[0]?.show()
		}
	}

	dismissIfOptional() {
		if (!this.shortened) {
			//Shorten to half specified duration.
			this.shortened = true
			this.duration /= 2
		}

		if (this.startTime) {
			//If currently being shown, trigger another setTimeout backdating to shortened duration, or end right now.
			let dismissTimeFromNow = this.startTime + this.duration - Date.now()
			//If optional, dismiss right now as well.
			if (dismissTimeFromNow <= 0 || this.optional) {
				this.remove()
			}
			else {
				setTimeout(this.remove.bind(this), dismissTimeFromNow)
			}
		}
		else if (this.optional) {
			this.remove(true) //Pass true as this is a cancellation, not dismissal - the next item should not necessarily be called.
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
