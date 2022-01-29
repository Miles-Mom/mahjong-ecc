// Note on localization approach: 
// * we prepare summary for all locales needed for the room upon mahjong or game ending. 
// * caller needs to provide the specific locale to use the summary (this.lastSummary[per client.locale])

const {i18n} = require("../../src/i18nHelper.js")		

function getSummary(mahjongClientId, options = {}) {

	//TODO: Reverting with history deletes this - might want to store in state.
	//TODO: Ignore bot Mahjong also causes problems with this - we need to score the initial bot Mahjong only.
	//TODO: How to handle American vs Chinese scores if switching in game.
	if (!this.gameScores) {
		this.gameScores = []
	}

	// gather all the locales among all the players. 
	let locales = []
	for (let id in this.gameData.playerHands) {
		let client = globalThis.serverStateManager.getClient(id)
		if (!client.isBot) {
			if (!locales.includes(client.locale)) {
				locales.push(client.locale)
			}
		}
	}
	
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

	this.lastSummary = []
	let summary = []

	// go through for each locale
	for (var locale of locales) {

		let res = {}

		for (let id in this.gameData.playerHands) {
			let hand = this.gameData.playerHands[id]

			res[id] = {netpoints: 0, points: 0}

			let casedWind = hand.wind.slice(0, 1).toUpperCase() + hand.wind.slice(1)
			res[id].text = globalThis.serverStateManager.getClient(id).getNickname() + ": " + i18n.__({phrase:casedWind, locale:locale})

			if (this.state.settings.gameStyle === "chinese") {
				if (hand.wind === "east") {
						res[id].text += i18n.__({phrase:" (net doubled)", locale:locale})
				}

				res[id].points += hand.score().score
				res[id].text += i18n.__({phrase:", %s points", locale:locale}, res[id].points)

				//Apply limits.
				let limit = this?.state?.settings?.tableLimit
				if (res[id].points > limit) {
					res[id].points = limit
					// WAS: res[id].text += ` (limit ${limit})`
					res[id].text += i18n.__({phrase:" (limit %s)", locale:locale}, limit)
				}
			}
			else if (this.state.settings.gameStyle === "american") {
				if (id === mahjongClientId) {
					let score = hand.score({type: "american", card: this.gameData.card})

					res[id].points += score.score
					res[id].text += ` - ${score.handName}, ${res[id].points} points`
					res[id].text += score.noJokers?" - No Jokers (Double)":""
					// localization: left untouched. but eventually we could.
				}
			}

			if (id === mahjongClientId) {
				if (!this.gameData.previousTurnPickedUp) {
					res[id].text += i18n.__({phrase:" - Mahjong - Drew Own Tile", locale:locale})
					if (this.state.settings.gameStyle === "american") {
						res[id].text += " (double)"
						res[id].points *= 2 //Drawing own tile is a double.
					}
				}
				else {
					res[id].text += i18n.__({phrase: " - Mahjong - With %s", locale:locale}, this.gameData.previousTurnPickedUp.getTileName(this.state.settings.gameStyle, locale))
				}
			}
		}

		for (let id in this.gameData.playerHands) {
			if (this.state.settings.gameStyle === "chinese") {
				if (id === this.gameData.previousTurnThrower) {
					res[id].text += i18n.__({phrase:" - Threw Last Tile", locale:locale})
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
					res[id].text += i18n.__({phrase:" - Threw Last Tile (Pay Double)", locale:locale})
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

		// push only once regardless of locale, same room score
		if (this.gameScores.length < 1) {
			this.gameScores.push(res)
		}
		
		// function getScoreForClientId() was here
		// note: npm i18n seems to have bugs with namedValues vs args. Sometimes it 
		// does not support cases like vsprintf("%(id)d - %(name)s", {id: 824, name: 'Hello World'})
		// so we use either %s plain, or {{name}} syntax. 
		for (let id in this.gameData.playerHands) {
			// WAS: res[id].text += ` (Net ${(res[id].netpoints > 0?"+":"")}${res[id].netpoints} points`
			let point = `${(res[id].netpoints > 0?"+":"")}${res[id].netpoints}`
			res[id].text += i18n.__({phrase:" (Net %s points", locale:locale}, point)
			if (this.gameScores.length > 1) {
				let clientScore = getScoreForClientId.call(this, id)
				point =  `${(clientScore > 0?"+":"")}${clientScore}`
				// WAS: res[id].text += `, ${(clientScore > 0?"+":"")}${clientScore} room total)`
				res[id].text += i18n.__({phrase:"%s room total)", locale:locale}, point)
			}
			else {
				res[id].text += ")"
			}
		}

		this.lastSummary[locale] = summary.map((item) => {return item.text}).join("\n")
	}
	
	// note we are not returning any summary. need a locale. 
	// return this.lastSummary['en']
}



module.exports = getSummary
