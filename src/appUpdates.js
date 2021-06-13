//Alert for App Updates.

;((async function() {
	let platform = window?.Capacitor?.getPlatform()

	if (!platform) {return} //Just return, avoid spamming console with errors. 

	const Popups = require("./Popups.js")

	let deviceInfo = await window.Capacitor.Plugins.Device.getInfo()
	let currentVersion = deviceInfo.appVersion

	if (platform === "ios") {
		//iTunes is settings CORS headers, but those headers don't change when the CDN resends the content -
		//if the CDN serves us, the CORS headers are for whatever origin last issued the request.

		//Fail on Apple's part there. Time to start cache busting. Leave a nice note in case this leaves some weird stuff in logs.
		//Apple takes up to a day to stop caching anyways, so this is probably a good thing from that perspective.

		let req = await fetch("https://itunes.apple.com/lookup?bundleId=com.mahjong4friends.twa&YourCDNDoesNotChangeCORSHeadersSoMustCacheBust" + Math.random())
		let res = await req.json()
		let latestVersion = res.results[0].version

		//Using numeric comparison, so version codes can't have more than one decimal.
		if (parseFloat(currentVersion) < parseFloat(latestVersion)) {
			new Popups.Notification("App Update", "There is a Mahjong 4 Friends <a href='https://apps.apple.com/us/app/mahjong-4-friends/id1552704332' target='_blank'>app update</a>. Downloading it is recommended. You may experience issues if you do not update. ").show()
		}
	}
	else if (platform === "android") {
		//TODO: Implement in app update API. Probably need native plugin.
		//https://developer.android.com/guide/playcore/in-app-updates

		//Probably don't bother actually doing in app updates, at least until we get our review prompts
		//working on android, as people often review when they download updates. Just use the API to
		//tell if updates are available.

		//The native API is also better, as the latest version can vary by device (the old TWA version is
		//still being released, and it supports older Android versions)

		let latestVersion = "2.1"

		//Using numeric comparison, so version codes can't have more than one decimal.
		if (parseFloat(currentVersion) < parseFloat(latestVersion)) {
			new Popups.Notification("App Update", "There is a Mahjong 4 Friends <a href='https://play.google.com/store/apps/details?id=com.mahjong4friends.twa' target='_blank'>app update</a>. Downloading it is recommended. You may experience issues if you do not update. ").show()
		}
	}
})())
