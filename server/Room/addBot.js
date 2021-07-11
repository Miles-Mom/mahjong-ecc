function addBot(obj = {}) {
	//Create a clientId for the bot.
	let client = globalThis.serverStateManager.createBot()

	if (obj.botName) {client.setNickname(obj.botName)}
	else {
		try {
			//This should never error, but an error isn't a problem here. 
			//Set bot nickname to Bot 1, Bot 2, etc.
			let currentNames = this.clientIds.map((clientId) => {return global.serverStateManager.getClient(clientId).getNickname()})
			for (let i=1;;i++) {
				let name = `Bot ${i}`
				if (!currentNames.includes(name)) {
					client.setNickname(name)
					break
				}
			}
		}
		catch (e) {console.error(e)}
	}
	client.setRoomId(this.roomId)

	this.addClient(client.clientId)
	this.sendStateToClients()
}

module.exports = addBot
