const {allTiles, nonJokerTiles, createTiles, allSuits, allSuitArrangements, oddOptions, evenOptions, allOptions, windOptions, windArrangments, dragonOptions, dragonArrangments, suitDragonConversion, outputExpander, getTileDifferential}
= require("../utilities.js");


//Each function will return an array. Each array will contain every possible matching combo in the form of an array of tiles.
//All but #7 (last)
module.exports = [
	function(tiles = []) {
		allSuits.forEach((suit) => {
			allOptions.slice(0,-4).forEach((offset) => {
				let newArr = []
				tiles.push(newArr)
				
				newArr.push(createTiles({type: suit, value: offset+0, amount: 1}))
				newArr.push(createTiles({type: suit, value: offset+1, amount: 3}))
				newArr.push(createTiles({type: suit, value: offset+2, amount: 1}))
				newArr.push(createTiles({type: suit, value: offset+3, amount: 4}))
				newArr.push(createTiles({type: suit, value: offset+4, amount: 1}))

				newArr.push(createTiles({type: "any", value: "any", amount: 4}))
			})
		})

		return {
			tiles,
			score: 25,
			concealed: false,
		}
	},
	function(tiles = []) {
		allOptions.slice(0, -3).forEach((offset) => {
			allSuitArrangements.forEach((suitOrder) => {
				let newArr = []
				tiles.push(newArr)

				newArr.push(createTiles({type: suitOrder[0], value: 0+offset, amount: 4}))
				newArr.push(createTiles({type: suitOrder[1], value: 1+offset, amount: 3}))
				newArr.push(createTiles({type: suitOrder[1], value: 2+offset, amount: 3}))
				newArr.push(createTiles({type: suitOrder[2], value: 3+offset, amount: 4}))
			})

			allSuits.forEach((suit) => {
				let newArr = []
				tiles.push(newArr)

				newArr.push(createTiles({type: suit, value: 0+offset, amount: 4}))
				newArr.push(createTiles({type: suit, value: 1+offset, amount: 3}))
				newArr.push(createTiles({type: suit, value: 2+offset, amount: 3}))
				newArr.push(createTiles({type: suit, value: 3+offset, amount: 4}))
			})
		})

		return {
			tiles,
			score: 25,
			concealed: false
		}
	},
	function(tiles = []) {
		allOptions.slice(0, -4).forEach((offset) => {
			allSuitArrangements.forEach((suitOrder) => {
				let newArr = []
				tiles.push(newArr)

				newArr.push(createTiles({type: suitOrder[0], value: 0+offset, amount: 3}))
				newArr.push(createTiles({type: suitOrder[1], value: 1+offset, amount: 2}))
				newArr.push(createTiles({type: suitOrder[2], value: 2+offset, amount: 4}))
				newArr.push(createTiles({type: suitOrder[1], value: 3+offset, amount: 2}))
				newArr.push(createTiles({type: suitOrder[0], value: 4+offset, amount: 3}))
			})

			allSuits.forEach((suit) => {
				let newArr = []
				tiles.push(newArr)

				newArr.push(createTiles({type: suit, value: 0+offset, amount: 3}))
				newArr.push(createTiles({type: suit, value: 1+offset, amount: 2}))
				newArr.push(createTiles({type: suit, value: 2+offset, amount: 4}))
				newArr.push(createTiles({type: suit, value: 3+offset, amount: 2}))
				newArr.push(createTiles({type: suit, value: 4+offset, amount: 3}))
			})
		})

		return {
			tiles,
			score: 30,
			concealed: false
		}
	},
	function(tiles = []) {
		allOptions.slice(0, -4).forEach((offset) => {
			allSuitArrangements.forEach((suitOrder) => {
				let newArr = []
				tiles.push(newArr)
				newArr.push(createTiles({type: "any", value: "any", amount: 2}))

				newArr.push(createTiles({type: suitOrder[0], value: 0+offset, amount: 3}))
				newArr.push(createTiles({type: suitOrder[0], value: 1+offset, amount: 3}))

				//This has duplicates, as last 2 suits are identical.
				newArr.push(createTiles({type: suitOrder[1], value: 2+offset, amount: 1}))
				newArr.push(createTiles({type: suitOrder[1], value: 3+offset, amount: 1}))
				newArr.push(createTiles({type: suitOrder[1], value: 4+offset, amount: 1}))

				newArr.push(createTiles({type: suitOrder[2], value: 2+offset, amount: 1}))
				newArr.push(createTiles({type: suitOrder[2], value: 3+offset, amount: 1}))
				newArr.push(createTiles({type: suitOrder[2], value: 4+offset, amount: 1}))
			})
		})
		return {
			tiles,
			score: 35,
			concealed: false,
		}
	},
	function(tiles = []) {
		let offset = 1
		allSuitArrangements.forEach((suitOrder) => {
			let newArr = []
			tiles.push(newArr)

			newArr.push(createTiles({type: "flower", amount: 1}))

			newArr.push(createTiles({type: suitOrder[0], value: 0+offset, amount: 1}))
			newArr.push(createTiles({type: suitOrder[0], value: 1+offset, amount: 1}))
			newArr.push(createTiles({type: suitOrder[0], value: 2+offset, amount: 1}))
			newArr.push(createTiles({type: suitOrder[0], value: 3+offset, amount: 1}))
			newArr.push(createTiles({type: suitOrder[0], value: 4+offset, amount: 1}))

			newArr.push(createTiles({type: suitOrder[1], value: 5+offset, amount: 3}))
			newArr.push(createTiles({type: suitOrder[1], value: 6+offset, amount: 1}))
			newArr.push(createTiles({type: suitOrder[1], value: 7+offset, amount: 3}))
			newArr.push(createTiles({type: suitOrder[1], value: 8+offset, amount: 1}))
		})

		allSuits.forEach((suit) => {
			let newArr = []
			tiles.push(newArr)

			newArr.push(createTiles({type: "flower", amount: 1}))

			newArr.push(createTiles({type: suit, value: 0+offset, amount: 1}))
			newArr.push(createTiles({type: suit, value: 1+offset, amount: 1}))
			newArr.push(createTiles({type: suit, value: 2+offset, amount: 1}))
			newArr.push(createTiles({type: suit, value: 3+offset, amount: 1}))
			newArr.push(createTiles({type: suit, value: 4+offset, amount: 1}))

			newArr.push(createTiles({type: suit, value: 5+offset, amount: 3}))
			newArr.push(createTiles({type: suit, value: 6+offset, amount: 1}))
			newArr.push(createTiles({type: suit, value: 7+offset, amount: 3}))
			newArr.push(createTiles({type: suit, value: 8+offset, amount: 1}))
		})
		return {
			tiles,
			score: 35,
			concealed: false
		}
	},
	function(tiles = []) {
		allOptions.slice(0, -3).forEach((offset) => {
			allSuitArrangements.forEach((suitOrder) => {
				windArrangments.forEach((windArrangment) => {
					let newArr = []
					tiles.push(newArr)

					newArr.push(createTiles({type: suitOrder[0], value: 2, amount: 1}))

					newArr.push(createTiles({type: "dragon", value: "white", amount: 1}))
					newArr.push(createTiles({type: "wind", value: windArrangment[0], amount: 3}))

					newArr.push(createTiles({type: suitOrder[1], value: 0+offset, amount: 1}))
					newArr.push(createTiles({type: suitOrder[1], value: 1+offset, amount: 1}))
					newArr.push(createTiles({type: suitOrder[1], value: 2+offset, amount: 1}))
					newArr.push(createTiles({type: suitOrder[1], value: 3+offset, amount: 1}))

					newArr.push(createTiles({type: "wind", value: windArrangment[1], amount: 3}))

					newArr.push(createTiles({type: suitOrder[2], value: 2, amount: 1}))
					newArr.push(createTiles({type: suitOrder[2], value: 1, amount: 1}))
				})
			})
		})

		return {
			tiles,
			score: 35,
			concealed: false
		}
	},
].map((func, index) => {
	let output = func()
	output.cardIndex = index
	output.section = "Running With The Bulls"
	return output
})
