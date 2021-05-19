const Hand = require("../../src/Hand.js")

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

	this.messageAll([clientId], "roomActionGameplayAlert", client.getNickname() + " has gone mahjong" , {clientId, speech: "Mahjong"})

	this.setAllInstructions([this.hostClientId], client.getNickname() + " has gone mahjong!\nPress End Game to return everybody to the room screen. ")
	this.setInstructions(this.hostClientId, client.getNickname() + " has gone mahjong!\nPress End Game to return everybody to the room screen. ")

	this.messageAll([], "displayMessage", {title: "Mahjong!", body: this.getSummary(clientId, options)}, "success")
	setTimeout((function() {
		//Offset this call for bots (which are synchronus) to avoid infinite recursion if their Mahjong is ignored.
		this.sendStateToClients()
	}).bind(this), 0)
}

module.exports = goMahjong
