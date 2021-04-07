let evaluateNextMoveChinese = require("./chineseBot.js")
let evaluateNextMoveAmerican = require("./americanBot.js")

function handleMessage({type, message, status}) {
	if (type === "roomActionState") {
		//This should be the only type of message we need to listen to.

		if (this.getRoom()?.gameData?.isMahjong || this.getRoom()?.gameData?.wall?.isEmpty) {
			return //The room is mahjong, nothing we should do.
		}

		//So that we can restore if bot crashes weirdly. Only a problem if there are 3+ bots, as otherwise, the turn can't proceed before this executes.
		let turnState = this.getRoom()?.gameData?.currentTurn?.turnChoices?.[this.clientId]
		let handState = this.getRoom()?.gameData?.playerHands?.[this.clientId]

		try {
			if (this.getRoom()?.state?.settings?.gameStyle === "american") {
				evaluateNextMoveAmerican.call(this)
			}
			else {
				evaluateNextMoveChinese.call(this)
			}
		}
		catch (e) {
			if (turnState) {this.getRoom().gameData.currentTurn.turnChoices[this.clientId] = turnState}
			if (handState) {this.getRoom().gameData.playerHands[this.clientId] = handState}

			console.log("FATAL BOT ERROR: " + e)
			console.log(e.stack)

			this.getRoom().messageAll([this.clientId], "displayMessage", {title: "Bot Error", body: `${this.getNickname()} has encountered an error. You can manually control the bot <a target="_blank" href="#clientId=${this.clientId}">here</a>. `})
		}
	}

	//Don't error on the manually control bot message (I believe it triggers all other bots to error otherwise), or when we can't place because another player had a higher priority placement.
	//If the message is not a string (no message.includes), ignore.
	if (status === "error" && message.includes && !message.includes("higher priority placement")) {
		this.getRoom().messageAll([this.clientId], "displayMessage", {title: "Bot Error", body: `${this.getNickname()} has received an error message. If it is not functioning, you can manually control the bot <a target="_blank" href="#clientId=${this.clientId}">here</a>. `})
		console.error("Bot received an error message", message)
	}
}

module.exports = handleMessage
