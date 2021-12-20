const {allTiles, nonJokerTiles, createTiles, allSuits, allSuitArrangements, oddOptions, evenOptions, allOptions, windOptions, windArrangments, dragonOptions, dragonArrangments, suitDragonConversion, outputExpander, getTileDifferential}
= require("../utilities.js");


//Each function will return an array. Each array will contain every possible matching combo in the form of an array of tiles.
module.exports = [
	function(tiles = []) {
		allSuitArrangements.forEach((suitOrder) => {
			let newArr = []
			tiles.push(newArr)

			//A
			newArr.push(createTiles({type: "any", value: "any", amount: 1}))

			//111
			newArr.push(createTiles({type: suitOrder[0], value: 1, amount: 3}))

			//333
			newArr.push(createTiles({type: suitOrder[1], value: 3, amount: 3}))

			//579
			newArr.push(createTiles({type: suitOrder[2], value: 5, amount: 1}))
			newArr.push(createTiles({type: suitOrder[2], value: 7, amount: 1}))
			newArr.push(createTiles({type: suitOrder[2], value: 9, amount: 1}))

			//KKKK
			newArr.push(createTiles({type: "any", value: "any", amount: 4}))
		})

		allSuits.forEach((suit) => {
			let newArr = []
			tiles.push(newArr)

			//A
			newArr.push(createTiles({type: "any", value: "any", amount: 1}))

			//111
			newArr.push(createTiles({type: suit, value: 1, amount: 3}))

			//333
			newArr.push(createTiles({type: suit, value: 3, amount: 3}))

			//579
			newArr.push(createTiles({type: suit, value: 5, amount: 1}))
			newArr.push(createTiles({type: suit, value: 7, amount: 1}))
			newArr.push(createTiles({type: suit, value: 9, amount: 1}))

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
		allSuits.forEach((suit) => {
			windOptions.forEach((wind) => {
				oddOptions.slice(0, -2).forEach((num) => {
					let newArr = []
					tiles.push(newArr)

					//AA
					newArr.push(createTiles({type: "any", value: "any", amount: 2}))

					//EEE
					newArr.push(createTiles({type: "wind", value: wind, amount: 3}))

					//333
					newArr.push(createTiles({type: suit, value: num + 0, amount: 3}))

					//555
					newArr.push(createTiles({type: suit, value: num + 2, amount: 3}))

					//777
					newArr.push(createTiles({type: suit, value: num + 4, amount: 3}))
				})
			})
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

			//AA
			newArr.push(createTiles({type: "any", value: "any", amount: 2}))

			//333
			newArr.push(createTiles({type: suitOrder[0], value: 3, amount: 3}))

			//555
			newArr.push(createTiles({type: suitOrder[1], value: 5, amount: 3}))

			//79 79 79
			allSuits.forEach((suit, i) => {
				newArr.push(createTiles({type: suit, value: 7, amount: 1}))
				newArr.push(createTiles({type: suit, value: 9, amount: 1}))
			});
		})

		return {
			tiles,
			score: 30,
			concealed: false,
		}
	},
	function(tiles = []) {
		oddOptions.forEach((num) => {
			allSuits.forEach((suitFor1) => {
				allSuitArrangements.forEach((suitOrder) => {
					let newArr = []
					tiles.push(newArr)

					//PPP
					newArr.push(createTiles({type: "any", value: "any", amount: 3}))

					//I
					newArr.push(createTiles({type: suitFor1, value: 1, amount: 1}))

					//C
					newArr.push(createTiles({type: "character", value: "any", amount: 1}))

					//KKKK
					newArr.push(createTiles({type: "any", value: "any", amount: 4}))

					//88
					newArr.push(createTiles({type: suitOrder[0], value: num, amount: 2}))

					//8
					newArr.push(createTiles({type: suitOrder[1], value: num, amount: 1}))

					//88
					newArr.push(createTiles({type: suitOrder[2], value: num, amount: 2}))
				})
			})
		})

		return {
			tiles,
			score: 30,
			concealed: false,
		}
	},
].map((func, index) => {
	let output = func()
	output.cardIndex = index
	output.section = "Circus Oddity"
	return output
})
