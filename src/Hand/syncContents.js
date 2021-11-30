const Tile = require("../Tile.js")

function syncContents(syncContents, addAdditionsToPlacematIfOpen = false) {
	//We allow the user to sort their hand by themselves, however it is possible that, due to lag or other reasons, the users hand ends up not matching the server.
	//This function will sync the contents of the users hand with contents, preserving some user ordering.
	let currentContentsStrings = [];
	let syncContentsStrings = [];

	this.contents.forEach((item) => {
		currentContentsStrings.push(item.toJSON())
	})

	this.inPlacemat.forEach((item) => {
		if (item.evicting) {return}
		currentContentsStrings.push(item.toJSON())
	})

	syncContents.forEach((item) => {
		syncContentsStrings.push(item.toJSON())
	})

	//Let's go through both arrays, and see what needs to change.
	//We'll stringify, because these are not identical instances, and therefore == will not work.
	for (let i=0;i<currentContentsStrings.length;i++) {
		let str = currentContentsStrings[i]
		if (str && syncContentsStrings.includes(str)) {
			currentContentsStrings[i] = null
			syncContentsStrings[syncContentsStrings.indexOf(str)] = null
		}
	}

	//Save tempContents now, because we add items to the array later, and they mess up ordering otherwise.
	let tempContents = this.contents.slice(0) //We are cloning the array, however the referenced objects remain the same. This prevents us from having to adjust indexes for items when we remove other items.
	if (this.inPlacemat[0] && this.inPlacemat[0].evicting) {
		tempContents = tempContents.concat(this.inPlacemat.slice(1))
	}
	else {
		tempContents = tempContents.concat(this.inPlacemat.slice(0))
	}

	//Everything that matches is now nulled out, so we remove everything remaining in currentContentsStrings, and add everything remaining in syncContentsStrings.
	//Removal should be done first so the placemat is be cleared out in case additions are placed there.
	for (let i=0;i<currentContentsStrings.length;i++) {
		let item = currentContentsStrings[i]
		if (item) {
			this.remove(tempContents[i])
		}
	}


	let numberOfAdditions = syncContentsStrings.filter(item => item).length

	if (numberOfAdditions > 3) {
		//With initial state syncs (reload, revert, game start), etc, we don't want to fill the placemat with the first 3 tiles in the hand.
		//To counteract this, we will measure the number of tiles that need to be added to the placemat (new additions).
		//If the number is greater than 3, we will refuse to add to placemat (as its clearly not just a charleston).

		addAdditionsToPlacematIfOpen = false
	}

	for (let i=0;i<syncContentsStrings.length;i++) {
		let item = syncContentsStrings[i]
		if (!item) {continue;}
		if (addAdditionsToPlacematIfOpen && this.inPlacemat.length < 3 && syncContents[i] instanceof Tile) {
			this.inPlacemat.push(syncContents[i])
		}
		else {
			this.add(syncContents[i])
		}
	}
}

module.exports = syncContents
