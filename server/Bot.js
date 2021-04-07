const Client = require("./Client.js")
const handleMessage = require("./Bot/handleMessage.js")
class Bot extends Client {
	constructor(clientId, websocket) {
		super(clientId, websocket)

		this.isBot = true

		let _message = this.message //So we don't lose access to the websocket based sending.

		let lastSent;
		let lastWasError;
		this.message = (function message(type, message, status) {
			if (lastWasError) {lastWasError = false;return} //First bot error disables bot temporarily.

			if (this.suppressed) {return} //Isn't really neccessary, as the bot should never receive roomActionState while suppressed, however a good measure.

			if (this.websocket) {
				//Bot being manually controlled.
				_message(type, message, status)
			}

			handleMessage.call(this, {type, message, status})
		}).bind(this)
	}
}

module.exports = Bot
