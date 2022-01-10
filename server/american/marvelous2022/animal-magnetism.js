const {allTiles, nonJokerTiles, createTiles, allSuits, allSuitArrangements, oddOptions, evenOptions, allOptions, windOptions, windArrangments, dragonOptions, dragonArrangments, suitDragonConversion, outputExpander, getTileDifferential}
= require("../utilities.js");


//Each function will return an array. Each array will contain every possible matching combo in the form of an array of tiles.
//All 7 hands supported.
module.exports = [
	function(tiles = []) {
		allSuits.forEach((suitFor2) => {
			allSuits.forEach((suitFor1) => {
				let newArr = []
				tiles.push(newArr)

				//PPP A PPP ER
				newArr.push(createTiles({type: "any", value: "any", amount: 3}))
				newArr.push(createTiles({type: "any", value: "any", amount: 1}))
				newArr.push(createTiles({type: "any", value: "any", amount: 3}))

				newArr.push(createTiles({type: "wind", value: "east", amount: 1}))
				newArr.push(createTiles({type: "dragon", value: "red", amount: 1}))

				//21GER
				newArr.push(createTiles({type: suitFor2, value: 2, amount: 1}))
				newArr.push(createTiles({type: suitFor1, value: 1, amount: 1}))
				newArr.push(createTiles({type: "dragon", value: "green", amount: 1}))
				newArr.push(createTiles({type: "wind", value: "east", amount: 1}))
				newArr.push(createTiles({type: "dragon", value: "red", amount: 1}))
			})
		})

		return {
			tiles,
			score: 35,
			concealed: false,
		}
	},
	function(tiles = []) {
		allSuits.forEach((suitFor7) => {
			let newArr = []
			tiles.push(newArr)

			//JM PPP S N LEA PPP S
			newArr.push(createTiles({type: "joker", amount: 1}))
			newArr.push(createTiles({type: "wind", value: "west", amount: 1}))

			newArr.push(createTiles({type: "any", value: "any", amount: 3}))

			newArr.push(createTiles({type: "wind", value: "south", amount: 1}))

			newArr.push(createTiles({type: "wind", value: "north", amount: 1}))

			newArr.push(createTiles({type: suitFor7, value: 7, amount: 1}))
			newArr.push(createTiles({type: "wind", value: "east", amount: 1}))
			newArr.push(createTiles({type: "any", value: "any", amount: 1}))

			newArr.push(createTiles({type: "any", value: "any", amount: 3}))

			newArr.push(createTiles({type: "wind", value: "south", amount: 1}))
		})

		return {
			tiles,
			score: 35,
			concealed: false,
		}
	},
	function(tiles = []) {
		allSuits.forEach((suitFor7) => {
			let newArr = []
			tiles.push(newArr)

			//A JNGLE B OOO KKKK
			newArr.push(createTiles({type: "any", value: "any", amount: 1}))

			newArr.push(createTiles({type: "joker", amount: 1}))
			newArr.push(createTiles({type: "wind", value: "north", amount: 1}))
			newArr.push(createTiles({type: "dragon", value: "green", amount: 1}))
			newArr.push(createTiles({type: suitFor7, value: 7, amount: 1}))
			newArr.push(createTiles({type: "wind", value: "east", amount: 1}))

			newArr.push(createTiles({type: "bamboo", value: "any", amount: 1}))
			newArr.push(createTiles({type: "dragon", value: "white", amount: 3}))

			newArr.push(createTiles({type: "any", value: "any", amount: 4}))
		})

		return {
			tiles,
			score: 35,
			concealed: false,
		}
	},
	function(tiles = []) {
		allSuits.forEach((suitFor7) => {
			let newArr = []
			tiles.push(newArr)

			//ORANGE BLAC KKKK
			newArr.push(createTiles({type: "dragon", value: "white", amount: 1}))
			newArr.push(createTiles({type: "dragon", value: "red", amount: 1}))
			newArr.push(createTiles({type: "any", value: "any", amount: 1}))
			newArr.push(createTiles({type: "wind", value: "north", amount: 1}))
			newArr.push(createTiles({type: "dragon", value: "green", amount: 1}))
			newArr.push(createTiles({type: "wind", value: "east", amount: 1}))

			newArr.push(createTiles({type: "bamboo", value: "any", amount: 1}))
			newArr.push(createTiles({type: suitFor7, value: 7, amount: 1}))
			newArr.push(createTiles({type: "any", value: "any", amount: 1}))
			newArr.push(createTiles({type: "character", value: "any", amount: 1}))

			newArr.push(createTiles({type: "any", value: "any", amount: 4}))
		})

		return {
			tiles,
			score: 35,
			concealed: false,
		}
	},
	function(tiles = []) {
		allSuits.forEach((suitFor7) => {
			allSuits.forEach((suitFor1, i) => {
				let newArr = []
				tiles.push(newArr)

				//KKKK ING OF JNGLE
				newArr.push(createTiles({type: "any", value: "any", amount: 4}))

				newArr.push(createTiles({type: suitFor1, value: 1, amount: 1}))
				newArr.push(createTiles({type: "wind", value: "north", amount: 1}))
				newArr.push(createTiles({type: "dragon", value: "green", amount: 1}))

				newArr.push(createTiles({type: "dragon", value: "white", amount: 1}))
				newArr.push(createTiles({type: "flower", amount: 1}))

				newArr.push(createTiles({type: "joker", amount: 1}))
				newArr.push(createTiles({type: "wind", value: "north", amount: 1}))
				newArr.push(createTiles({type: "dragon", value: "green", amount: 1}))
				newArr.push(createTiles({type: suitFor7, value: 1, amount: 1}))
				newArr.push(createTiles({type: "wind", value: "east", amount: 1}))
			});
		})

		return {
			tiles,
			score: 40,
			concealed: false,
		}
	},
	function(tiles = []) {
		allSuits.forEach((suitFor1) => {
			allSuits.forEach((suitForSecond1, i) => {
				let newArr = []
				tiles.push(newArr)

				//GGG RRR I FFF IC MJ
				newArr.push(createTiles({type: "dragon", value: "green", amount: 3}))
				newArr.push(createTiles({type: "dragon", value: "red", amount: 3}))

				newArr.push(createTiles({type: suitFor1, value: 1, amount: 1}))

				newArr.push(createTiles({type: "flower", amount: 3}))

				newArr.push(createTiles({type: suitForSecond1, value: 1, amount: 1}))
				newArr.push(createTiles({type: "character", value: "any", amount: 1}))

				newArr.push(createTiles({type: "wind", value: "west", amount: 1}))
				newArr.push(createTiles({type: "joker", amount: 1}))
			});
		})

		return {
			tiles,
			score: 40,
			concealed: false,
		}
	},
	function(tiles = []) {
		allSuits.forEach((suitFor1) => {
			allSuits.forEach((suitForSecond1, i) => {
				allSuits.forEach((suitFor7, i) => {
					let newArr = []
					tiles.push(newArr)

					//C III RCO SSS GIRL
					newArr.push(createTiles({type: "character", value: "any", amount: 1}))

					newArr.push(createTiles({type: suitFor1, value: 1, amount: 3}))

					newArr.push(createTiles({type: "dragon", value: "red", amount: 1}))
					newArr.push(createTiles({type: "character", value: "any", amount: 1}))
					newArr.push(createTiles({type: "dragon", value: "white", amount: 1}))

					newArr.push(createTiles({type: "wind", value: "south", amount: 3}))

					newArr.push(createTiles({type: "dragon", value: "green", amount: 1}))
					newArr.push(createTiles({type: suitFor1, value: 1, amount: 1}))
					newArr.push(createTiles({type: "dragon", value: "red", amount: 1}))
					newArr.push(createTiles({type: suitFor7, value: 1, amount: 1}))
				});
			});
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
	output.section = "Animal Magnetism"
	return output
})
