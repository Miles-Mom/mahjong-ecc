function calculateJokerAmount(items) {
	//We can't use the joker count from getTileDifferential, as that treats exposesd tiles like the jokers they act for.
	let allTiles = []

	items.forEach((item) => {
		if (item instanceof Tile) {allTiles.push(item)}
		else {
			allTiles.push(...item.tiles)
		}
	})

	return allTiles.reduce((total, tile) => {
		if (tile.type === "joker") {return ++total}
		return total
	}, 0)
}

module.exports = calculateJokerAmount
