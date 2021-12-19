const {allTiles, nonJokerTiles, createTiles, allSuits, allSuitArrangements, oddOptions, evenOptions, allOptions, windOptions, windArrangments, dragonOptions, dragonArrangments, suitDragonConversion, outputExpander, getTileDifferential}
= require("../utilities.js");


//Each function will return an array. Each array will contain every possible matching combo in the form of an array of tiles.
//All 7 hands supported. 
module.exports = [
	function(tiles = []) {
		allSuitArrangements.forEach((suitOrder) => {
			let newArr = []
			tiles.push(newArr)

			//AA
			newArr.push(createTiles({type: "any", value: "any", amount: 2}))

			//248 666
			newArr.push(createTiles({type: suitOrder[0], value: 2, amount: 1}))
			newArr.push(createTiles({type: suitOrder[0], value: 4, amount: 1}))
			newArr.push(createTiles({type: suitOrder[0], value: 8, amount: 1}))
			newArr.push(createTiles({type: suitOrder[0], value: 6, amount: 3}))

			//888 642
			newArr.push(createTiles({type: suitOrder[1], value: 8, amount: 3}))
			newArr.push(createTiles({type: suitOrder[1], value: 6, amount: 1}))
			newArr.push(createTiles({type: suitOrder[1], value: 4, amount: 1}))
			newArr.push(createTiles({type: suitOrder[1], value: 2, amount: 1}))
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

			//2468
			newArr.push(createTiles({type: suitOrder[0], value: 2, amount: 1}))
			newArr.push(createTiles({type: suitOrder[0], value: 4, amount: 1}))
			newArr.push(createTiles({type: suitOrder[0], value: 6, amount: 1}))
			newArr.push(createTiles({type: suitOrder[0], value: 8, amount: 1}))

			//6666
			newArr.push(createTiles({type: suitOrder[1], value: 6, amount: 4}))

			//8888
			newArr.push(createTiles({type: suitOrder[2], value: 8, amount: 4}))
		})

		return {
			tiles,
			score: 25,
			concealed: false,
		}
	},
	function(tiles = []) {
		allSuitArrangements.forEach((suitOrder) => {
			windArrangments.forEach((windOrder) => {
				let newArr = []
				tiles.push(newArr)

				//FF
				newArr.push(createTiles({type: "flower", amount: 2}))

				//W
				newArr.push(createTiles({type: "wind", value: windOrder[0], amount: 1}))

				//2 444
				newArr.push(createTiles({type: suitOrder[0], value: 2, amount: 1}))
				newArr.push(createTiles({type: suitOrder[0], value: 4, amount: 3}))

				//64
				newArr.push(createTiles({type: suitOrder[1], value: 6, amount: 1}))
				newArr.push(createTiles({type: suitOrder[1], value: 4, amount: 1}))

				//666 8
				newArr.push(createTiles({type: suitOrder[2], value: 6, amount: 3}))
				newArr.push(createTiles({type: suitOrder[2], value: 8, amount: 1}))

				//E
				newArr.push(createTiles({type: "wind", value: windOrder[1], amount: 1}))
			})
		})

		return {
			tiles,
			score: 30,
			concealed: false,
		}
	},
	function(tiles = []) {
		evenOptions.forEach((num) => {
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
	function(tiles = []) {

		allSuitArrangements.forEach((suitOrder) => {
			let newArr = []
			tiles.push(newArr)

			//2022
			newArr.push(createTiles({type: "character", value: 2, amount: 1}))
			newArr.push(createTiles({type: "dragon", value: "white", amount: 1}))
			newArr.push(createTiles({type: "bamboo", value: 2, amount: 1}))
			newArr.push(createTiles({type: "circle", value: 2, amount: 1}))

			//444
			newArr.push(createTiles({type: suitOrder[0], value: 4, amount: 3}))

			//666
			newArr.push(createTiles({type: suitOrder[1], value: 6, amount: 3}))

			//8888
			newArr.push(createTiles({type: suitOrder[2], value: 8, amount: 4}))
		})

		allSuits.forEach((suit) => {
			let newArr = []
			tiles.push(newArr)

			//2022
			newArr.push(createTiles({type: "character", value: 2, amount: 1}))
			newArr.push(createTiles({type: "dragon", value: "white", amount: 1}))
			newArr.push(createTiles({type: "bamboo", value: 2, amount: 1}))
			newArr.push(createTiles({type: "circle", value: 2, amount: 1}))

			//444
			newArr.push(createTiles({type: suit, value: 4, amount: 3}))

			//666
			newArr.push(createTiles({type: suit, value: 6, amount: 3}))

			//8888
			newArr.push(createTiles({type: suit, value: 8, amount: 4}))
		})

		return {
			tiles,
			score: 30,
			concealed: false,
		}
	},
	function(tiles = []) {
		allSuitArrangements.forEach((suitOrder) => {
			let newArr = []
			tiles.push(newArr)

			//FFF
			newArr.push(createTiles({type: "flower", amount: 3}))

			//MJ
			newArr.push(createTiles({type: "wind", value: "west", amount: 1}))
			newArr.push(createTiles({type: "joker", amount: 1}))

			//2
			newArr.push(createTiles({type: suitOrder[0], value: 2, amount: 1}))

			//44 666
			newArr.push(createTiles({type: suitOrder[1], value: 4, amount: 2}))
			newArr.push(createTiles({type: suitOrder[1], value: 6, amount: 3}))

			//888
			newArr.push(createTiles({type: suitOrder[2], value: 8, amount: 3}))
		})

		allSuits.forEach((suit) => {
			let newArr = []
			tiles.push(newArr)

			//FFF
			newArr.push(createTiles({type: "flower", amount: 3}))

			//MJ
			newArr.push(createTiles({type: "wind", value: "west", amount: 1}))
			newArr.push(createTiles({type: "joker", amount: 1}))

			//2
			newArr.push(createTiles({type: suit, value: 2, amount: 1}))

			//44 666
			newArr.push(createTiles({type: suit, value: 4, amount: 2}))
			newArr.push(createTiles({type: suit, value: 6, amount: 3}))

			//888
			newArr.push(createTiles({type: suit, value: 8, amount: 3}))
		})

		return {
			tiles,
			score: 35,
			concealed: false,
		}
	},
	function(tiles = []) {
		allSuits.forEach((suitFor1) => {
			let newArr = []
			tiles.push(newArr)

			//222
			//TODO: Must the twos be characters? Or any suit?
			newArr.push(createTiles({type: "character", value: 2, amount: 3}))

			//OOO
			newArr.push(createTiles({type: "dragon", value: "white", amount: 3}))

			//NNN
			newArr.push(createTiles({type: "wind", value: "north", amount: 3}))

			//II
			newArr.push(createTiles({type: suitFor1, value: 1, amount: 2}))

			//EEE
			newArr.push(createTiles({type: "wind", value: "east", amount: 3}))
		})

		return {
			tiles,
			score: 35,
			concealed: false,
		}
	},
].map((func, index) => {
	let output = func()
	output.cardIndex = index
	output.section = "Evenly Striped"
	return output
})
