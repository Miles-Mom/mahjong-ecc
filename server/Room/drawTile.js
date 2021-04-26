const Tile = require("../../src/Tile.js")

function drawTile(clientId, doNotMessage = false) {
	let tile;
	let pretty = -1
	while (!(tile instanceof Tile)) {
		pretty++
		tile = this.gameData.wall.drawFirst()
		if (!tile) {
			console.log("Wall Empty");

			this.messageAll([], "displayMessage", {title: "Game Over - Wall Empty", body: this.getSummary()}, "success")

			this.setInstructions([this.hostClientId], "The Wall is empty. \nPress End Game to return everybody to the room screen. ")
			this.setInstructions(this.hostClientId,  "The Wall is empty. \nPress End Game to return everybody to the room screen. Press New Game to play again with the same settings. ")

			this.gameData.wall.isEmpty = true
			this.sendStateToClients() //Game over. Wall empty.
			return
		}
		this.gameData.playerHands[clientId].add(tile)
	}
	let client = globalThis.serverStateManager.getClient(clientId)
	if (!doNotMessage) {
		this.lastDrawn = tile
		this.setInstructions(client.clientId, "You drew " + ((pretty > 0?(pretty === 1)?"a pretty and a ":pretty + " prettys and a ":"a ")+ tile.getTileName(this.state.settings.gameStyle)) + ". To discard, select a tile and press proceed. To kong, select 4 matching tiles and press Proceed. If you are Mahjong, press Mahjong. ")
		if (pretty > 0) {
			this.messageAll([clientId], "roomActionGameplayAlert", client.getNickname() + " drew " + ((pretty === 1)?"a pretty!":pretty + " prettys!"), {clientId, speech: "I'm pretty!"})
		}
	}
	else if (pretty > 0) {
		//If doNotMessage is passed, this is beginning of game setup. We won't send anything other than "You drew a pretty" to avoid having multiple overlapping pieces of text.
		client.message("roomActionGameplayAlert", "You drew a pretty!", "success")
	}
}

module.exports = drawTile
