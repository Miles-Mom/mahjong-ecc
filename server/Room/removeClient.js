function removeClient(clientId, explaination = "You left the room. ") {
	let clientIdIndex = this.clientIds.findIndex((currentClientId) => {return currentClientId === clientId})
	if (clientIdIndex === -1) {
		return "Client Not Found"
	}
	else {
		this.clientIds.splice(clientIdIndex, 1)
		if (this.hostClientId === clientId) {
			//Choose a new host client. Make sure NOT to pick a bot.
			this.hostClientId = null;
			this.clientIds.forEach(((clientId) => {
				if (this.hostClientId) {return}
				if (!globalThis.serverStateManager.getClient(clientId).isBot) {
					this.hostClientId = clientId
				}
			}).bind(this))
		}
		this.sendStateToClients()

		let clientBeingKicked = globalThis.serverStateManager.getClient(clientId)
		if (clientBeingKicked) {
			clientBeingKicked.message("roomActionLeaveRoom", explaination, "success")
			//The client is going to change their client Id. We can now delete the old client.
			globalThis.serverStateManager.deleteClient(clientId)
		}
		if (this.hostClientId === null) {
			//We have no clients. Delete this room.
			//Note that this code shouldn't be called, unless there is a bug or lag. The client will not show the Leave Room button if they are the
			//only player and host (which they should be if they are the only player), and therefore roomActionCloseRoom will be sent instead.
			this.clientIds.forEach((clientId, i) => {
				//Delete any bots. 
				globalThis.serverStateManager.deleteClient(clientId)
			});
			globalThis.serverStateManager.deleteRoom(this.roomId)
		}
	}
}

module.exports = removeClient
