const Tile = require("../../src/Tile.js")
const TileContainer = require("../../src/TileContainer.js")
const Wall = require("../../src/Wall.js")
const calculateJokerAmount = require("../../src/Hand/calculateJokerAmount.js")

//https://stackoverflow.com/a/30551462/10965456
function permutations(xs) {
  if (!xs.length) return [[]];
  return xs.flatMap((x, i) => {
     return permutations(xs.filter((v, j) => i!==j)).map(vs => [x, ...vs]);
  });
}

//Generate all possible pairs for array arr
function getPairs(arr, pairs = []) {
    let pairingItem = arr.pop()
    pairs.push([pairingItem, pairingItem])
    if (arr.length === 0) {return}
    arr.forEach((item) => {
        pairs.push([pairingItem, item])
    })
    getPairs(arr, pairs)
    return pairs
}

let tileCache = {} //We'll use references to the same exact tile. It's slightly faster, and isn't an issue.
function createTiles({type, value, amount}) {
    if (!tileCache[type]) {tileCache[type] = {}}

    if (!tileCache[type][value]) {
        tileCache[type][value] = new Tile({type, value})
    }

	return new Array(amount).fill(tileCache[type][value])
}

var allSuits = ["bamboo", "character", "circle"]
var allSuitArrangements = permutations(allSuits)
var oddOptions = [1,3,5,7,9]
var evenOptions = [2,4,6,8]
var allOptions = oddOptions.concat(evenOptions).sort()
var windOptions = ["north", "east", "west", "south"]

//Dragons are associated with a suit.
var dragonOptions = ["red", "green", "white"]
var dragonArrangments = permutations(dragonOptions)
var suitDragonConversion = {
	"character": "red",
	"bamboo": "green",
	"circle": "white"
}

var windArrangments = permutations(windOptions)

function processHand(handOption, hand, options) {

    let canFillJoker = []
    let noFillJoker = []
    let anyValueSingletons = []

    for (let handOptionIndex=0;handOptionIndex<handOption.tiles.length;handOptionIndex++) {
        let item = handOption.tiles[handOptionIndex]

        let anyType = (item[0].type === "any")
        let anyValue = (item[0].value === "any")


        if (!options.onlyExactMatch) {
            if (item.length === 1 && anyType && anyValue) {
                continue; //Do nothing - this tile can be, quite literally, anything.
            }
            if (item.length === 1 && anyValue) {
                //TODO: Another complication - there may be cases where we need to use an excess joker in order to fill an "any" spot.
                //This anyValue category probably isn't perfect, in that a human should be able to do some things better in weird circumstances.

                //This tile is a specific suit, but can be any value (1-9)
                //Add to noFillJoker AFTER everything else.
                anyValueSingletons.push(...item)
                continue;
            }
            if (item.length > 1 && (anyType || anyValue)) {
                let uniqueTiles = []
                hand.forEach((handItem) => {
                    let tile;
                    if (handItem.tiles) {handItem = handItem.tiles} //TileContainer.
                    if (handItem instanceof Array) {tile = TileContainer.findBaseTile(handItem)}
                    else {tile = handItem}

                    if (tile.type === "any" || tile.value === "any") {return false} //We are simulating all possible tiles. Any tiles are not a tile.
                    if (!item[0].matches(tile, true)) {return false} //If this "any" selector does not match the tile, continue - any bamboo should not match characters.

                    let isUnique = !(uniqueTiles.some((uniqueTile) => {
                        return uniqueTile.matches(tile)
                    }))

                    if (isUnique) {
                        uniqueTiles.push(tile)
                    }
                })

                //Now for every unique tile, simulate this hand.
                let results = []
                for (let i=0;i<uniqueTiles.length;i++) {
                    let simHandOption = Object.assign({}, handOption) //Clone our hand option.
                    let simTiles = simHandOption.tiles.slice(0) //Clone the tiles
                    simTiles[handOptionIndex] = new Array(item.length).fill(uniqueTiles[i]) //Replace this "any" item with the simulated tiles.
                    simHandOption.tiles = simTiles //Swap in our simulated tiles.
                    let res = processHand(simHandOption, hand, options)
                    if (res instanceof Array) {
                        results.push(...res)
                    }
                    else if (res) {
                        results.push(res)
                    }
                }

                //TODO: Right now, we return all possible combos. We may want to begin rendering these an any pair, any tile, etc, instead, and return the best, with the anys swapped back in.
                //results.sort((a, b) => {return a.diff - b.diff})
                return results//[0]
            }
        }

        if (item.length <= 2 && item[0].type !== "joker") {
            noFillJoker.push(...item)
        }
        else {
            canFillJoker.push(...item)
        }
    }


    noFillJoker.push(...anyValueSingletons)

    let jokerCount = 0
    let diff;
    let exposedMatches = 0 //May not be used anymore - was supposed to be used to detect where concealed hands were an issue.

    let notUsed = [] //Used to return which tiles should be thrown for this hand. TODO: This slows things down quite a bit.

    //We need TileContainers and Arrays to be processed first, as those can't be discarded.
    function removeItem(item) {
        if (item.type === "joker") {
            ++jokerCount
            return true
        }

        //TODO: The splice and search should be able to be optimized.
        let noFillIndex = noFillJoker.findIndex((tile) => {return tile.matches(item)})
        if (noFillIndex !== -1) {
            noFillJoker.splice(noFillIndex, 1)
            return true
        }

        let canFillIndex = canFillJoker.findIndex((tile) => {return tile.matches(item)})
        if (canFillIndex !== -1) {
            canFillJoker.splice(canFillIndex, 1)
            return true
        }

        //TODO: This is slower than it needs to be. It's duplicative. Try to merge with noFillIndex.
        noFillIndex = noFillJoker.findIndex((tile) => {return tile.matches(item, !options.onlyExactMatch)})
        if (noFillIndex !== -1) {
            noFillJoker.splice(noFillIndex, 1)
            return true
        }

        return false
    }

    processHandItems:
    for (let i=0;i<hand.length;i++) {
        let handItem = hand[i]

        if (handItem instanceof TileContainer) {handItem = handItem.tiles}
        if (handItem instanceof Array) {
            if (handOption.concealed === true) {
                //Tiles are exposed! Label this! We'll check later to verify too much isn't exposed.
                exposedMatches++
            }

            //Like in the 2021 card, with 2021 #3, it is possible for the same tile to be used in multiple different
            //matches - therefore, we must verify that such a match exists in the target hand.
            //TODO: 2021 #3 still has issues - we remove the kong from noFillJoker instead of canFillJoker,
            //and we also would take a kong when possible, yet a kong makes the hand dead (need 1+ jokers in kong)

            let itemValue = TileContainer.isValidMatch(handItem, true) //True to allow jokers when matching.

            if (handOption.tiles.some((item) => {
                if (!itemValue) {return true} //This exposure must be a bunch of individual tiles, like a 2019.
                else if (item.length === handItem.length && itemValue.matches(TileContainer.findBaseTile(item))) {
                    return true
                }
                else {return false}
            })) {
                //It exists! Now remove the tiles.

                for (let i=0;i<handItem.length;i++) {
                    let tile = handItem[i]

                    if (tile.type === "joker") {
                        //The jokers in this match are acting as something. (It must be a pong, kong, etc, to have jokers)
                        tile = itemValue
                    }
                    if (!removeItem(tile)) {
                        diff = Infinity //The hand is impossible with current exposures.
                        break processHandItems;
                    }
                }
            }
            else {
                diff = Infinity
                break processHandItems;
            }
        }
    }

    let exposedJokerAmount = 0;
    if (handOption.maxJokers !== undefined) {
        //Pass true to compute exposed jokers only.
        exposedJokerAmount = calculateJokerAmount(hand, true)

        if (exposedJokerAmount > handOption.maxJokers) {
            diff = Infinity //The hand is impossible with current exposures.
            return
        }
    }

    if (diff !== Infinity) {
        for (let i=0;i<hand.length;i++) {
            let handItem = hand[i]

            if (handItem instanceof TileContainer || handItem instanceof Array) {}
            else {
                if (!removeItem(handItem)) {
                    notUsed.push(handItem) //TODO: If we have a joker acting as this item, put it at the beginning.
                }
            }
        }

        diff = noFillJoker.length + Math.max(0, canFillJoker.length - Math.min(jokerCount, (handOption.maxJokers ?? Infinity) - exposedJokerAmount))

        //This check doesn't work when analyzing for duplicate removal. Therefore, we check options.skipConcealedCheck
        if (!options.skipConcealedCheck && handOption.concealed && !(exposedMatches === 0 || (exposedMatches === 1 && diff === 0))) {
            diff = Infinity
            return;
        }

        //Add jokers that we aren't using to fill anything
        //We could take a different approach - attempt to use every joker, and discard the actual tile first,
        //however the current approach, while making recovery plans worse (discards jokers that we could keep),
        //increases the odds of no joker point doubles (compared to discarding the actual tile and stashing jokers).
        if (jokerCount > canFillJoker.length) {
            notUsed.push(new Tile({type: "joker", value: ""}))
            jokerCount--
        }

        return {
            diff, handOption, noFillJoker, canFillJoker, notUsed, jokerCount
        }
    }
}

function getTileDifferential(handOptions, hand, options = {}) {
    //options.skipConcealedCheck - default false. If true, we don't check if concealed hands are impossible due to exposures.
    //options.onlyExactMatch - "Any" only matches other "Any"s. Should be true if the input hand can contain "any"s (like for duplicate removal)

	//getTileDifferential takes an array of tiles are determines how many tiles away hand is
	//from every achivable handOption (TODO: Allow passing remaining wall tiles / already exposed tiles)

    //TODO: Eliminate hands if they are impossible based on currently discarded tiles and current exposures.
    //Doing this perfectly is nearly impossible, but improvements would be nice:
    // - Detect when current exposures make non-joker tiles unobtainable.
    // - Jokers (especially for quints) are complicated, because of joker swaps. Detecting when a hand is dead because
    //jokers are needed given present exposures, and said jokers can't be obtained (tiles to swap for exposed jokers dead, etc)

	if (handOptions.combos) {
		//A card was passed, instead of an array.
		handOptions = handOptions.combos
	}

    let results = []
    //Passing an array of handOptions.
    for (let i=0;i<handOptions.length;i++) {
        let handOption = handOptions[i]

        let res = processHand(handOption, hand, options)
        if (res instanceof Array) {
            results.push(...res)
        }
        else if (res) {results.push(res)}
    }


	results = results.sort((function(a,b) {
		//Some hands can be Mahjong in multiple different ways, with differing point values (Example: 2020 card, Quints #3, 13579 #1).
		//Therefore, we should sort, in case one hand is more valuable.

		//TODO: These penalties should be lower earlier in charleston.

		//Apply some weighting to reduce the overuse of concealed and jokerless hands.
		let uncallablePenalty = 0.15 //Point penalty per unfilled spot that can't be called for.
		let noJokerPenalty = 0.15 //Point penalty per unfilled spot that requires a non-joker.

		//TODO: We need small penalties against quints, which require jokers.

		let diffA = a.diff
		let diffB = b.diff

		//Give a benefit for hands where we can call for tiles.
		//TODO: Penalize singular remaining tiles less than pairs.
		//TODO: Penalize for callable but not now (ex, need more jokers/tiles before it can be called), vs never callale.
        //TODO: Penalize less for semi-any tiles (any bamboo, etc)

		function getUncallableTiles(hand) {
			//This function is called so much it is insanely expensive. Cache per hand.

			//Can call for the last tile, so minus 1
			if (hand.handOption.concealed) {
				return Math.max(0, hand.diff - 1) //Diff excludes joker-replacable tiles.
			}
			else if (hand.uncallableTiles === undefined) {
				let uncallableMatches = hand.handOption.tiles.filter((item) => {return item.length < 3})

				function _calculateUncallableTiles(tiles) {
					let sum = 0;
					for (let i=0;i<tiles.length;i++) {
						let tile = tiles[i]
						if (uncallableMatches.some((match) => {
							return tile.matches(match[0])
						})) {sum++}
					}
					return sum
				}

				//We won't penalize for joker replaced tiles - those are, in effect, already in hand.
				let uncallableTiles = _calculateUncallableTiles(hand.noFillJoker) + Math.max(0, _calculateUncallableTiles(hand.canFillJoker) - hand.jokerCount)

				hand.uncallableTiles = Math.max(0, uncallableTiles - 1)
			}
			return hand.uncallableTiles
		}

		diffA += getUncallableTiles(a) * uncallablePenalty
		diffB += getUncallableTiles(b) * uncallablePenalty

		//Give a penalty to the hands that need non-joker tiles.
		diffA += a.noFillJoker.length * noJokerPenalty
		diffB += b.noFillJoker.length * noJokerPenalty

        //We'll apply a reduced noJokerPenalty for hands with maximum joker amounts.
        if (a.handOption.maxJokers !== undefined) {
            diffA += Math.max(0, a.canFillJoker.length - a.handOption.maxJokers) * noJokerPenalty / 1.5
        }
        if (b.handOption.maxJokers !== undefined) {
            diffB += Math.max(0, b.canFillJoker.length - b.handOption.maxJokers) * noJokerPenalty / 1.5
        }

		//For Debugging and Analysis.
		a.weightedDiff = diffA
		b.weightedDiff = diffB

		if (diffA !== diffB) {return diffA - diffB} //Sort by closest to Mahjong

		return b.handOption.score - a.handOption.score //Sort by score.
	}))
	return results
}


function outputExpander(combos, options = {}) {
	console.time("Expand")
	let output = []

	let duplicatesRemoved = 0

	combos.forEach((combo) => {
		//combo composes all the possibilities that one item on the card can be
		let comboOutput = []
		combo.tiles.forEach((tileCombo) => {
			//Create a seperate object for each possibility
			let obj = Object.assign({}, combo)
			obj.tiles = tileCombo

            let totalLength = 0

            obj.tileValueSum = 0 //Used to accelarate duplicate removal
            obj.tiles.forEach((arr) => {
                totalLength += arr.length
                obj.tileValueSum += arr[0].getTileValue(true) * arr.length
            })

            //Verify input was the correct length.
            if (totalLength !== 14) {
                console.error(obj.tiles)
                throw "Invalid Combo"
            }

			comboOutput.push(obj)
		})

		//Combos might include duplicate outputs - while they wouldn't if they were ideally designed, they are often
        //easier to write with duplicates.

		//We don't currently check for duplicate outputs outside of combos. That is possible in some cases,
        //especially with Marvelous, however they really aren't the same combo then (as it is Mahjong two different ways)

        //TODO: This can still be a bit slow, and is still quadratic.
		if (!combo.skipDuplicateRemoval) {
			let uniqueCombos = []
			for (let i=0;i<comboOutput.length;i++) {
				let combo = comboOutput[i]

                let isDuplicate = uniqueCombos.some((uniqueCombo) => {
                    //Two identical combos must have the same tileValueSum, however identical tileValueSums do not mean identical combos.
                    if (uniqueCombo.tileValueSum !== combo.tileValueSum) {return false}
                    return getTileDifferential([uniqueCombo], combo.tiles, {
                        skipConcealedCheck: true,
                        onlyExactMatch: true
                    })[0]?.diff === 0
                })

            	if (isDuplicate) {
					duplicatesRemoved++
				}
				else {
					uniqueCombos.push(combo)
				}
			}
            comboOutput = uniqueCombos
		}
		else {
			//Marvelous hands easily blow the duplicate remover to pieces. It's quadratic.
			console.warn("Skipping Duplicate Removal")
			delete combo.skipDuplicateRemoval
		}

        for (let i=0;i<comboOutput.length;i++) {
            delete comboOutput[i].tileValueSum
            delete comboOutput[i].skipDuplicateRemoval //TODO: This property should probably never be set on expanded outputs.
        }
        output.push(...comboOutput)
	})
	console.timeEnd("Expand")
	if (duplicatesRemoved) {
		console.warn("Removed " + duplicatesRemoved +  " Duplicate Combos")
	}

	return output
}

let nonJokerTiles = Wall.getNonPrettyTiles(1)
nonJokerTiles.push(new Tile({type: "flower"}))

let allTiles = nonJokerTiles.slice(0)
allTiles.push(new Tile({type: "joker"})) //TODO: Test with these - could be weird.

module.exports = {getPairs, allTiles, nonJokerTiles, createTiles, allSuits, allSuitArrangements, oddOptions, evenOptions, allOptions, windOptions, windArrangments, dragonOptions, dragonArrangments, suitDragonConversion, outputExpander, getTileDifferential, permutations}
