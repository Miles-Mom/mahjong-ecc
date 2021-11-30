const Hand = require("../../src/Hand.js")

function getState(requestingClientId) {
	//Generate the game state visible to requestingClientId
	let state = {}
	state.inGame = this.inGame
	state.isHost = (requestingClientId === this.hostClientId);
	if (this.gameData.wall) {
		//Pass tiles if mahjong, else number of tiles.
		state.wallTiles = this.gameData.wall.tiles
		if (!this.gameData.isMahjong) {
			state.wallTiles = state.wallTiles.length
		}
	}

	state.isGameOver = 0
	if (this?.gameData?.isMahjong) {
		state.isGameOver = 1
	}
	else if (this?.gameData?.wall?.isEmpty) {
		state.isGameOver = 2
	}

	state.settings = this.state.settings

	state.instructions = this?.gameData?.instructions?.[requestingClientId] || ""
	state.discardPile = this.gameData.discardPile

	if (this.gameData.currentTurn) {
		state.currentTurn = {
			thrown: this.gameData.currentTurn.thrown,
			userTurn: this.gameData.currentTurn.userTurn,
			playersReady: Object.keys(this.gameData.currentTurn.turnChoices || {})
		}

		//Pass the last drawn tile to the person requesting.
		//Last drawn tile is cleared every throw to avoid leaking information and stop showing the tile as drawn.
		if (requestingClientId === this.gameData.currentTurn.userTurn) {
			state.currentTurn.lastDrawn = this.lastDrawn
		}


		if (this.gameData.charleston) {
			state.currentTurn.charleston = true
		}
	}

	state.clients = []
	this.clientIds.slice(0, state.inGame?4:Infinity).forEach((currentClientId) => {
		let currentClient = globalThis.serverStateManager.getClient(currentClientId)
		let visibleClientState = {
			id: currentClientId,
			nickname: currentClient.getNickname(),
			isHost: (currentClientId === this.hostClientId),
			isBot: currentClient.isBot
		}
		if (this.inGame) {
			let hand = this.gameData.playerHands[currentClientId]
			//If this is the user's hand, or if the hand is no longer active (game over, dead, etc), show all tiles.
			if (
				(requestingClientId === currentClientId)
				|| this.gameData.isMahjong
				|| this.gameData.wall.isEmpty
			) {
				visibleClientState.hand = hand
			}
			else {
				//Only show exposed tiles.
				let tempHand = new Hand()
				tempHand.contents = hand.getExposedTiles(true) //Pass true to include other tiles as face down.
				tempHand.wind = hand.wind
				visibleClientState.hand = tempHand
			}
		}
		state.clients.push(visibleClientState)
	})

	return state
}

module.exports = getState
