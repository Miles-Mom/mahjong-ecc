const {getPairs, allTiles, nonJokerTiles, createTiles, allSuits, allSuitArrangements, oddOptions, evenOptions, allOptions, windOptions, windArrangments, dragonOptions, dragonArrangments, suitDragonConversion, outputExpander, getTileDifferential}
= require("../utilities.js");


//Each function will return an array. Each array will contain every possible matching combo in the form of an array of tiles.
//All 7 hands supported.
module.exports = [
	function(tiles = []) {
		allSuits.forEach((suitFor1) => {
			allSuits.forEach((suitForSecond1, i) => {
				allSuits.forEach((suitFor7, i) => {
					let newArr = []
					tiles.push(newArr)

					//AA F AA NCI FELINE
					newArr.push(createTiles({type: "any", value: "any", amount: 2}))

					newArr.push(createTiles({type: "flower", amount: 1}))

					newArr.push(createTiles({type: "any", value: "any", amount: 2}))

					newArr.push(createTiles({type: "wind", value: "north", amount: 1}))
					newArr.push(createTiles({type: "character", value: "any", amount: 1}))
					newArr.push(createTiles({type: suitFor1, value: 1, amount: 1}))

					newArr.push(createTiles({type: "flower", amount: 1}))
					newArr.push(createTiles({type: "wind", value: "east", amount: 1}))
					newArr.push(createTiles({type: suitFor7, value: 7, amount: 1}))
					newArr.push(createTiles({type: suitForSecond1, value: 1, amount: 1}))
					newArr.push(createTiles({type: "wind", value: "north", amount: 1}))
					newArr.push(createTiles({type: "wind", value: "east", amount: 1}))
				});
			});
		})

		return {
			tiles,
			score: 50,
			concealed: true
		}
	},
	function(tiles = []) {
		allSuits.forEach((suitFor1) => {
			allSuits.forEach((suitForSecond1, i) => {
				allSuits.forEach((suitFor7, i) => {
					allSuits.forEach((suitForSecond7, i) => {
						allSuits.forEach((suitForThird1, i) => {
							let newArr = []
							tiles.push(newArr)

							//A 1DRFL 1DRFL WIN
							newArr.push(createTiles({type: "any", value: "any", amount: 1}))

							newArr.push(createTiles({type: suitFor1, value: 1, amount: 1}))
							newArr.push(createTiles({type: "dragon", value: "any", amount: 1}))
							newArr.push(createTiles({type: "dragon", value: "red", amount: 1}))
							newArr.push(createTiles({type: "flower", amount: 1}))
							newArr.push(createTiles({type: suitFor7, value: 7, amount: 1}))

							newArr.push(createTiles({type: suitForSecond1, value: 1, amount: 1}))
							newArr.push(createTiles({type: "dragon", value: "any", amount: 1}))
							newArr.push(createTiles({type: "dragon", value: "red", amount: 1}))
							newArr.push(createTiles({type: "flower", amount: 1}))
							newArr.push(createTiles({type: suitForSecond7, value: 7, amount: 1}))

							newArr.push(createTiles({type: "wind", value: "any", amount: 1}))
							newArr.push(createTiles({type: suitForThird1, value: 1, amount: 1}))
							newArr.push(createTiles({type: "wind", value: "north", amount: 1}))
						});
					});
				});
			});
		})

		return {
			tiles,
			score: 50,
			concealed: true
		}
	},
	function(tiles = []) {
		allSuits.forEach((suitFor2s) => {
			allSuits.forEach((suitFor1, i) => {
				allSuits.forEach((suitFor7, i) => {
					allSuits.forEach((suitForSecond1, i) => {
						let newArr = []
						tiles.push(newArr)

						//22 FELINE FRENSI
						newArr.push(createTiles({type: suitFor2s, value: 2, amount: 2}))

						newArr.push(createTiles({type: "flower", amount: 1}))
						newArr.push(createTiles({type: "wind", value: "east", amount: 1}))
						newArr.push(createTiles({type: suitFor7, value: 7, amount: 1}))
						newArr.push(createTiles({type: suitFor1, value: 1, amount: 1}))
						newArr.push(createTiles({type: "wind", value: "north", amount: 1}))
						newArr.push(createTiles({type: "wind", value: "east", amount: 1}))

						newArr.push(createTiles({type: "flower", amount: 1}))
						newArr.push(createTiles({type: "dragon", value: "red", amount: 1}))
						newArr.push(createTiles({type: "wind", value: "east", amount: 1}))
						newArr.push(createTiles({type: "wind", value: "north", amount: 1}))
						newArr.push(createTiles({type: "wind", value: "south", amount: 1}))
						newArr.push(createTiles({type: suitForSecond1, value: 1, amount: 1}))
					});
				});
			});
		})

		return {
			tiles,
			score: 50,
			concealed: true
		}
	},
	function(tiles = []) {
		allSuits.forEach((suitFor1, i) => {
			allSuits.forEach((suitFor7, i) => {
				let newArr = []
				tiles.push(newArr)

				//AA CAGED AA NIMAL
				newArr.push(createTiles({type: "any", value: "any", amount: 2}))

				newArr.push(createTiles({type: "character", value: "any", amount: 1}))
				newArr.push(createTiles({type: "any", value: "any", amount: 1}))
				newArr.push(createTiles({type: "dragon", value: "green", amount: 1}))
				newArr.push(createTiles({type: "wind", value: "east", amount: 1}))
				newArr.push(createTiles({type: "dragon", value: "any", amount: 1}))

				newArr.push(createTiles({type: "any", value: "any", amount: 2}))

				newArr.push(createTiles({type: "wind", value: "north", amount: 1}))
				newArr.push(createTiles({type: suitFor1, value: 1, amount: 1}))
				newArr.push(createTiles({type: "wind", value: "west", amount: 1}))
				newArr.push(createTiles({type: "any", value: "any", amount: 1}))
				newArr.push(createTiles({type: suitFor7, value: 7, amount: 1}))
			});
		})

		return {
			tiles,
			score: 50,
			concealed: true
		}
	},
	function(tiles = []) {
		//Since the 1s and 2s are both single tiles, they are interchangable -
		//There is no difference between [bamboo, character] and [character, bamboo]
		//As such, we'll use getPairs, which will prevent this from generating duplicates (generates lots otherwise).
		getPairs(allSuits.slice(0)).forEach(([suitFor1, suitForSecond1]) => {
			getPairs(allSuits.slice(0)).forEach(([suitFor2, suitForSecond2]) => {
				allSuits.forEach((suitFor7s) => {
					allSuits.forEach((suitFor7, i) => {
						allSuits.forEach((suitFor4, i) => {
							let newArr = []
							tiles.push(newArr)

							//CA LL 4 A 2ILE 2 WIN
							newArr.push(createTiles({type: "character", value: "any", amount: 1}))
							newArr.push(createTiles({type: "any", value: "any", amount: 1}))

							newArr.push(createTiles({type: suitFor7s, value: 7, amount: 2}))

							newArr.push(createTiles({type: suitFor4, value: 4, amount: 1}))

							newArr.push(createTiles({type: "any", value: "any", amount: 1}))

							newArr.push(createTiles({type: suitFor2, value: 2, amount: 1}))
							newArr.push(createTiles({type: suitFor1, value: 1, amount: 1}))
							newArr.push(createTiles({type: suitFor7, value: 7, amount: 1}))
							newArr.push(createTiles({type: "wind", value: "east", amount: 1}))

							newArr.push(createTiles({type: suitForSecond2, value: 2, amount: 1}))

							newArr.push(createTiles({type: "wind", value: "west", amount: 1}))
							newArr.push(createTiles({type: suitForSecond1, value: 1, amount: 1}))
							newArr.push(createTiles({type: "wind", value: "north", amount: 1}))
						})
					});
				})
			})
		})

		//Old code: Functionally the same (hands ordered differently by default though),
		//but generates quite a few duplicates.
		// allSuits.forEach((suitFor1, i) => {
		// 	allSuits.forEach((suitFor7, i) => {
		// 		allSuits.forEach((suitFor2, i) => {
		// 			allSuits.forEach((suitFor4, i) => {
		// 				allSuits.forEach((suitForSecond1, i) => {
		// 					allSuits.forEach((suitForSecond7, i) => {
		// 						allSuits.forEach((suitForSecond2, i) => {
		// 							let newArr = []
		// 							tiles.push(newArr)
		//
		// 							//CA LL 4 A 2ILE 2 WIN
		// 							newArr.push(createTiles({type: "character", value: "any", amount: 1}))
		// 							newArr.push(createTiles({type: "any", value: "any", amount: 1}))
		//
		// 							newArr.push(createTiles({type: suitFor7, value: 7, amount: 2}))
		//
		// 							newArr.push(createTiles({type: suitFor4, value: 4, amount: 1}))
		//
		// 							newArr.push(createTiles({type: "any", value: "any", amount: 1}))
		//
		// 							newArr.push(createTiles({type: suitFor2, value: 2, amount: 1}))
		// 							newArr.push(createTiles({type: suitFor1, value: 1, amount: 1}))
		// 							newArr.push(createTiles({type: suitForSecond7, value: 7, amount: 1}))
		// 							newArr.push(createTiles({type: "wind", value: "east", amount: 1}))
		//
		// 							newArr.push(createTiles({type: suitForSecond2, value: 2, amount: 1}))
		//
		// 							newArr.push(createTiles({type: "wind", value: "west", amount: 1}))
		// 							newArr.push(createTiles({type: suitForSecond1, value: 1, amount: 1}))
		// 							newArr.push(createTiles({type: "wind", value: "north", amount: 1}))
		// 						});
		// 					});
		// 				});
		// 			});
		// 		});
		// 	});
		// })

		return {
			tiles,
			score: 50,
			concealed: true
		}
	},
	function(tiles = []) {
		allSuitArrangements.forEach((suitOrder) => {
			//34.5947N 83.2639W
			let newArr = []
			tiles.push(newArr)

			newArr.push(createTiles({type: suitOrder[0], value: 3, amount: 1}))
			newArr.push(createTiles({type: suitOrder[0], value: 4, amount: 1}))
			newArr.push(createTiles({type: suitOrder[0], value: 5, amount: 1}))
			newArr.push(createTiles({type: suitOrder[0], value: 9, amount: 1}))
			newArr.push(createTiles({type: suitOrder[0], value: 4, amount: 1}))
			newArr.push(createTiles({type: suitOrder[0], value: 7, amount: 1}))
			newArr.push(createTiles({type: "wind", value: "north", amount: 1}))


			newArr.push(createTiles({type: suitOrder[1], value: 8, amount: 1}))
			newArr.push(createTiles({type: suitOrder[1], value: 3, amount: 1}))
			newArr.push(createTiles({type: suitOrder[1], value: 2, amount: 1}))
			newArr.push(createTiles({type: suitOrder[1], value: 6, amount: 1}))
			newArr.push(createTiles({type: suitOrder[1], value: 3, amount: 1}))
			newArr.push(createTiles({type: suitOrder[1], value: 9, amount: 1}))
			newArr.push(createTiles({type: "wind", value: "west", amount: 1}))
		})

		return {
			tiles,
			score: 50,
			concealed: true
		}
	},
	function(tiles = []) {
		allSuits.forEach((suitFor1, i) => {
			allSuits.forEach((suitFor2, i) => {
				allSuits.forEach((suitFor4, i) => {
					//RING MAS2R 4 2022
					let newArr = []
					tiles.push(newArr)

					newArr.push(createTiles({type: "dragon", value: "red", amount: 1}))
					newArr.push(createTiles({type: suitFor1, value: 1, amount: 1}))
					newArr.push(createTiles({type: "wind", value: "north", amount: 1}))
					newArr.push(createTiles({type: "dragon", value: "green", amount: 1}))

					newArr.push(createTiles({type: "wind", value: "west", amount: 1}))
					newArr.push(createTiles({type: "any", value: "any", amount: 1}))
					newArr.push(createTiles({type: "wind", value: "south", amount: 1}))
					newArr.push(createTiles({type: suitFor2, value: 2, amount: 1}))
					newArr.push(createTiles({type: "dragon", value: "red", amount: 1}))

					newArr.push(createTiles({type: suitFor4, value: 4, amount: 1}))

					//2022
					newArr.push(createTiles({type: "character", value: 2, amount: 1}))
					newArr.push(createTiles({type: "dragon", value: "white", amount: 1}))
					newArr.push(createTiles({type: "bamboo", value: 2, amount: 1}))
					newArr.push(createTiles({type: "circle", value: 2, amount: 1}))
				});
			});
		});

		return {
			tiles,
			score: 75,
			concealed: true
		}
	},
].map((func, index) => {
	let output = func()
	output.cardIndex = index
	output.section = "Crack The Whip"
	return output
})
