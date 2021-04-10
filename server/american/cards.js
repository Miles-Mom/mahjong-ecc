let cards = {
	"2020 National Mahjongg League": require("./2020.js"),
	"2021 National Mahjongg League": require("./2021.js"),
}

let cardNames = Object.keys(cards) //Bots will not pick Marvelous as a random card.

cards["2021 Marvelous Mahjongg"] =  require("./marvelous2021.js")


function getRandomCard() {
	return cards[cardNames[Math.floor(Math.random() * cardNames.length)]]
}

Object.defineProperty(cards, 'Other Card - Bots Use Random Card', {
	get: getRandomCard
});

module.exports = cards
