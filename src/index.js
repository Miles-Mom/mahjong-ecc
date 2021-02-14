try {
    let isIE = (/MSIE (\d+\.\d+);/.test(navigator.userAgent) || navigator.userAgent.indexOf("Trident/") > -1)
    if (isIE) {
        let warning = document.createElement("h2")
        warning.innerHTML = "Internet Explorer is NOT Supported. Choose a different browser (Chrome, Firefox, Edge, Safari, Opera, and most other browsers should work)"
        document.body.insertBefore(warning, document.body.firstChild)
    }
}
catch(e) {console.error(e)}

if ('serviceWorker' in navigator) {
    try {
        navigator.serviceWorker.register('packagedsw.js');
    }
    catch (e) {
        console.error(e)
    }
}

window.isAndroid = false
if (document.referrer && document.referrer.includes("android-app://com.mahjong4friends.twa")) {
  window.isAndroid = true
}

//Handle universal links into the app.
try {
	if (window.Capacitor) {

		//Properly navigates to target.
		function processRedirect(target) {
			//When reload is called instantly after changing href, the page doesn't navigate, and just reloads the current origin.
			//The href change persists though.

			//Therefore, we reload after changing href, and do not reload if we don't.

			console.log("Current URL: " + window.location.href)

			let url = new URL(target)
			if (url.href === window.location.href) {
				console.log("Same URLs. Skipping")
			}
			else if (url.pathname === window.location.pathname) {
				console.log("Same pathname. Setting and reloading. ")
				window.location =  url.href
				window.location.reload()
			}
			else {
				console.log("Different pathname. Setting")
				window.location = url.href
			}
		}

		Capacitor.Plugins.App.addListener('appUrlOpen', (data) => {
		  console.log('App opened with URL: ' +  data.url);
		  processRedirect(data.url)
		});

		Capacitor.Plugins.App.getLaunchUrl().then((ret) => {
			if(ret && ret.url) {
				console.log('Launch url: ', ret.url);
				processRedirect(ret.url)
			}
		});
	}
}
catch (e) {console.error(e)}

let sizes = [16,24,32,64,96,160,196]
sizes.forEach((size) => {
    let favicon = document.createElement("link")
    favicon.rel = "shortcut icon"
    favicon.type = "image/png"
    favicon.sizes = size + "x" + size
    favicon.href = `assets/icons/${size}x${size}-green-dragon.png`
    document.head.appendChild(favicon)
})

const StateManager = require("./StateManager.js")

//Mobile browsers use the touch API - desktop is drag and drop. We'll use a polyfill so we don't have to implement both.
let mobile_drag_drop_polyfill = require("mobile-drag-drop").polyfill
// optional import of scroll behaviour
import {scrollBehaviourDragImageTranslateOverride} from "mobile-drag-drop/scroll-behaviour";
// options are optional ;)
mobile_drag_drop_polyfill({
    // use this to make use of the scroll behaviour
    dragImageTranslateOverride: scrollBehaviourDragImageTranslateOverride
});

let url = new URL(window.location.origin + window.location.pathname)
url.pathname = "/node"
if (window.location.protocol === "https:") {
    url.protocol = "wss:"
}
else {
    url.protocol = "ws:"
}
if (window.location.hostname === "127.0.0.1" || window.location.hostname.startsWith("192.168.1")) {
    //Local development
    url.port = 7591
}
let websocketURL = url.toString()
if (window.isNative) {
    websocketURL = "wss://mahjong4friends.com/node"
}
window.stateManager = new StateManager(websocketURL)

//Make classes public to allow for easier development.
;(["Hand", "Tile", "Sequence", "Pretty", "Match", "Wall", "Popups"]).forEach((className) => {
    window[className] = require("./" + className + ".js")
})

let roomManager = require("./RoomManager.js")
let gameBoard = require("./GameBoard.js")


//While viewport relative units work fine on desktop, some mobile browsers will not show the entire viewport, due to the url bar.
//See https://nicolas-hoizey.com/articles/2015/02/18/viewport-height-is-taller-than-the-visible-part-of-the-document-in-some-mobile-browsers/
//We will use CSS variables to counteract this bug.
function setVisibleAreaHeight() {
	document.documentElement.style.setProperty('--vh', `${window.innerHeight/100}px`)
    document.documentElement.style.setProperty('--vw', `${window.innerWidth/100}px`)
}
window.addEventListener('resize', setVisibleAreaHeight)
window.addEventListener('orientationchange', setVisibleAreaHeight)

setVisibleAreaHeight()


//Otherwise Safari will scroll the page when the user drags tiles.
//It's possible that we need feature detection for passive listeners, as it may be misinterpreted by older browsers, however I currently observe no side effects.
window.addEventListener('touchmove', function () {}, {passive: false});
