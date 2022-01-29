function onIncomingMessage(clientId, obj) {
	let client = globalThis.serverStateManager.getClient(clientId)
	let isHost = (clientId === this.hostClientId)

	if (obj.type === "roomActionLeaveRoom") {
		return this.removeClient(clientId)
	}
	if (obj.type === "roomActionGetMessageHistory") {
		return client.message(obj.type, client.messageHistory)
	}
	else if (obj.type === "roomActionKickFromRoom") {
		//Only the host can kick, and only if the game has not started.
		if (!isHost) {
			console.log(client)
			console.log(client.message)
			return client.message(obj.type, "Only Host Can Kick", "error")
		}
		if (this.inGame) {
			return client.message(obj.type, "Can't Kick During Game", "error")
		}
		this.removeClient(obj.id, "You have been kicked from the room. ") //obj.id is the id of the user to kick.
		return client.message(obj.type, "Kicked Client", "success")
	}
	else if (obj.type === "roomActionStartGame") {
		if (!isHost) {
			return client.message("displayMessage", {title: "Error Starting Game", body: "Only Host Can Start"})
		}
		if (this.inGame) {
			return client.message("displayMessage", {title: "Error Starting Game", body: "Already in Game"})
		}

		//Time to start the game.
		let res = this.startGame(obj)
		if (res) {
			return client.message("displayMessage", res)
		}
		return
	}
	else if (obj.type === "roomActionEndGame") {
		//Anybody can end the game, as they could do the same going AFK.
		if (!this.inGame) {
			return client.message(obj.type, "No Game In Progress", "error")
		}
		if (this.clientIds.indexOf(clientId) > 3) {
			return this.removeClient(clientId)
		}
		this.endGame(obj, clientId) //Clientid is an optional parameter.
	}
	else if (obj.type === "roomActionCloseRoom") {
		if (!isHost) {
			return client.message(obj.type, "Only Host Can Close Room", "error")
		}

		let hostClientId = this.hostClientId //Host may change as people are removed.

		this.clientIds.slice(0).forEach((clientId) => {
			if (clientId !== hostClientId) {
				//Clone array to avoid shifting.
				this.removeClient(clientId, "The room has been closed. ")
			}
		})
		this.removeClient(hostClientId, "You closed the room. ")
		globalThis.serverStateManager.deleteRoom(this.roomId)
	}
	else if (obj.type === "roomActionPlaceTiles") {
		//Action to place tiles.
		//Only current turn user can place.
		return this.onPlace(obj, clientId)
	}
	else if (obj.type === "roomActionAddBot") {
		if (!isHost) {
			return client.message(obj.type, "Only Host Can Add Bots", "error")
		}
		return this.addBot(obj)
	}
	else if (obj.type === "roomActionRevertState") {
		if (this.clientIds.indexOf(clientId) > 3) {
			return client.message("displayMessage", {title: "Access Denied", body: "You are Spectating. "})
		}
		//revertState takes client, as it needs to get the name of the person reverting to notify other players.
		return this.revertState(client, obj.message)
	}
	else if (obj.type === "roomActionState") {
		return client.message(obj.type, this.getState(clientId), "success")
	}
	else if (obj.type === "roomActionChangeNickname") {
		let message; //Message will remain undefined if the user does not have permission to rename.
		let target = globalThis.serverStateManager.getClient(obj.targetId)

		if (obj.targetId === clientId) {
			message = target.getNickname() + " renamed to " + obj.nickname
		}
		else if (isHost) {
			message = "The host renamed " + target.getNickname() + " to " + obj.nickname
		}

		if (message) {
			target.setNickname(obj.nickname)
			this.messageAll([clientId], "roomActionGameplayAlert", message, "success" )
			this.sendStateToClients()
		}
		return
	}
}

module.exports = onIncomingMessage
