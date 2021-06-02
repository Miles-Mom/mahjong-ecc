const {allTiles, nonJokerTiles, createTiles, allSuits, allSuitArrangements, oddOptions, evenOptions, allOptions, windOptions, windArrangments, dragonOptions, dragonArrangments, suitDragonConversion, outputExpander, getTileDifferential}
= require("../utilities.js");


//Each function will return an array. Each array will contain every possible matching combo in the form of an array of tiles.
//All but #6 (of 7) supported.
module.exports = [
	function(tiles = []) {
		allSuits.forEach((suitFor1) => {
			let newArr = []
			tiles.push(newArr)

			newArr.push(createTiles({type: "any", value: "any", amount: 3}))

			newArr.push(createTiles({type: "any", value: "any", amount: 2}))

			newArr.push(createTiles({type: "wind", value: "south", amount: 1}))

			newArr.push(createTiles({type: "wind", value: "west", amount: 1}))
			newArr.push(createTiles({type: "wind", value: "east", amount: 1}))

			newArr.push(createTiles({type: "any", value: "any", amount: 2}))

			newArr.push(createTiles({type: "wind", value: "west", amount: 1}))
			newArr.push(createTiles({type: suitFor1, value: 1, amount: 1}))
			newArr.push(createTiles({type: "wind", value: "north", amount: 1}))
			newArr.push(createTiles({type: "dragon", value: "any", amount: 1}))

		})

		return {
			tiles,
			score: 40,
			concealed: false
		}
	},
	function(tiles = []) {
		allSuits.forEach((suitFor1) => {
			let newArr = []
			tiles.push(newArr)

			newArr.push(createTiles({type: "any", value: "any", amount: 3}))

			newArr.push(createTiles({type: "any", value: "any", amount: 2}))

			newArr.push(createTiles({type: "wind", value: "north", amount: 1}))
			newArr.push(createTiles({type: "dragon", value: "any", amount: 1}))
			newArr.push(createTiles({type: "any", value: "any", amount: 1}))
			newArr.push(createTiles({type: "wind", value: "west", amount: 1}))
			newArr.push(createTiles({type: "dragon", value: "white", amount: 1}))
			newArr.push(createTiles({type: "wind", value: "north", amount: 1}))
			newArr.push(createTiles({type: suitFor1, value: 1, amount: 1}))
			newArr.push(createTiles({type: "any", value: "any", amount: 1}))
			newArr.push(createTiles({type: "wind", value: "west", amount: 1}))
		})

		return {
			tiles,
			score: 40,
			concealed: false
		}
	},
	function(tiles = []) {
		allSuits.forEach((suitFor2) => {
			let newArr = []
			tiles.push(newArr)

			//BEAS 2 Of B RRR DEN
			newArr.push(createTiles({type: "bamboo", value: "any", amount: 1}))
			newArr.push(createTiles({type: "wind", value: "east", amount: 1}))
			newArr.push(createTiles({type: "any", value: "any", amount: 1}))
			newArr.push(createTiles({type: "wind", value: "south", amount: 1}))

			newArr.push(createTiles({type: suitFor2, value: 2, amount: 1}))

			newArr.push(createTiles({type: "dragon", value: "white", amount: 1}))
			newArr.push(createTiles({type: "flower", amount: 1}))

			newArr.push(createTiles({type: "bamboo", value: "any", amount: 1}))

			newArr.push(createTiles({type: "dragon", value: "red", amount: 3}))

			newArr.push(createTiles({type: "dragon", value: "any", amount: 1}))
			newArr.push(createTiles({type: "wind", value: "east", amount: 1}))
			newArr.push(createTiles({type: "wind", value: "north", amount: 1}))
		})

		return {
			tiles,
			score: 45,
			concealed: false
		}
	},
	function(tiles = []) {
		allSuits.forEach((suitFor1) => {
			//RAINBOWS AA ND MJ
			let newArr = []
			tiles.push(newArr)

			newArr.push(createTiles({type: "dragon", value: "red", amount: 1}))
			newArr.push(createTiles({type: "any", value: "any", amount: 1}))
			newArr.push(createTiles({type: suitFor1, value: 1, amount: 1}))
			newArr.push(createTiles({type: "wind", value: "north", amount: 1}))
			newArr.push(createTiles({type: "bamboo", value: "any", amount: 1}))
			newArr.push(createTiles({type: "dragon", value: "white", amount: 1}))
			newArr.push(createTiles({type: "wind", value: "west", amount: 1}))
			newArr.push(createTiles({type: "wind", value: "south", amount: 1}))

			newArr.push(createTiles({type: "any", value: "any", amount: 2}))

			newArr.push(createTiles({type: "wind", value: "north", amount: 1}))
			newArr.push(createTiles({type: "dragon", value: "any", amount: 1}))

			newArr.push(createTiles({type: "dragon", value: "west", amount: 1}))
			newArr.push(createTiles({type: "joker", amount: 1}))
		})

		return {
			tiles,
			score: 75,
			concealed: true
		}
	},
	function(tiles = []) {
		allSuits.forEach((suitFor7) => {
			allSuits.forEach((suitFor1) => {
				allSuitArrangements.forEach((suitOrder) => {
					//FIL AA WAGON 2021
					let newArr = []
					tiles.push(newArr)

					newArr.push(createTiles({type: "flower", amount: 1}))
					newArr.push(createTiles({type: suitFor1, value: 1, amount: 1}))
					newArr.push(createTiles({type: suitFor7, value: 7, amount: 1}))

					newArr.push(createTiles({type: "any", value: "any", amount: 2}))

					newArr.push(createTiles({type: "wind", value: "west", amount: 1}))
					newArr.push(createTiles({type: "any", value: "any", amount: 1}))
					newArr.push(createTiles({type: "dragon", value: "green", amount: 1}))
					newArr.push(createTiles({type: "dragon", value: "white", amount: 1}))
					newArr.push(createTiles({type: "wind", value: "north", amount: 1}))

					newArr.push(createTiles({type: suitOrder[0], value: 2, amount: 1}))
					newArr.push(createTiles({type: "dragon", value: "white", amount: 1}))
					newArr.push(createTiles({type: suitOrder[1], value: 2, amount: 1}))
					newArr.push(createTiles({type: suitOrder[2], value: 1, amount: 1}))
				})
			})
		})

		return {
			tiles,
			score: 75,
			concealed: true
		}
	},
	function(tiles = []) {
		//Not yet implemented

		return {
			tiles,
			score: 75,
			concealed: true
		}
	},
	function(tiles = []) {
		allSuits.forEach((suitFor7) => {
			allSuits.forEach((suitFor1) => {
				allSuits.forEach((suitFor2) => {
					//FIELD AND S2REAM
					let newArr = []
					tiles.push(newArr)

					newArr.push(createTiles({type: "flower", amount: 1}))
					newArr.push(createTiles({type: "wind", value: "east", amount: 1}))
					newArr.push(createTiles({type: suitFor1, value: 1, amount: 1}))
					newArr.push(createTiles({type: suitFor7, value: 7, amount: 1}))
					newArr.push(createTiles({type: "dragon", value: "any", amount: 1}))

					newArr.push(createTiles({type: "any", value: "any", amount: 1}))
					newArr.push(createTiles({type: "wind", value: "north", amount: 1}))
					newArr.push(createTiles({type: "dragon", value: "any", amount: 1}))

					newArr.push(createTiles({type: "wind", value: "south", amount: 1}))
					newArr.push(createTiles({type: suitFor2, value: 2, amount: 1}))
					newArr.push(createTiles({type: "dragon", value: "red", amount: 1}))
					newArr.push(createTiles({type: "wind", value: "east", amount: 1}))
					newArr.push(createTiles({type: "any", value: "any", amount: 1}))
					newArr.push(createTiles({type: "wind", value: "west", amount: 1}))
				})
			})
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
	output.section = "Carpe Diem"
	return output
})
