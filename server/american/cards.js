let cards = {
	"2020 National Mahjongg League": require("./2020.js"),
	"2021 National Mahjongg League": require("./2021.js"),
}

let cardNames = Object.keys(cards) //Bots will not pick Marvelous as a random card.

cards["2021 Marvelous Mahjongg"] =  require("./marvelous2021.js")
cards["2022 Marvelous Mahjongg"] =  require("./marvelous2022.js")


function getRandomCard() {
	return cards[cardNames[Math.floor(Math.random() * cardNames.length)]]
}

Object.defineProperty(cards, 'Random', {
	get: getRandomCard
});

module.exports = cards
