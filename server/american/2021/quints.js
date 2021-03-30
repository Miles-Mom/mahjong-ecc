const {createTiles, allSuits, allSuitArrangements, oddOptions, evenOptions, allOptions, dragonOptions, dragonArrangments, windOptions, suitDragonConversion}
= require("../utilities.js");

//Each function will return an array. Each array will contain every possible matching combo in the form of an array of tiles.
module.exports = [
	function(tiles = []) {
		allSuits.forEach((suit) => {
			allOptions.forEach((offset) => {
				windOptions.forEach((wind) => {
					let newArr = []
					tiles.push(newArr)

					newArr.push(createTiles({type: "wind", value: wind, amount: 5}))
					newArr.push(createTiles({type: suit, value: offset, amount: 4}))
					newArr.push(createTiles({type: "flower", value: "4", amount: 5})) //Value is no-op here.
				})
			})
		})

		return {
			tiles,
			score: 40,
			concealed: false
		}
	},
	function(tiles = []) {
		allOptions.slice(0, -3).forEach((offset) => {
			allSuitArrangements.forEach((suitOrder) => {
				let newArr = []
				tiles.push(newArr)

				newArr.push(createTiles({type: suitOrder[0], value: offset, amount: 5}))
				newArr.push(createTiles({type: suitOrder[1], value: 1+offset, amount: 2}))
				newArr.push(createTiles({type: suitOrder[1], value: 2+offset, amount: 2}))
				newArr.push(createTiles({type: suitOrder[0], value: 3+offset, amount: 5}))
			})
		})

		return {
			tiles,
			score: 45,
			concealed: false
		}
	},
].map((func, index) => {
	let output = func()
	output.cardIndex = index
	output.section = "Quints"
	return output
})
