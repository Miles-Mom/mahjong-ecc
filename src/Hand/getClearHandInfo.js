const Sequence = require("../Sequence.js")
const Pretty = require("../Pretty.js")

function getClearHandInfo() {
	let suits = {}
	let honors = false
	let onesAndNines = true

	this.contents.forEach((item) => {
		if (item instanceof Sequence) {
			suits[item.tiles[0].type] = true
			onesAndNines = false
		}
		else if (!(item instanceof Pretty)){
			suits[item.type] = true
			if (!["wind", "dragon"].includes(item.type) && item.value !== 1 && item.value !== 9) {
				onesAndNines = false
			}
		}
	})

	if (suits["wind"] || suits["dragon"]) {
		delete suits["wind"]
		delete suits["dragon"]
		honors = true
	}

	suits = Object.keys(suits).length

	if (honors) {
		if (suits === 0) {
			return {type: "All Honors", doubles: 3}
		}
		else if (suits === 1 && onesAndNines) {
			//Clear two ways, but still only one double :(
			//We'll indicate this so people don't worry we underscored them.
			return {type: "1/9s/Suit + Honors", doubles: 1}
		}
		else if (suits === 1) {
			return {type: "One Suit + Honors", doubles: 1}
		}
		else if (onesAndNines) {
			return {type: "1/9s + Honors", doubles: 1}
		}
	}
	else {
		if (suits === 1) {
			return {type: "All One Suit", doubles: 3}
		}
		else if (onesAndNines) {
			return {type: "All 1/9s", doubles: 3}
		}
	}

	return {type: "Not Clear", doubles: 0}
}

module.exports = getClearHandInfo
