function getSummary(mahjongClientId, options = {}) {

	//TODO: Reverting with history deletes this - might want to store in state.
	//TODO: Ignore bot Mahjong also causes problems with this - we need to score the initial bot Mahjong only.
	//TODO: How to handle American vs Chinese scores if switching in game.
	if (!this.gameScores) {
		this.gameScores = []
	}

	let summary = []

	let res = {}

	for (let id in this.gameData.playerHands) {
		let hand = this.gameData.playerHands[id]

		res[id] = {netpoints: 0, points: 0}

		res[id].text = globalThis.serverStateManager.getClient(id).getNickname() + ": " + hand.wind

		if (this.state.settings.gameStyle === "chinese") {
			if (hand.wind === "east") {res[id].text += " (net doubled)"}
			if (id === mahjongClientId) {
				res[id].points += hand.score({isMahjong: true, drewOwnTile: !this.gameData.previousTurnPickedUp})
			}
			else {
				res[id].points += hand.score()
			}
			res[id].text += `, ${res[id].points} points`

			//Apply limits.
			let limit = this?.state?.settings?.tableLimit
			if (res[id].points > limit) {
				res[id].points = limit
				res[id].text += ` (limit ${limit})`
			}
		}
		else if (this.state.settings.gameStyle === "american") {
			if (id === mahjongClientId) {
				let score = hand.score({type: "american", card: this.gameData.card})

				res[id].points += score.score
				res[id].text += ` - ${score.handName}, ${res[id].points} points`
				res[id].text += score.noJokers?" - No Jokers (Double)":""
			}
		}

		if (id === mahjongClientId) {
			res[id].text += " - Mahjong"

			if (!this.gameData.previousTurnPickedUp) {
				res[id].text += " - Drew Own Tile"
				if (this.state.settings.gameStyle === "american") {
					res[id].text += " (double)"
					res[id].points *= 2 //Drawing own tile is a double.
				}
			}
			else {
				res[id].text += " - With " + this.gameData.previousTurnPickedUp.getTileName(this.state.settings.gameStyle)
			}
		}
	}


	for (let id in this.gameData.playerHands) {
		if (this.state.settings.gameStyle === "chinese") {
			if (id === this.gameData.previousTurnThrower) {
				res[id].text += " - Threw Last Tile"
			}

			//We can simply iterate twice - we pay them, then they pay us.
			for (let opponentId in this.gameData.playerHands) {
				let playerMultiplier = 1

				//Everything with East is doubled.
				if (this.gameData.playerHands[id].wind === "east" || this.gameData.playerHands[opponentId].wind === "east") {
					playerMultiplier *= 2
				}

				//We only pay if we are not Mahjong
				if (id !== mahjongClientId) {
					res[id].netpoints -= res[opponentId].points * playerMultiplier
					res[opponentId].netpoints += res[opponentId].points * playerMultiplier
				}
			}
		}
		else if (this.state.settings.gameStyle === "american" && mahjongClientId) {
			let playerMultiplier = 1

			if (id === this.gameData.previousTurnThrower) {
				res[id].text += " - Threw Last Tile (Pay Double)"
				playerMultiplier *= 2
			}

			//Pay mahjong player (already checked that one exists) their points.
			res[id].netpoints -= res[mahjongClientId].points * playerMultiplier
			res[mahjongClientId].netpoints += res[mahjongClientId].points * playerMultiplier
		}
		if (id !== mahjongClientId) {
			summary.push(res[id])
		}
		else {
			summary.splice(0, 0, res[id]) //Insert at end.
		}
	}

	this.gameScores.push(res)

	function getScoreForClientId(clientId) {
		let score = 0
		for (let i=0;i<this.gameScores.length;i++) {
			let info = this.gameScores[i]
			if (info[clientId]) {
				score += info[clientId].netpoints
			}
		}
		return score
	}

	for (let id in this.gameData.playerHands) {
		res[id].text += ` (Net ${(res[id].netpoints > 0?"+":"")}${res[id].netpoints} points`
		if (this.gameScores.length > 1) {
			let clientScore = getScoreForClientId.call(this, id)
			res[id].text += `, ${(clientScore > 0?"+":"")}${clientScore} room total)`
		}
		else {
			res[id].text += ")"
		}
	}

	this.lastSummary = summary.map((item) => {return item.text}).join("\n")
	return this.lastSummary;
}

module.exports = getSummary
