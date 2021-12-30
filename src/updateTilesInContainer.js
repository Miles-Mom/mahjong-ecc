//Update the tiles in a container without re-rendering them all
//Ignores non-image elements, however appends new image elements to END.
//So it works for the wall, with the prefix for number of tiles, but wouldn't work with a postfix.

//This code does NOT work for user hands, as they include too much custimization (seperating matches, animating newly drawn tile, etc)
function updateTilesInContainer(container, tiles) {
	let containerImages = [...container.querySelectorAll("img")] //Use [...NodeList] to convert NodeList to standard array.

	while (containerImages.length > tiles.length) {
		containerImages.pop().remove() //Remove from list and from page.
	}

	tiles.forEach((tile, index) => {
		let refElem = tile.createImageElem({
			gameStyle: stateManager?.lastState?.message?.settings?.gameStyle
		})

		let current = containerImages[index]
		if (current) {
			//We could make the tile transparent if src changes, then make opaque again once it finishes loading,
			//however the flashing this can create is probably more damaging than the slightly delay in updates that could happen.
			//People don't stare at the discard pile looking for sudden changes. It isn't really a problem if a tile takes half a second to update occasionally.
			current.src = refElem.src
			current.title = refElem.title
		}
		else {
			container.appendChild(refElem)
		}
	})
}

module.exports = {updateTilesInContainer}
