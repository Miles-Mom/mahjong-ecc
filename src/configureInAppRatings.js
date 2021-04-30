//TODO: Test Android then enable on Android
if (window?.Capacitor?.getPlatform()) {
	//Configure AppRate plugin.
	try {
		AppRate.setPreferences({
			displayAppName: 'Mahjong 4 Friends',
			simpleMode: false, //Worth considering - the negative feedback filtering is a bit excessive for repeat players, though it is friendly.
			usesUntilPrompt: 10, //We might want to configure this a bit better.
			promptAgainForEachNewVersion: false,
			reviewType: {
				ios: 'InAppReview',
				android: "InAppReview"
			},
			storeAppURL: {
				ios: "1552704332",
				android: "market://details?id=com.mahjong4friends.twa"
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
			callbacks: {
				handleNegativeFeedback: function(){
					cordova.plugins.email.open({
					  to: 'support@mahjong4friends.com',
					  subject: 'Mahjong 4 Friends iOS Feedback',
					  body: '',
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
