const Wall = require("../../src/Wall.js")
const Hand = require("../../src/Hand.js")

const cards = require("../american/cards.js")

//Note that these native modules will be empty objects in the browser!
const path = require("path")
const fs = require("fs")

function startGame(obj) {
	while (this.clientIds.length < 4) {
		this.addBot()
	}

	if (obj?.settings?.gameStyle === "panama") {
		//Panama Rules is a specific variant of Chinese rules.
		obj.settings = {
			gameStyle: "chinese",
			checkForCalling: true,
			allow4thTilePickup: true,
			botSettings: {canCharleston: true},
			maximumSequences: 1,
		}
	}

	if (["chinese", "american"].includes(obj?.settings?.gameStyle)) {
		this.state.settings.gameStyle = obj?.settings?.gameStyle
	}
	else {
		return {
			title: "Please Select Variant",
			body: "You must select a game variant to play. "
		}
	}

	this.inGame = true
	this.messageAll([], obj.type, "Game Started", "success")

	//Set settings
	//TODO: The charleston setting array is modified, so the settings is useless, as after the charleston, it is an empty array.
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
				//TODO: Allow Blind?
			}
		]
	]


	this.state.settings.botSettings = this.state.settings.botSettings || {}

	this.state.settings.disableHints = obj?.settings?.disableHints || false

	this.state.settings.botSettings.canCharleston = obj?.settings?.botSettings?.canCharleston ?? false

	this.state.settings.windAssignments = this.state.settings.windAssignments || {}

	this.state.settings.checkForCalling = obj?.settings?.checkForCalling ?? true

	this.state.settings.tableLimit = Number(obj?.settings?.tableLimit) || Infinity //Default Infinity - || as 0 should mean infinity.

	this.state.settings.allow4thTilePickup = obj?.settings?.allow4thTilePickup ?? true

	this.state.settings.ignoreBotMahjong = obj?.settings?.ignoreBotMahjong || false

	this.state.settings.pickupDiscardForDraw = obj?.settings?.pickupDiscardForDraw || false

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
		this.state.settings.ignoreBotMahjong = false //Not currently supported for Chinese.
	}
	else if (this.state.settings.gameStyle === "american") {
		this.state.settings.pickupDiscardForDraw = false //Not allowed in American.
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

		if (cards[obj?.settings?.card]) {
			this.state.settings.card = obj?.settings?.card
			delete this.state.settings.unknownCard
		}
		else {
			console.error("Unknown Card", obj?.settings?.card)
			this.state.settings.unknownCard = true
			this.state.settings.card = "Random"
		}
		this.gameData.card = cards[this.state.settings.card]

		this.gameData.charleston = {
			directions: this.state.settings.charleston.slice(0)
		}

		this.state.settings.americanBotDifficulty = Math.max(0, Number(obj?.settings?.americanBotDifficulty))
		if (isNaN(this.state.settings.americanBotDifficulty)) {this.state.settings.americanBotDifficulty = 50}
	}
	else {throw "Unknown gameStyle"}

	this.state.hostClientId = this.hostClientId
	this.state.moves = []

	this.logFileSaveId = this.roomId + "-" + Date.now()
	//Check for fs.createWriteStream to confirm we are native.
	if (fs.createWriteStream && !globalThis.avoidFSWrites) {
		this.logFile = fs.createWriteStream(path.join(globalThis.serverStateManager.serverDataDirectory, this.logFileSaveId + ".room"))
	}

	this.gameData.discardPile = []
	this.gameData.playerHands = {}

	//Build the player hands.
	//For now, we will randomly assign winds.

	//windAssignments is clientId: wind
	let winds = ["north", "east", "south", "west"]
	let winds2 = winds.slice(0) //Clone used for ordering bots below.
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


	//Order bots alphabetically
	//This makes sure that something like Bot 1, Bot 2, Bot 3 always goes the same direction.
	//We should do this by changing the names - names aren't saved in state, so we aren't changing
	//anything that is going to cause issues with debugging (where bots might be sorted differently when
	//the names were generated from clientIds)
	let botNames = []
	let botIds = []
	let clientIds = []

	this.clientIds.slice(0, 4).forEach((clientId) => {
		if (!windAssignments[clientId]) {
			windAssignments[clientId] = winds.splice(Math.floor(Math.random() * winds.length), 1)[0]
		}
		let client = globalThis.serverStateManager.getClient(clientId)
		if (client.isBot) {
			botNames.push(client.getNickname())
			botIds.push(clientId)
		}
		else {
			clientIds.push(clientId)
		}
	})

	//Place bots based on alphabetically ordered clientIds.
	clientIds = clientIds.slice(0, 4).sort()
	botNames = botNames.sort()

	let userWindIndex = winds2.indexOf(windAssignments[clientIds[0]])
	if (userWindIndex === -1) {userWindIndex = 0}

	winds2 = winds2.slice(userWindIndex).concat(winds2.slice(0, userWindIndex))

	botIds = botIds.sort((function(a, b) {
		return winds2.indexOf(windAssignments[a]) - winds2.indexOf(windAssignments[b])
	}))

	botIds.forEach((botId, index) => {
		globalThis.serverStateManager.getClient(botId).setNickname(botNames[index])
	})

	let eastWindPlayerId;
	for (let clientId in windAssignments) {
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

	this.gameData.currentTurn = {
		thrown: false,
		userTurn: eastWindPlayerId
	}

	this.gameData.currentTurn.turnChoices = new Proxy({}, this.turnChoicesProxyHandler);
	if (this.logFile) {
		this.logFile.write(JSON.stringify(this.state) + "\n")
	}

	let direction = this.state.settings.charleston[0][0].direction

	if (this.state.settings.gameStyle === "chinese") {
		//Message East about how to start.
		this.setInstructions(this.gameData.currentTurn.userTurn, `As East wind, you get to make the first throw. Select one tile and press Proceed.\n\nTo initiate a Charleston (first pass ${direction}), select 3 tiles and hit Proceed.`)
		this.setAllInstructions([this.gameData.currentTurn.userTurn], "Waiting on East Wind to make a play. ")
	}
	else if (this.state.settings.gameStyle === "american") {
		this.setAllInstructions([], "Welcome to the Charleston. Select 3 tiles you would like to pass " + direction + ", then hit Proceed. " , "success")
		this.messageAll([], "roomActionGameplayAlert", "The first pass is " + direction , "success")
	}

	this.sendStateToClients()
}

module.exports = startGame
