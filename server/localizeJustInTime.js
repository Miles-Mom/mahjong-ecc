// to be used in Client, late binded, for tile/summary just-in-time translations

const Tile = require("../src/Tile.js")	

function localizeTileName(tileJson) {
  let tile = Tile.fromJSON(tileJson)
  
  let tileName = tile.getTileName(this.getRoom().state.settings.gameStyle, this.locale)
  return tileName
}

function localizeSummary() {
  let summary = this.getRoom().lastSummary[this.locale]
  return summary
}

module.exports = {localizeTileName, localizeSummary};