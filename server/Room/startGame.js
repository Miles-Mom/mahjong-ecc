const Wall = require("../../src/Wall.js")
const Hand = require("../../src/Hand.js")
const fs = require("fs")
const path = require("path")

function startGame(obj) {
	if (this.clientIds.length < 4) {return "Not Enough Clients"}
	else {
		this.inGame = true
		this.messageAll([], obj.type, "Game Started", "success")

		//Set settings
		//TODO: This is probably the best default. We want a setting.
		this.state.settings.charleston = [
			[
				{
					direction: "across",
				},
				{
					direction: "right",
				},
				{
					direction: "left",
					//TODO: Allow Blind?
				}
			]
		]


		this.state.settings.botSettings = this.state.settings.botSettings || {}
		this.state.settings.botSettings.canCharleston = obj?.settings?.botSettings?.canCharleston ?? false

		this.state.settings.windAssignments = this.state.settings.windAssignments || {}

		this.state.settings.checkForCalling = obj?.settings?.checkForCalling ?? true

		if (["chinese", "american"].includes(obj?.settings?.gameStyle)) {
			this.state.settings.gameStyle = obj?.settings?.gameStyle
		}
		else {this.state.settings.gameStyle = "chinese"}

		if (!isNaN(obj?.settings?.maximumSequences)) {
			this.state.settings.maximumSequences = Math.max(0, Math.round(Number(obj?.settings?.maximumSequences)))
		}
		else {
			this.state.settings.maximumSequences = 4
		}

		//Build the wall.
		this.state.seed = this.state.seed || Math.random()

		if (this.state.settings.gameStyle === "chinese") {
			this.gameData.wall = new Wall(this.state.seed)
		}
		else if (this.state.settings.gameStyle === "american") {
			this.gameData.wall = new Wall(this.state.seed, {
				prettysAsTiles: true,
				includeJokers: 8
			})
			this.state.settings.checkForCalling = false

			this.state.settings.charleston = [
				[
					{
						direction: "right",
					},
					{
						direction: "across",
					},
					{
						direction: "left",
						blind: true
					}
				],
				[
					{
						direction: "left",
						allAgree: true
					},
					{
						direction: "across",
					},
					{
						direction: "right",
						blind: true
					}
				],
				[
					{
						direction: "across",
						blind: true
					}
				]
			]


			let cardOptionsToScript = {
				"2020 National Mahjongg League": "../american/2020.js",
				"2021 National Mahjongg League": "../american/2021.js"
			}

			this.state.settings.card = cardOptionsToScript[obj?.settings?.card] || cardOptionsToScript["2020 National Mahjongg League"]
			this.gameData.card = require(this.state.settings.card)

			console.log(this.gameData.card)

			this.gameData.charleston = {
				directions: this.state.settings.charleston.slice(0)
			}

			this.state.settings.americanBotDifficulty = Number(obj?.settings?.americanBotDifficulty) || 100 //Percentage of card bots can use.
			console.log("Bot Difficulty: " + this.state.settings.americanBotDifficulty)
		}
		else {throw "Unknown gameStyle"}

		this.state.hostClientId = this.hostClientId
		this.state.moves = []

		this.logFile = fs.createWriteStream(path.join(global.stateManager.serverDataDirectory, this.roomId + "-" + Date.now() + ".room"))

		this.gameData.discardPile = []
		this.gameData.playerHands = {}

		//Build the player hands.
		//For now, we will randomly assign winds.

		//windAssignments is clientId: wind
		let winds = ["north", "east", "south", "west"]
		let windAssignments = {}

		for (let clientId in this.state.settings.windAssignments) {
			let wind = this.state.settings.windAssignments[clientId]

			if (this.clientIds.includes(clientId)) {
				let windIndex = winds.indexOf(wind)
				//If two clientIds have the same wind, we need to exclude one.
				if (windIndex !== -1) {
					winds.splice(windIndex, 1)
					windAssignments[clientId] = wind
				}
			}
		}

		this.clientIds.slice(0, 4).forEach((clientId) => {
			if (!windAssignments[clientId]) {
				windAssignments[clientId] = winds.splice(Math.floor(Math.random() * winds.length), 1)[0]
			}
		})

		console.log(windAssignments)

		let eastWindPlayerId;
		for (let clientId in windAssignments) {
			console.log(clientId)
			let wind = windAssignments[clientId]

			let hand = new Hand({wind})
			this.gameData.playerHands[clientId] = hand

			let tileCount = 13
			if (wind === "east") {
				eastWindPlayerId = clientId
				tileCount = 14
			}
			for (let i=0;i<tileCount;i++) {
				this.drawTile(clientId, true)
			}
		}

		this.state.settings.windAssignments = windAssignments
		console.log(this.state.settings.windAssignments)

		this.gameData.currentTurn = {
			thrown: false,
			userTurn: eastWindPlayerId
		}

		this.gameData.currentTurn.turnChoices = new Proxy({}, this.turnChoicesProxyHandler);
		this.logFile.write(JSON.stringify(this.state) + "\n")

		//Message East about how to start.
		if (this.state.settings.gameStyle === "chinese") {
			this.setInstructions(this.gameData.currentTurn.userTurn, "As East wind, you get to make the first throw. Select one tile and press Proceed.\n\nTo initiate a Charleston, select 3 tiles and hit Proceed.")
			this.setAllInstructions([this.gameData.currentTurn.userTurn], "Waiting on East Wind to make a play. ")
		}
		else if (this.state.settings.gameStyle === "american") {
			this.setAllInstructions([], "Welcome to the Charleston. Select 3 tiles you would like to pass " + this.gameData.charleston.directions[0][0].direction + ", then hit Proceed. " , "success")
		}

		this.sendStateToClients()
	}
}

module.exports = startGame
