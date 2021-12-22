const {allTiles, nonJokerTiles, createTiles, allSuits, allSuitArrangements, oddOptions, evenOptions, allOptions, windOptions, windArrangments, dragonOptions, dragonArrangments, suitDragonConversion, outputExpander, getTileDifferential}
= require("../utilities.js");


//Each function will return an array. Each array will contain every possible matching combo in the form of an array of tiles.
//All 5 hands supported.
module.exports = [
	function(tiles = []) {
		allSuitArrangements.forEach((suitOrder) => {
			let newArr = []
			tiles.push(newArr)

			//AA 333 444 555 999
			newArr.push(createTiles({type: "any", value: "any", amount: 2}))
			newArr.push(createTiles({type: suitOrder[0], value: 3, amount: 3}))

			newArr.push(createTiles({type: suitOrder[1], value: 4, amount: 3}))
			newArr.push(createTiles({type: suitOrder[1], value: 5, amount: 3}))

			newArr.push(createTiles({type: suitOrder[2], value: 9, amount: 3}))
		})

		allSuits.forEach((suit) => {
			let newArr = []
			tiles.push(newArr)

			//AA 333 444 555 999
			newArr.push(createTiles({type: "any", value: "any", amount: 2}))
			newArr.push(createTiles({type: suit, value: 3, amount: 3}))

			newArr.push(createTiles({type: suit, value: 4, amount: 3}))
			newArr.push(createTiles({type: suit, value: 5, amount: 3}))

			newArr.push(createTiles({type: suit, value: 9, amount: 3}))
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

			//AA 111 444 666 888
			newArr.push(createTiles({type: "any", value: "any", amount: 2}))
			newArr.push(createTiles({type: suitOrder[0], value: 1, amount: 3}))

			newArr.push(createTiles({type: suitOrder[1], value: 4, amount: 3}))
			newArr.push(createTiles({type: suitOrder[1], value: 6, amount: 3}))

			newArr.push(createTiles({type: suitOrder[2], value: 8, amount: 3}))
		})

		allSuits.forEach((suit) => {
			let newArr = []
			tiles.push(newArr)

			//AA 111 444 666 888
			newArr.push(createTiles({type: "any", value: "any", amount: 2}))
			newArr.push(createTiles({type: suit, value: 1, amount: 3}))

			newArr.push(createTiles({type: suit, value: 4, amount: 3}))
			newArr.push(createTiles({type: suit, value: 6, amount: 3}))

			newArr.push(createTiles({type: suit, value: 8, amount: 3}))
		})

		return {
			tiles,
			score: 25,
			concealed: false,
		}
	},
	function(tiles = []) {
		allOptions.slice(0, -1).forEach((num, i) => {
			allSuitArrangements.forEach((suitOrder) => {
				let newArr = []
				tiles.push(newArr)

				//FFFF AA 6666 7777
				newArr.push(createTiles({type: "flower", amount: 4}))
				newArr.push(createTiles({type: "any", value: "any", amount: 2}))

				newArr.push(createTiles({type: suitOrder[0], value: num + 0, amount: 4}))
				newArr.push(createTiles({type: suitOrder[1], value: num + 1, amount: 4}))
			})

			allSuits.forEach((suit) => {
				let newArr = []
				tiles.push(newArr)

				//FFFF AA 6666 7777
				newArr.push(createTiles({type: "flower", amount: 4}))
				newArr.push(createTiles({type: "any", value: "any", amount: 2}))

				newArr.push(createTiles({type: suit, value: num + 0, amount: 4}))
				newArr.push(createTiles({type: suit, value: num + 1, amount: 4}))
			})
		});

		return {
			tiles,
			score: 25,
			concealed: false,
		}
	},
	function(tiles = []) {
		allOptions.slice(0, -3).forEach((num, i) => {
			allSuitArrangements.forEach((suitOrder) => {
				let newArr = []
				tiles.push(newArr)

				//FFFF 5555 AA 8888
				newArr.push(createTiles({type: "flower", amount: 4}))

				newArr.push(createTiles({type: suitOrder[0], value: num + 0, amount: 4}))

				newArr.push(createTiles({type: "any", value: "any", amount: 2}))

				newArr.push(createTiles({type: suitOrder[1], value: num + 3, amount: 4}))
			})

			allSuits.forEach((suit) => {
				let newArr = []
				tiles.push(newArr)

				//FFFF 5555 AA 8888
				newArr.push(createTiles({type: "flower", amount: 4}))

				newArr.push(createTiles({type: suit, value: num + 0, amount: 4}))

				newArr.push(createTiles({type: "any", value: "any", amount: 2}))

				newArr.push(createTiles({type: suit, value: num + 3, amount: 4}))
			})
		});

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

			//AA 1950 1962 1974
			newArr.push(createTiles({type: "any", value: "any", amount: 2}))

			newArr.push(createTiles({type: suitOrder[0], value: 1, amount: 1}))
			newArr.push(createTiles({type: suitOrder[0], value: 9, amount: 1}))
			newArr.push(createTiles({type: suitOrder[0], value: 5, amount: 1}))
			newArr.push(createTiles({type: "dragon", value: "white", amount: 1}))

			newArr.push(createTiles({type: suitOrder[1], value: 1, amount: 1}))
			newArr.push(createTiles({type: suitOrder[1], value: 9, amount: 1}))
			newArr.push(createTiles({type: suitOrder[1], value: 6, amount: 1}))
			newArr.push(createTiles({type: suitOrder[1], value: 2, amount: 1}))

			newArr.push(createTiles({type: suitOrder[2], value: 1, amount: 1}))
			newArr.push(createTiles({type: suitOrder[2], value: 9, amount: 1}))
			newArr.push(createTiles({type: suitOrder[2], value: 7, amount: 1}))
			newArr.push(createTiles({type: suitOrder[2], value: 4, amount: 1}))
		})

		allSuits.forEach((suit) => {
			let newArr = []
			tiles.push(newArr)

			//AA 1950 1962 1974
			newArr.push(createTiles({type: "any", value: "any", amount: 2}))

			newArr.push(createTiles({type: suit, value: 1, amount: 1}))
			newArr.push(createTiles({type: suit, value: 9, amount: 1}))
			newArr.push(createTiles({type: suit, value: 5, amount: 1}))
			newArr.push(createTiles({type: "dragon", value: "white", amount: 1}))

			newArr.push(createTiles({type: suit, value: 1, amount: 1}))
			newArr.push(createTiles({type: suit, value: 9, amount: 1}))
			newArr.push(createTiles({type: suit, value: 6, amount: 1}))
			newArr.push(createTiles({type: suit, value: 2, amount: 1}))

			newArr.push(createTiles({type: suit, value: 1, amount: 1}))
			newArr.push(createTiles({type: suit, value: 9, amount: 1}))
			newArr.push(createTiles({type: suit, value: 7, amount: 1}))
			newArr.push(createTiles({type: suit, value: 4, amount: 1}))
		})

		return {
			tiles,
			score: 40,
			concealed: false,
		}
	},
].map((func, index) => {
	let output = func()
	output.cardIndex = index
	output.section = "Out Numbered"
	return output
})
