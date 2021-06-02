const americanUtilities = require("../../server/american/utilities.js")
const Tile = require("../Tile.js")

//scoreAmerican does not consider Drew Own Tile as part of the score (so we don't take it),
//because being payed double for drawing your own tile is simply an extension of the mahjong tile thrower paying double.
function scoreAmerican(config) {
	if (!config.card) {throw "Must pass config.card"}

	let result = {
		noJokers: false,
		score: 0,
		handName: "Unable to Score"
	}

	let hands = americanUtilities.getTileDifferential(config.card, this.contents)

	//If there aren't any hands, or if the hand isn't Mahjong, we can't score.
	if (hands?.[0]?.diff !== 0) {
		return result
	}

	let hand = hands[0]
	let handOption = hand.handOption

	result.score = handOption.score
	result.handName = handOption.section + " #" + (handOption.cardIndex + 1)

	if (this.calculateJokerAmount(this.contents) === 0) {
		//Get the maximum jokers allowed by the specific hand we went mahjong with.
		let maxPossibleJokers = americanUtilities.getTileDifferential([handOption], [])[0].canFillJoker.length
		if (maxPossibleJokers > 0) {
			//Double for no jokers, except where jokers can't be used (like for Singles and Pairs)
			result.noJokers = true
			result.score *= 2
		}
	}

	return result
}

module.exports = scoreAmerican
