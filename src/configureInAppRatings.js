if (window?.Capacitor?.getPlatform()) {
	//Configure AppRate plugin.

	try {
		let androidUrl = "market://details?id=com.mahjong4friends.twa"
		let iosCode = "1552704332"
		let iosUrl = "https://apps.apple.com/us/app/mahjong-4-friends/id" + iosCode

		AppRate.setPreferences({
			displayAppName: 'Mahjong 4 Friends',
			simpleMode: false, //Worth considering - the negative feedback filtering is a bit excessive for repeat players, though it is friendly.
			usesUntilPrompt: 8, //We might want to configure this a bit better.
			promptAgainForEachNewVersion: false,
			reviewType: {
				ios: 'InAppReview',
				//Android InAppReview does not appear to be working - it's showing the prompts, but clicking rate isn't working.
				android: "InAppBrowser"
			},
			storeAppURL: {
				ios: iosCode,
				android: androidUrl
			},
			customLocale: {
				title: "Would you mind rating %@?",
				message: "It won’t take more than a minute and helps others find our app. Thanks for your support!",
				cancelButtonLabel: "No, Thanks",
				laterButtonLabel: "Remind Me Later",
				rateButtonLabel: "Rate It Now",
				yesButtonLabel: "Yes!",
				noButtonLabel: "Not Yet",
				appRatePromptTitle: 'Do you like using %@',
				feedbackPromptTitle: "Would you like to give us feedback?",
			},
			openUrl: function() {
				if (window.Capacitor.getPlatform() === "android") {
					window.open(androidUrl)
				}
				else {
					window.open(iosUrl)
				}
			},
			callbacks: {
				handleNegativeFeedback: function(){
					let body = `<br><br>
Please type your feedback above this line. <br>
Screenshots help massively when investigating issues. If possible, please include them, as well as the times at which any affected games were played. `

					try {
						body += "<br><br>Device Details: "
						body += `<br>WebKit/WebView: ${navigator.userAgent}`
						body += `<br>Time Zone Code: ${new Date().getTimezoneOffset()}`
					}
					catch (e) {console.error(e)}

					cordova.plugins.email.open({
					  to: 'support@mahjong4friends.com',
					  subject: `Mahjong 4 Friends ${window.Capacitor.getPlatform()} Feedback`,
					  body,
					  isHtml: true
					})
				},
				onRateDialogShow: function(callback) {
					console.log("Click")
					callback(1) // cause immediate click on 'Rate Now' button
				},
				onButtonClicked: function(buttonIndex){
					console.log("onButtonClicked -> " + buttonIndex);
				}
			}
		});
	}
	catch (e) {
		console.error(e)
	}
}
