let API_KEY = "AIzaSyD-MaLfNzz1BiUvdKKfowXbmW_v8E-9xSc"

let url = 'https://www.googleapis.com/drive/v3/files/' + window.File_ID + '/export?mimeType=text/html&key=' + API_KEY

function load(text) {
	document.documentElement.innerHTML = text

	//In order to get the "4 friends" part styled differently, we will need 3 elements for our heading.
	let heading = document.createElement("div")
	heading.id = "heading"
	heading.addEventListener("click", function() {
		window.location.href = window.location.origin
	})
	document.documentElement.insertBefore(heading, document.body)

	let mahjongHeading = document.createElement("h1")
	mahjongHeading.innerHTML = "Mahjong"
	mahjongHeading.id = "mahjongHeading"
	heading.appendChild(mahjongHeading)

	let fourFriendsHeading = document.createElement("h1")
	fourFriendsHeading.innerHTML = "4 Friends"
	fourFriendsHeading.id = "fourFriendsHeading"
	heading.appendChild(fourFriendsHeading)

	let css = `
	html {
		background-image: url("assets/tiles/dragons/red.png"), url("assets/tiles/dragons/green.png");
		background-position: right bottom, left top;
	}

	.divElement {
		margin: auto;
		padding: 40px !important;
		padding-top: calc(40px + 4em) !important;
		background-color: white;
	}

	body {
		margin: 0;
		background: #00000088;
		padding-bottom: 50px;
	}

	img {
		max-width: calc(100vw - 40px);
		height: auto !important;
	}

	#heading {
		text-align: center;
		position: fixed;
		background-color: #26a221;
		cursor: pointer;
		top: 0;
		left: 0;
		right: 0;
		z-index: 9999;
		width: 100vw;
		transition: 0.5s;
	}

	#mahjongHeading, #fourFriendsHeading {
		font-size: 2.5em;
		color: #ffbd17;
		display: inline-block;
		margin-top: 0.5em;
		margin-bottom: 0.5em;
	}

	#fourFriendsHeading {
		font-size: 2.1em;
		margin-top: 0.3em;
		vertical-align: top;
		margin-left: 0.5em;
		font-style: italic;
		color: #ffe100;
	}
	`

	let style = document.createElement("style")
	style.innerHTML = css
	document.body.appendChild(style)

	window.onscroll = function scrollFunction() {
		let triggerPoint = 50
		let height = document.body.scrollTop || document.documentElement.scrollTop
		let heading = document.getElementById("heading")
		if (height < triggerPoint) {
			heading.style.fontSize = "";
		}
		else if (height > triggerPoint) {
			heading.style.fontSize = "0.5em";
		}
	};

	style.innerHTML += `
	.divElement {
		padding-left: calc(calc(100vw - ${window.getComputedStyle(document.body).maxWidth}) / 4) !important;
		padding-right: calc(calc(100vw - ${window.getComputedStyle(document.body).maxWidth}) / 4) !important;
	}
	`

	let divElement = document.createElement("div")
	divElement.className = "divElement"
	divElement.innerHTML = document.body.innerHTML
	document.body.innerHTML = ""
	document.body.appendChild(divElement)

	divElement.style.maxWidth = document.body.style.maxWidth
	document.body.style = ""
}

;(async function() {
	if (window.Capacitor) {
		try {
			const HTTP = require('@ionic-native/http').HTTP;
			let res = await HTTP.get(url, {}, {})
			load(res.data)
			return
		}
		catch (e) {
			console.error(e)
		}
	}

	let req = await fetch(url)
	let text = await req.text()
	load(text)
}())