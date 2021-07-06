let API_KEY = "AIzaSyD-MaLfNzz1BiUvdKKfowXbmW_v8E-9xSc"

let url = 'https://www.googleapis.com/drive/v3/files/' + window.File_ID + '/export?mimeType=text/html&key=' + API_KEY

function load(text) {
	document.documentElement.innerHTML = text

	require("./heading.js")

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
