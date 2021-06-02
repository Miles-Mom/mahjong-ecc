const {allTiles, nonJokerTiles, createTiles, allSuits, allSuitArrangements, oddOptions, evenOptions, allOptions, windOptions, windArrangments, dragonOptions, dragonArrangments, suitDragonConversion, outputExpander, getTileDifferential}
= require("../utilities.js");


//Each function will return an array. Each array will contain every possible matching combo in the form of an array of tiles.
//All 5 hands supported (#4 disabled on performance)
module.exports = [
	function(tiles = []) {
		allSuitArrangements.forEach((suitOrder) => {
			let newArr = []
			tiles.push(newArr)

			newArr.push(createTiles({type: suitOrder[0], value: 2, amount: 1}))
			newArr.push(createTiles({type: suitOrder[0], value: 1, amount: 1}))
			newArr.push(createTiles({type: suitOrder[0], value: 5, amount: 3}))

			newArr.push(createTiles({type: suitOrder[1], value: 4, amount: 3}))

			newArr.push(createTiles({type: suitOrder[2], value: 3, amount: 3}))
			newArr.push(createTiles({type: suitOrder[2], value: 9, amount: 3}))
		})

		allSuits.forEach((suit) => {
			let newArr = []
			tiles.push(newArr)

			newArr.push(createTiles({type: suit, value: 2, amount: 1}))
			newArr.push(createTiles({type: suit, value: 1, amount: 1}))
			newArr.push(createTiles({type: suit, value: 5, amount: 3}))

			newArr.push(createTiles({type: suit, value: 4, amount: 3}))

			newArr.push(createTiles({type: suit, value: 3, amount: 3}))
			newArr.push(createTiles({type: suit, value: 9, amount: 3}))
		})

		return {
			tiles,
			score: 25,
			concealed: false
		}
	},
	function(tiles = []) {
		allSuitArrangements.forEach((suitOrder) => {
			let newArr = []
			tiles.push(newArr)

			newArr.push(createTiles({type: suitOrder[0], value: 2, amount: 1}))
			newArr.push(createTiles({type: "dragon", value: "white", amount: 1}))

			newArr.push(createTiles({type: suitOrder[1], value: 2, amount: 3}))
			newArr.push(createTiles({type: suitOrder[1], value: 1, amount: 3}))

			newArr.push(createTiles({type: suitOrder[2], value: 8, amount: 3}))
			newArr.push(createTiles({type: suitOrder[2], value: 9, amount: 3}))
		})

		allSuits.forEach((suit) => {
			let newArr = []
			tiles.push(newArr)

			newArr.push(createTiles({type: suit, value: 2, amount: 1}))
			newArr.push(createTiles({type: "dragon", value: "white", amount: 1}))

			newArr.push(createTiles({type: suit, value: 2, amount: 3}))
			newArr.push(createTiles({type: suit, value: 1, amount: 3}))

			newArr.push(createTiles({type: suit, value: 8, amount: 3}))
			newArr.push(createTiles({type: suit, value: 9, amount: 3}))
		})

		return {
			tiles,
			score: 25,
			concealed: false
		}
	},
	function(tiles = []) {
		allSuitArrangements.forEach((suitOrder) => {
			let newArr = []
			tiles.push(newArr)

			newArr.push(createTiles({type: suitOrder[0], value: 1, amount: 1}))
			newArr.push(createTiles({type: suitOrder[0], value: 9, amount: 1}))

			newArr.push(createTiles({type: suitOrder[0], value: 7, amount: 3}))
			newArr.push(createTiles({type: suitOrder[0], value: 6, amount: 3}))

			newArr.push(createTiles({type: suitOrder[1], value: 2, amount: 3}))

			newArr.push(createTiles({type: suitOrder[2], value: 4, amount: 3}))
		})

		allSuits.forEach((suit) => {
			let newArr = []
			tiles.push(newArr)

			newArr.push(createTiles({type: suit, value: 1, amount: 1}))
			newArr.push(createTiles({type: suit, value: 9, amount: 1}))

			newArr.push(createTiles({type: suit, value: 7, amount: 3}))
			newArr.push(createTiles({type: suit, value: 6, amount: 3}))

			newArr.push(createTiles({type: suit, value: 2, amount: 3}))

			newArr.push(createTiles({type: suit, value: 4, amount: 3}))
		})

		return {
			tiles,
			score: 25,
			concealed: false
		}
	},
	function(tiles = []) {
		//This combo is HUGE compared to most other ones now. 2916 combos, and the any can make that as much as 14x as expensive.
		// allOptions.slice(0, -5).forEach((offset) => {
		// 	allSuits.forEach((firstSuit) => {
		// 		allSuits.forEach((secondSuit) => {
		// 			allSuits.forEach((thirdSuit) => {
		// 				allSuits.forEach((fourthSuit) => {
		// 					allSuits.forEach((fifthSuit) => {
		// 						allSuits.forEach((sixthSuit) => {
		//
		// 							let newArr = []
		// 							tiles.push(newArr)
		//
		// 							newArr.push(createTiles({type: "any", value: "any", amount: 2}))
		//
		// 							newArr.push(createTiles({type: firstSuit, value: 0+offset, amount: 2}))
		// 							newArr.push(createTiles({type: secondSuit, value: 1+offset, amount: 2}))
		// 							newArr.push(createTiles({type: thirdSuit, value: 2+offset, amount: 2}))
		// 							newArr.push(createTiles({type: fourthSuit, value: 3+offset, amount: 2}))
		// 							newArr.push(createTiles({type: fifthSuit, value: 4+offset, amount: 2}))
		// 							newArr.push(createTiles({type: sixthSuit, value: 5+offset, amount: 2}))
		// 						})
		// 					})
		// 				})
		// 			})
		// 		})
		// 	})
		// })

		return {
			tiles,
			score: 40,
			concealed: true,
			skipDuplicateRemoval: true
		}
	},
	function(tiles = []) {
		allSuitArrangements.forEach((suitOrder) => {
			let newArr = []
			tiles.push(newArr)

			newArr.push(createTiles({type: "any", value: "any", amount: 2}))

			newArr.push(createTiles({type: suitOrder[0], value: 1, amount: 1}))
			newArr.push(createTiles({type: suitOrder[0], value: 9, amount: 1}))
			newArr.push(createTiles({type: suitOrder[0], value: 4, amount: 1}))
			newArr.push(createTiles({type: suitOrder[0], value: 9, amount: 1}))

			newArr.push(createTiles({type: suitOrder[1], value: 1, amount: 1}))
			newArr.push(createTiles({type: suitOrder[1], value: 9, amount: 1}))
			newArr.push(createTiles({type: suitOrder[1], value: 6, amount: 1}))
			newArr.push(createTiles({type: suitOrder[1], value: 1, amount: 1}))

			newArr.push(createTiles({type: suitOrder[2], value: 1, amount: 1}))
			newArr.push(createTiles({type: suitOrder[2], value: 9, amount: 1}))
			newArr.push(createTiles({type: suitOrder[2], value: 7, amount: 1}))
			newArr.push(createTiles({type: suitOrder[2], value: 3, amount: 1}))
		})

		allSuits.forEach((suit) => {
			let newArr = []
			tiles.push(newArr)

			newArr.push(createTiles({type: "any", value: "any", amount: 2}))

			newArr.push(createTiles({type: suit, value: 1, amount: 1}))
			newArr.push(createTiles({type: suit, value: 9, amount: 1}))
			newArr.push(createTiles({type: suit, value: 4, amount: 1}))
			newArr.push(createTiles({type: suit, value: 9, amount: 1}))

			newArr.push(createTiles({type: suit, value: 1, amount: 1}))
			newArr.push(createTiles({type: suit, value: 9, amount: 1}))
			newArr.push(createTiles({type: suit, value: 6, amount: 1}))
			newArr.push(createTiles({type: suit, value: 1, amount: 1}))

			newArr.push(createTiles({type: suit, value: 1, amount: 1}))
			newArr.push(createTiles({type: suit, value: 9, amount: 1}))
			newArr.push(createTiles({type: suit, value: 7, amount: 1}))
			newArr.push(createTiles({type: suit, value: 3, amount: 1}))
		})

		return {
			tiles,
			score: 75,
			concealed: true
		}
	},
].map((func, index) => {
	let output = func()
	output.cardIndex = index
	output.section = "What's Your Number Please?"
	return output
})
