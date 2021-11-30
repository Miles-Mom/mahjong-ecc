const scoreChinese = require("./scoreChinese.js")
const scoreAmerican = require("./scoreAmerican.js")

//This function is bound to the hand object.
module.exports = function score(config = {}) {
	//By default, assume Chinese. We should update old code at some point.
	if (config.type === "american") {
		return scoreAmerican.call(this, config)
	}
	else {
		return scoreChinese.call(this, config)
	}
}
