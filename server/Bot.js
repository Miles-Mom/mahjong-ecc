const Client = require("./Client.js")
const handleMessage = require("./Bot/handleMessage.js")
class Bot extends Client {
	constructor(clientId, websocket) {
		super(clientId, websocket)
	}

	isBot = true

	message(type, message, status) {
		if (this.suppressed) {return} //Isn't really neccessary, as the bot should never receive roomActionState while suppressed, however a good measure.

		if (this.websocket) {
			//Bot being manually controlled.
			super.message(type, message, status)
		}

		handleMessage.call(this, {type, message, status})
	}
}

module.exports = Bot
