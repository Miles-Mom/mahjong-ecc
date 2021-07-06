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
