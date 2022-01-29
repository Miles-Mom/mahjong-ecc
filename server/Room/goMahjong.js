const Hand = require("../../src/Hand.js")
const localizeSummary = require("../localizeJustInTime.js").localizeSummary

//TODO: Mahjong validation code currently needs to be located in two places - once in turnChoicesProxyHandler to determine if a hand will BECOME mahjong, then again
//in here to determine if a hand IS mahjong. (so seperate paths calling for mahjong, vs in hand mahjong, due to need to verify all moves before advancing with turns)

//The code should be de-duplicated some. This is unnecessary.
function goMahjong(clientId, options = {}) {
	//options.override

	//First, verify the user can go mahjong.
	let client = globalThis.serverStateManager.getClient(clientId)
	let hand = this.gameData.playerHands[clientId]

	let ignoreMahjong = this.state.settings.ignoreBotMahjong && client.isBot

	if (this.state.settings.gameStyle === "chinese") {
		//On override, always allow unlimited (4) sequences, as if the overrides are purely sequence limits (forgot to change the setting,
		//the scoring will now be correct, not incorrect)
		let isMahjong = hand.isMahjong(options.override?4:this.state.settings.maximumSequences, {thrownTile: options.autoExpose && this.gameData.previousTurnPickedUp})
		if (isMahjong instanceof Hand && !ignoreMahjong) {
			hand.contents = isMahjong.contents //Autocomplete the mahjong.
		}
		if (!isMahjong && !options.override) {
			return client.message("roomActionPlaceTiles", "Unable to go mahjong with this hand. If you play by different rules, try again to override. ", "error")
		}
	}
	else if (this.state.settings.gameStyle === "american") {
		//TODO: Sort hands so they appear properly sorted (like they appear on the card)
		//See https://github.com/ecc521/mahjong/issues/25

		let score = hand.score({type: "american", card: this.gameData.card})

		if (score.score === 0 && !options.override && !this.state.settings.unknownCard) {
			return client.message("roomActionPlaceTiles", `Your hand does not appear to be Mahjong for the ${this.gameData.card.name} card. If you are Mahjong, click the Mahjong button again to override. Card selection can be changed by the host in Game Settings. `, "error")
		}
	}

	hand.status = {
		status: "mahjong",
		drewOwnTile: !this.gameData.previousTurnPickedUp
	}

	if (!ignoreMahjong) {
		//The game is over.
		this.gameData.currentTurn.userTurn = clientId
		this.gameData.isMahjong = true

		this.sendStateToClients()
		//If East wins, do not rotate.
		//We can't rotate until the game is actually ended, as otherwise that would break revert.
		//Therefore, we simply set a flag that is read is room.endGame.
		if (this.state.settings.windAssignments[clientId] === "east") {
			this.shouldRotateWinds = false
		}
	}

	this.messageAll([clientId], "roomActionGameplayAlert", {format: "%s went mahjong!", args:client.getNickname()}, {clientId, speech: "Mahjong"})

	this.setAllInstructions([this.hostClientId], {format: ["%s went mahjong!", "\n", "Press End Game to return everybody to the room screen. "], args:client.getNickname()})
	this.setInstructions(this.hostClientId, {format: ["%s went mahjong!", "\n", "Press End Game to return everybody to the room screen. "], args:client.getNickname()})

	this.getSummary(clientId, options)	

	this.messageAll([], "displayMessage", {title: "Mahjong!", body: {format:"%(summary)s", args:{summary:"placeholder"}, argsOption:{summary:localizeSummary}}}, "success")
	
	setTimeout((function() {
		//Offset this call for bots (which are synchronus) to avoid infinite recursion if their Mahjong is ignored.
		this.sendStateToClients()
	}).bind(this), 0)
}

module.exports = goMahjong
