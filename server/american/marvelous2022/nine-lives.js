const {allTiles, nonJokerTiles, createTiles, allSuits, allSuitArrangements, oddOptions, evenOptions, allOptions, windOptions, windArrangments, dragonOptions, dragonArrangments, suitDragonConversion, outputExpander, getTileDifferential}
= require("../utilities.js");


//Each function will return an array. Each array will contain every possible matching combo in the form of an array of tiles.
//All 5 hands supported.
module.exports = [
	function(tiles = []) {
		allSuitArrangements.forEach((suitOrder) => {
			let newArr = []
			tiles.push(newArr)

			//369
			newArr.push(createTiles({type: suitOrder[0], value: 3, amount: 1}))
			newArr.push(createTiles({type: suitOrder[0], value: 6, amount: 1}))
			newArr.push(createTiles({type: suitOrder[0], value: 9, amount: 1}))

			//333 6 999
			newArr.push(createTiles({type: suitOrder[1], value: 3, amount: 3}))
			newArr.push(createTiles({type: suitOrder[1], value: 6, amount: 1}))
			newArr.push(createTiles({type: suitOrder[1], value: 9, amount: 3}))

			//KKKK
			newArr.push(createTiles({type: "any", value: "any", amount: 4}))
		})

		return {
			tiles,
			score: 25,
			concealed: false,
		}
	},
	function(tiles = []) {
		allSuitArrangements.forEach((suitOrder) => {
			let newArr = []
			tiles.push(newArr)

			//FFF AA 3 66 999 WWW
			newArr.push(createTiles({type: "flower", amount: 3}))
			newArr.push(createTiles({type: "any", value: "any", amount: 2}))

			newArr.push(createTiles({type: suitOrder[0], value: 3, amount: 1}))
			newArr.push(createTiles({type: suitOrder[1], value: 6, amount: 2}))
			newArr.push(createTiles({type: suitOrder[2], value: 9, amount: 3}))

			newArr.push(createTiles({type: "wind", value: "any", amount: 3}))
		})

		allSuits.forEach((suit) => {
			let newArr = []
			tiles.push(newArr)

			//FFF AA 3 66 999 WWW
			newArr.push(createTiles({type: "flower", amount: 3}))
			newArr.push(createTiles({type: "any", value: "any", amount: 2}))

			newArr.push(createTiles({type: suit, value: 3, amount: 1}))
			newArr.push(createTiles({type: suit, value: 6, amount: 2}))
			newArr.push(createTiles({type: suit, value: 9, amount: 3}))

			newArr.push(createTiles({type: "wind", value: "any", amount: 3}))
		})

		return {
			tiles,
			score: 25,
			concealed: false,
		}
	},
	function(tiles = []) {
		allSuitArrangements.forEach((suitOrder) => {
			let newArr = []
			tiles.push(newArr)

			//3 666 999
			newArr.push(createTiles({type: suitOrder[0], value: 3, amount: 1}))
			newArr.push(createTiles({type: suitOrder[0], value: 6, amount: 3}))
			newArr.push(createTiles({type: suitOrder[0], value: 9, amount: 3}))

			//PPP
			newArr.push(createTiles({type: "any", value: "any", amount: 3}))

			//3669
			newArr.push(createTiles({type: suitOrder[1], value: 3, amount: 1}))
			newArr.push(createTiles({type: suitOrder[1], value: 6, amount: 2}))
			newArr.push(createTiles({type: suitOrder[1], value: 9, amount: 1}))
		})

		return {
			tiles,
			score: 25,
			concealed: false,
		}
	},
	function(tiles = []) {
		allSuitArrangements.forEach((suitOrder) => {
			let newArr = []
			tiles.push(newArr)

			//MJ
			newArr.push(createTiles({type: "wind", value: "west", amount: 1}))
			newArr.push(createTiles({type: "joker", amount: 1}))

			//333
			newArr.push(createTiles({type: suitOrder[0], value: 3, amount: 3}))

			//666
			newArr.push(createTiles({type: suitOrder[1], value: 6, amount: 3}))

			//333
			newArr.push(createTiles({type: suitOrder[2], value: 3, amount: 3}))

			//999
			newArr.push(createTiles({type: suitOrder[1], value: 9, amount: 3}))
		})

		return {
			tiles,
			score: 35,
			concealed: false,
		}
	},
	function(tiles = []) {
		allSuits.forEach((suitFor1, i) => {
			allSuitArrangements.forEach((suitOrder) => {
				let newArr = []
				tiles.push(newArr)

				//SINBAD 33 666 999
				newArr.push(createTiles({type: "wind", value: "south", amount: 1}))
				newArr.push(createTiles({type: suitFor1, value: 1, amount: 1}))
				newArr.push(createTiles({type: "wind", value: "north", amount: 1}))
				newArr.push(createTiles({type: "bamboo", value: "any", amount: 1}))
				newArr.push(createTiles({type: "any", value: "any", amount: 1}))
				newArr.push(createTiles({type: "dragon", value: "any", amount: 1}))

				newArr.push(createTiles({type: suitOrder[0], value: 3, amount: 2}))
				newArr.push(createTiles({type: suitOrder[1], value: 6, amount: 3}))
				newArr.push(createTiles({type: suitOrder[2], value: 9, amount: 3}))
			})

			allSuits.forEach((suit) => {
				let newArr = []
				tiles.push(newArr)

				//SINBAD 33 666 999
				newArr.push(createTiles({type: "wind", value: "south", amount: 1}))
				newArr.push(createTiles({type: suitFor1, value: 1, amount: 1}))
				newArr.push(createTiles({type: "wind", value: "north", amount: 1}))
				newArr.push(createTiles({type: "bamboo", value: "any", amount: 1}))
				newArr.push(createTiles({type: "any", value: "any", amount: 1}))
				newArr.push(createTiles({type: "dragon", value: "any", amount: 1}))

				newArr.push(createTiles({type: suit, value: 3, amount: 2}))
				newArr.push(createTiles({type: suit, value: 6, amount: 3}))
				newArr.push(createTiles({type: suit, value: 9, amount: 3}))
			})
		});

		return {
			tiles,
			score: 35,
			concealed: false,
		}
	},
].map((func, index) => {
	let output = func()
	output.cardIndex = index
	output.section = "Nine Lives"
	return output
})
