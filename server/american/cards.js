let cards = {
	"2020 National Mahjongg League": "./2020.js",
	"2021 National Mahjongg League": "./2021.js"
}

for (let cardName in cards) {
	cards[cardName] = require(cards[cardName])
}

let cardNames = Object.keys(cards)

function getRandomCard() {
	return cards[cardNames[Math.floor(Math.random() * cardNames.length)]]
}

Object.defineProperty(cards, 'Other Card - Bots Use Random Card', {
	get: getRandomCard
});

module.exports = cards
