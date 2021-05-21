let windOrder = ["north", "east", "south", "west"]

function getBackwardsDistance(placerWind, throwerWind) {
	//total is the distance backwards from the placer to the thrower.
	let i = windOrder.indexOf(placerWind)
	let total = 0;
	while (windOrder[i] !== throwerWind) {
		total++;
		i--;
		if (i===-1) {
			i=windOrder.length-1
		}
	}
	return total
}

module.exports = getBackwardsDistance
