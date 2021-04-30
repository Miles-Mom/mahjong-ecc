
//Facebook Messenger Plugin
let fbRoot = document.createElement("div")
fbRoot.id = "fb-root"
document.body.appendChild(fbRoot)

let fbCustomerChat = document.createElement("div")
fbCustomerChat.className = "fb-customerchat"
fbCustomerChat.setAttribute("page_id", "103233541852386")
fbCustomerChat.setAttribute("greeting_dialog_display", "icon") //Only display the icon - nothing else.
document.body.appendChild(fbCustomerChat)

window.fbAsyncInit = function() {
	//We want to display the bubble, but not the window, on load.

	try {
		AppRate.promptForRating() //For testing.

	}
	catch (e) {
		console.error(e)
	}

	FB.init({
		xfbml            : false,
		version          : 'v10.0'
	});

	FB.Event.subscribe('customerchat.load', function() {
		let styleElem = document.querySelector("head > style")

		//Messenger plugin wasn't closing when inline style was disabled.
		//Parse the inline style and add it to document.styleSheets.
		let text = styleElem.innerText

		let strs = []
		let str = ""
		let openBrackets = 0
		for (let i=0;i<text.length;i++) {
			let char = text[i]
			str += char
			if (char === "{") {openBrackets++}
			if (char === "}") {
				openBrackets--
				if (openBrackets === 0) {strs.push(str);str=""}
			}
		}

		console.log("Parsed and inserting Facebook CSS Rules to bypass inline-style CSP block", strs)
		strs.forEach((str) => {document.styleSheets[0].insertRule(str)})
	});

	FB.XFBML.parse()
};

(function(d, s, id) {
	var js, fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)) return;
	js = d.createElement(s); js.id = id;
	js.src = 'https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js';
	fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
