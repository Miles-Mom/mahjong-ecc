const Room = require("./Room.js")
const Client = require("./Client.js")
const Bot = require("./Bot.js")

class StateManager {
	constructor(rooms = {}, clients = {}) {

		let originalRooms = rooms

		//We'll trim all leading and trailing spaces for roomIds.
		rooms = new Proxy(originalRooms, {
			get: function(obj, prop) {
				//Since values are trimmed when added, this is unless we loaded from a saved state.
				let value = obj[prop]
				if (value instanceof String) {
					return value.trim()
				}
				return value
			},
			set: function(obj, prop, value) {
				if (value instanceof String) {
					value = value.trim()
				}
				obj[prop] = value
				return true
			}
		})

		this.getRoom = function(roomId) {
			return rooms[roomId]
		}

		this.createRoom = function(roomId, room) {
			if (roomId.trim().length === 0) {
				//Auto-generate a unique ID.
				roomId = StateManager.findUniqueId(rooms, "room")
			}
			if (rooms[roomId]) {return false} //Room already exists.
			return rooms[roomId] = room || new Room(roomId)
		}

		this.deleteRoom = function(roomId) {
			delete rooms[roomId]
		}

		this.getClient = function(clientId) {
			return clients[clientId]
		}

		this.createClient = function(clientId, websocket) {
			clients[clientId] = new Client(clientId, websocket)
			return clients[clientId]
		}

		this.createBot = function(clientId = StateManager.findUniqueId(clients, "bot"), websocket) {
			//Websocket intended for dev use.
			clients[clientId] = new Bot(clientId, websocket)
			return clients[clientId]
		}

		this.deleteClient = function(clientId) {
			delete clients[clientId]
		}

		this.getAllClients = function() {
			let arr = []
			for (let clientId in clients) {
				arr.push(clients[clientId])
			}
			return arr
		}

		this.getAllRoomIds = function() {
			return Object.keys(originalRooms)
		}

		this.loadState = (function fromJSON(str) {
			//Load clients and rooms from a saved state.
			//We will load clients first, then return a callback to load rooms.

			//This will allow for modifications to clients to be made before loading rooms (like when loading from save files)
			console.time("Initializing server clients... ")
			let obj = JSON.parse(str)
			let loadClients = obj.clients
			let loadRooms = obj.rooms

			for (let clientId in loadClients) {
				clients[clientId] = Client.fromJSON(loadClients[clientId])
			}
			console.timeEnd("Initializing server clients... ")

			return {
				startRooms: function startRooms() {
					console.time("Initializing server rooms... ")
					for (let roomId in loadRooms) {
						rooms[roomId] = Room.fromJSON(loadRooms[roomId])
						rooms[roomId].init()
						console.log(globalThis.serverStateManager.getRoom(roomId))
					}
					console.timeEnd("Initializing server rooms... ")
				}
			}
		}).bind(this)

		this.toJSON = (function() {
			//Convert our state to a string.
			//Since both room and client objects have a toString method, we can do this quite easily with JSON.stringify
			return JSON.stringify({
				rooms,
				clients,
				deviceInfo: StateManager.getHostInfo()
			})
		}).bind(this)
	}

	static findUniqueId(obj, prefix = "", idLimit = 2**9) {
		let random, id;

		//We will use short ids until we have trouble generating ids.
		while (!id || obj[prefix + random]) {
			random = Math.floor(Math.random() * idLimit)
			id = prefix + random
			idLimit = Math.min(2**53, idLimit * 2)
		}

		return id
	}

	static getHostInfo() {
		if (globalThis.window) {
			return {
				platform: window.nativePlatform || "web",
				userAgent: window.navigator?.userAgent //TODO: Capacitor can give us much easier to parse data, but async. Might be better to keep standardized though.
			}
		}
	}
}

module.exports = StateManager
