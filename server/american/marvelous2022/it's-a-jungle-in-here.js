const {allTiles, nonJokerTiles, createTiles, allSuits, allSuitArrangements, oddOptions, evenOptions, allOptions, windOptions, windArrangments, dragonOptions, dragonArrangments, suitDragonConversion, outputExpander, getTileDifferential}
= require("../utilities.js");


//Each function will return an array. Each array will contain every possible matching combo in the form of an array of tiles.
//All 5 hands supported.
module.exports = [
	function(tiles = []) {
		let newArr = []
		tiles.push(newArr)

		//AA PPP KKKK QQQQQ
		newArr.push(createTiles({type: "any", value: "any", amount: 2}))
		newArr.push(createTiles({type: "any", value: "any", amount: 3}))
		newArr.push(createTiles({type: "any", value: "any", amount: 4}))
		newArr.push(createTiles({type: "any", value: "any", amount: 5}))

		return {
			tiles,
			score: 35,
			concealed: false,
			maxJokers: 1 //Technically, a hand using more than one joker is NOT dead, as somebody might swap, but hoping for other people to mess up in order to not be dead is not a good strategy.
		}
	},
	function(tiles = []) {
		allSuits.forEach((suitFor7) => {
			let newArr = []
			tiles.push(newArr)

			//LMNO PPP QQQQQ RS
			newArr.push(createTiles({type: suitFor7, value: 7, amount: 1}))
			newArr.push(createTiles({type: "wind", value: "west", amount: 1}))
			newArr.push(createTiles({type: "wind", value: "north", amount: 1}))
			newArr.push(createTiles({type: "dragon", value: "white", amount: 1}))

			newArr.push(createTiles({type: "any", value: "any", amount: 3}))
			newArr.push(createTiles({type: "any", value: "any", amount: 5}))
			
			newArr.push(createTiles({type: "dragon", value: "red", amount: 1}))
			newArr.push(createTiles({type: "wind", value: "south", amount: 1}))
		})

		return {
			tiles,
			score: 40,
			concealed: false,
		}
	},
	function(tiles = []) {
		allSuits.forEach((suitFor7) => {
			allSuits.forEach((suitForSecond7, i) => {
				let newArr = []
				tiles.push(newArr)

				//FFFFF L AA M AA BLE
				newArr.push(createTiles({type: "flower", amount: 5}))
				newArr.push(createTiles({type: suitFor7, value: 7, amount: 1}))

				newArr.push(createTiles({type: "any", value: "any", amount: 2}))

				newArr.push(createTiles({type: "wind", value: "west", amount: 1}))

				newArr.push(createTiles({type: "any", value: "any", amount: 2}))

				newArr.push(createTiles({type: "bamboo", value: "any", amount: 1}))
				newArr.push(createTiles({type: suitForSecond7, value: 7, amount: 1}))
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
				allSuits.forEach((suitFor2, i) => {
					allSuits.forEach((suitFor7, i) => {
						let newArr = []
						tiles.push(newArr)

						//A QQQQQ ALI2E WIN
						newArr.push(createTiles({type: "any", value: "any", amount: 1}))
						newArr.push(createTiles({type: "any", value: "any", amount: 5}))

						newArr.push(createTiles({type: "any", value: "any", amount: 1}))
						newArr.push(createTiles({type: suitFor7, value: 7, amount: 1}))
						newArr.push(createTiles({type: suitFor1, value: 1, amount: 1}))
						newArr.push(createTiles({type: suitFor2, value: 2, amount: 1}))
						newArr.push(createTiles({type: "wind", value: "east", amount: 1}))

						newArr.push(createTiles({type: "wind", value: "west", amount: 1}))
						newArr.push(createTiles({type: suitForSecond1, value: 1, amount: 1}))
						newArr.push(createTiles({type: "wind", value: "north", amount: 1}))
					});
				});
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
			let newArr = []
			tiles.push(newArr)

			//C AA RNI FFFFF ORE
			newArr.push(createTiles({type: "character", value: "any", amount: 1}))

			newArr.push(createTiles({type: "any", value: "any", amount: 2}))

			newArr.push(createTiles({type: "dragon", value: "red", amount: 1}))
			newArr.push(createTiles({type: "wind", value: "north", amount: 1}))
			newArr.push(createTiles({type: suitFor1, value: 1, amount: 1}))

			newArr.push(createTiles({type: "flower", amount: 5}))

			newArr.push(createTiles({type: "dragon", value: "white", amount: 1}))
			newArr.push(createTiles({type: "dragon", value: "red", amount: 1}))
			newArr.push(createTiles({type: "wind", value: "east", amount: 1}))
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
	output.section = "It's a Jungle in Here!"
	return output
})
