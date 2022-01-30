const Tile = require("../../src/Tile.js")
const localizeSummary = require("../localizeJustInTime.js").localizeSummary

function drawTile(clientId, doNotMessage = false) {
	let tile;
	let pretty = -1
	while (!(tile instanceof Tile)) {
		pretty++
		tile = this.gameData.wall.drawFirst()
		if (!tile) {
			console.log("Wall Empty");

			this.getSummary()	
			this.messageAll([], "displayMessage", {title: "Game Over - Wall Empty", body: {format:"%(summary)s", args:{summary:"placeholder"}, argsOption:{summary:localizeSummary}}}, "success")

			this.setInstructions([this.hostClientId], {format:["The Wall is empty. ", "\n", "Press End Game to return everybody to the room screen. "]})
			this.setInstructions(this.hostClientId,  {format:["The Wall is empty. ", "\n", "Press End Game to return everybody to the room screen. ", "Press New Game to play again with the same settings. "]})

			this.gameData.wall.isEmpty = true
			this.sendStateToClients() //Game over. Wall empty.
			return
		}
		this.gameData.playerHands[clientId].add(tile)
	}
	let client = globalThis.serverStateManager.getClient(clientId)
	if (!doNotMessage) {
		this.lastDrawn = tile

		let drawMessage = "You drew " + (pretty > 0?(pretty === 1)?"a pretty and a ":"%(pretty)d prettys and a ":"a ") + "%(tile)s"
		// localized strings: 
		// You drew a %(tile)s
		// You drew a pretty and a %(tile)s
		// You drew %(pretty)d prettys and a %(tile)s

		// we have THE client known therefore localized tileName readily available
		let tileNameLocal = tile.getTileName(this.state.settings.gameStyle,  client.locale)
	
		this.setInstructions(client.clientId, {format:[drawMessage, ". ", "To discard, select a tile and press proceed. ", "To kong, select 4 matching tiles and press Proceed. ", "If you are Mahjong, press Mahjong. "], args:{pretty:pretty, tile:tileNameLocal}} )
		
		//TODO: Should do a blank message instead - simply clear the current message if no prettys?
		client.message("roomActionGameplayAlert", {format:drawMessage, args:{pretty:pretty, tile:tileNameLocal}}, {optional: pretty === 0})
	}
	else if (pretty > 0) {
		//If doNotMessage is passed, this is beginning of game setup. We won't send anything other than "You drew a pretty" to avoid having multiple overlapping pieces of text.
		client.message("roomActionGameplayAlert", "You drew a pretty!", "success")
	}
}

module.exports = drawTile
