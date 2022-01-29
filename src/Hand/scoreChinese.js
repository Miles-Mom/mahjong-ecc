const Match = require("../Match.js")
const Tile = require("../Tile.js")
const Pretty = require("../Pretty.js")
const TileContainer = require("../TileContainer.js")
const {i18n} = require("../i18nHelper")		
const doubleHarness = require("../../server/american/marvelous2021/double-harness.js")

function scoreChinese() {
	//Reads hand.status (bound, so this.status) to determine if Mahjong (could do w/ tile count and tiles), and drewOwnTile
	let oldContents = this.contents.slice(0) //Copy the old hand contents to reset back.

	//Calculate clear hand data before the hand contents are modified.
	let clearHandInfo = this.getClearHandInfo()
	
	let hasSequence = false

	let flowersItem = {
		match: new TileContainer({tiles: []}),
		doubles: 0,
		points: 0,
	}
	let seasonsItem = {
		match: new TileContainer({tiles: []}),
		doubles: 0,
		points: 0,
	}

	let otherItems = [flowersItem, seasonsItem]
	let matchItems = [];

	contentsLoop:
	for (let i=0;i<this.contents.length;i++) {
		let match = this.contents[i]

		//If we have empty tiles laying around, let's try and create the largest matches possible, as we clearly aren't mahjong.
		if (match instanceof Tile) {
			//Attempt to make matches - kong, then pong, then pair.
			//j is amount of tiles in match.
			for (let j=4;j>=1;j--) {
				if (j === 1) {continue contentsLoop;} //Tile can't be matched

				if (this.removeMatchingTilesFromHand(match, j)) {
					i-- //Counteract position shifting.
					match = new Match({amount: j, type: match.type, value: match.value, exposed: false})
					break;
				}
			}
		}

		let matchDoubles = Number(match.isDouble(this.wind))
		let matchPoints = match.getPoints(this.wind)

		if (match instanceof Pretty) {
			//Add to existing flower or season item.
			//We collapse these to save space.
			let itemToAdd = (match.seasonOrFlower === "flower") ? flowersItem : seasonsItem
			itemToAdd.match.tiles.push(match)
			itemToAdd.doubles += matchDoubles
			itemToAdd.points += matchPoints

			if (itemToAdd.match.tiles.length === 4) {itemToAdd.doubles += 2} //All seasons or all flowers is 2 extra doubles (3 total)
			continue;
		}

		matchItems.push({
			match: match,
			doubles: matchDoubles,
			points: matchPoints,
			exposed: match.exposed
		})

		hasSequence = hasSequence || match.isSequence
	}

	//We'll sort matchItems by exposed/not exposed, then doubles, then points.
	function calcSortValue(item) {
		return (1e6 * Number(item.exposed)) + (1e3 * item.doubles) + (item.points)
	}

	matchItems.sort((a, b) => {return calcSortValue(b) - calcSortValue(a)})

	if (this.status?.status === "mahjong") {
		otherItems.push({
			text: i18n.__("Mahjong!"),
			doubles: 0,
			points: 20
		})

		if (this.status?.drewOwnTile) {
			otherItems.push({
				text: i18n.__("Self-Draw"),
				doubles: 0,
				points: 2
			})
		}
		if (!hasSequence) {
			otherItems.push({
				text: i18n.__("No Sequence"),
				doubles: 0,
				points: 10
			})
		}
	}

	otherItems.push({
		text: i18n.__(clearHandInfo.type),
		doubles: clearHandInfo.doubles,
		points: 0
	})

	//Filter out all items not worth doubles or points.
	matchItems = matchItems.filter((item) => {return (item.doubles + item.points)})
	otherItems = otherItems.filter((item) => {return (item.doubles + item.points)})

	let items = [...matchItems.concat(otherItems)]

	let points = items.reduce((total, item) => {return total + item.points}, 0)
	let doubles = items.reduce((total, item) => {return total + item.doubles}, 0)

	let score = points * (2**doubles)

	let scoreText = i18n.__(`%s points x 2<sup>%s double${doubles === 1 ? "":"s"}</sup> = %s points`, points, doubles, score)
	this.contents = oldContents //Reset any modifications

	return {matchItems, otherItems, items, points, doubles, score, scoreText}
}

module.exports = scoreChinese
