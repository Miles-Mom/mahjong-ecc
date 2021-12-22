const {allTiles, nonJokerTiles, createTiles, allSuits, allSuitArrangements, oddOptions, evenOptions, allOptions, windOptions, windArrangments, dragonOptions, dragonArrangments, suitDragonConversion, outputExpander, getTileDifferential}
= require("../utilities.js");


//Each function will return an array. Each array will contain every possible matching combo in the form of an array of tiles.
//Supports first 4 hands (of 7)
module.exports = [
	function(tiles = []) {
		allOptions.slice(0, -6).forEach((num, i) => {
			allSuitArrangements.forEach((suitOrder) => {
				let newArr = []
				tiles.push(newArr)

				//AA 234567 888 888
				newArr.push(createTiles({type: "any", value: "any", amount: 2}))

				newArr.push(createTiles({type: suitOrder[0], value: num + 0, amount: 1}))
				newArr.push(createTiles({type: suitOrder[0], value: num + 1, amount: 1}))
				newArr.push(createTiles({type: suitOrder[0], value: num + 2, amount: 1}))
				newArr.push(createTiles({type: suitOrder[0], value: num + 3, amount: 1}))
				newArr.push(createTiles({type: suitOrder[0], value: num + 4, amount: 1}))
				newArr.push(createTiles({type: suitOrder[0], value: num + 5, amount: 1}))

				newArr.push(createTiles({type: suitOrder[1], value: num + 6, amount: 3}))
				newArr.push(createTiles({type: suitOrder[2], value: num + 6, amount: 3}))
			})
		});
		return {
			tiles,
			score: 25,
			concealed: false,
		}
	},
	function(tiles = []) {
		allOptions.slice(0, -4).forEach((num, i) => {
			allSuitArrangements.forEach((suitOrder) => {
				let newArr = []
				tiles.push(newArr)

				//1234 555 KKKK PPP
				newArr.push(createTiles({type: suitOrder[0], value: num + 0, amount: 1}))
				newArr.push(createTiles({type: suitOrder[0], value: num + 1, amount: 1}))
				newArr.push(createTiles({type: suitOrder[0], value: num + 2, amount: 1}))
				newArr.push(createTiles({type: suitOrder[0], value: num + 3, amount: 1}))

				newArr.push(createTiles({type: suitOrder[1], value: num + 4, amount: 3}))

				newArr.push(createTiles({type: "any", value: "any", amount: 4}))
				newArr.push(createTiles({type: "any", value: "any", amount: 3}))
			})
		});
		return {
			tiles,
			score: 25,
			concealed: false,
		}
	},
	function(tiles = []) {
		allOptions.slice(0, -5).forEach((num, i) => {
			allSuitArrangements.forEach((suitOrder) => {
				let newArr = []
				tiles.push(newArr)

				//AA 333 4 555 6 777 8
				newArr.push(createTiles({type: "any", value: "any", amount: 2}))
				newArr.push(createTiles({type: suitOrder[0], value: num + 0, amount: 3}))
				newArr.push(createTiles({type: suitOrder[1], value: num + 1, amount: 1}))
				newArr.push(createTiles({type: suitOrder[0], value: num + 2, amount: 3}))
				newArr.push(createTiles({type: suitOrder[1], value: num + 3, amount: 1}))
				newArr.push(createTiles({type: suitOrder[0], value: num + 4, amount: 3}))
				newArr.push(createTiles({type: suitOrder[1], value: num + 5, amount: 1}))
			})
		});
		return {
			tiles,
			score: 25,
			concealed: false,
		}
	},
	function(tiles = []) {
		allOptions.slice(0, -5).forEach((num, i) => {
			allSuitArrangements.forEach((suitOrder) => {
				let newArr = []
				tiles.push(newArr)

				//4444 5555 PPP 999
				newArr.push(createTiles({type: suitOrder[0], value: num + 0, amount: 4}))
				newArr.push(createTiles({type: suitOrder[1], value: num + 1, amount: 4}))
				newArr.push(createTiles({type: "any", value: "any", amount: 3}))

				newArr.push(createTiles({type: suitOrder[2], value: num + 5, amount: 3}))
			})

			allSuits.forEach((suit) => {
				let newArr = []
				tiles.push(newArr)

				//4444 5555 PPP 999
				newArr.push(createTiles({type: suit, value: num + 0, amount: 4}))
				newArr.push(createTiles({type: suit, value: num + 1, amount: 4}))
				newArr.push(createTiles({type: "any", value: "any", amount: 3}))

				newArr.push(createTiles({type: suit, value: num + 5, amount: 3}))
			})
		});
		return {
			tiles,
			score: 25,
			concealed: false,
		}
	},
].map((func, index) => {
	let output = func()
	output.cardIndex = index
	output.section = "Out Run"
	return output
})
