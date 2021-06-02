function calculateJokerAmount(items, exposed) {
	//Do not pass exposed to calculate all jokers.
	//Pass false for in hand only, true for exposed only.
	//We can't use the joker count from getTileDifferential, as that treats exposesd tiles like the jokers they act for.
	let allTiles = []

	items.forEach((item) => {
		if (item instanceof Tile) {
			if (exposed !== true) {
				allTiles.push(item)
			}
		}
		else if (exposed !== false) {
			allTiles.push(...item.tiles)
		}
	})

	return allTiles.reduce((total, tile) => {
		if (tile.type === "joker") {return ++total}
		return total
	}, 0)
}

module.exports = calculateJokerAmount
