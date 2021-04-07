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

document.title = "Mahjong 4 Friends - Free Multiplayer Mahjong"

window.isAndroid = false
if (document.referrer && document.referrer.includes("android-app://com.mahjong4friends.twa")) {
  window.isAndroid = true
}

if (window.Capacitor) {
    try {
        ;((async function() {
            //Alert for App Updates.

            //iTunes is settings CORS headers, but those headers don't change when the CDN resends the content -
            //if the CDN serves us, the CORS headers are for whatever origin last issued the request.

            //Fail on Apple's part there. Time to start cache busting. Leave a nice note in case this leaves some weird stuff in logs.
            //Apple takes up to a day to stop caching anyways, so this is probably a good thing from that perspective. 

            let req = await fetch("https://itunes.apple.com/lookup?bundleId=com.mahjong4friends.twa&YourCDNDoesNotChangeCORSHeadersSoMustCacheBust" + Math.random())
            let res = await req.json()
            let latestVersion = res.results[0].version

            let deviceInfo = await window.Capacitor.Plugins.Device.getInfo()
            let currentVersion = deviceInfo.appVersion

            //Using numeric comparison, so version codes can't have more than one decimal.
            if (parseFloat(currentVersion) < parseFloat(latestVersion)) {
                const Popups = require("./Popups.js")
                new Popups.Notification("App Update", "There is a Mahjong 4 Friends <a href='https://apps.apple.com/us/app/mahjong-4-friends/id1552704332' target='_blank'>app update</a>. Downloading it is recommended. You may issues if you do not update. ").show()
            }
        })())
    }
    catch (e) {console.error(e)}
}


require("./universalLinks.js")

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
if (window.location.hostname === "127.0.0.1" || window.location.hostname.startsWith("192.168.1") || window.location.hostname.startsWith("10.")) {
    //Local development
    url.port = 7591
}
let websocketURL = url.toString()
if (window.Capacitor) {
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

    //Add some margin to handle the notch.

    let pxLeft = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--sal"))
    pxLeft -= 10 //Ignore the small safe area decrease caused by rounded corners.
    document.documentElement.style.setProperty('--shiftPercentageLeft', `${Math.max(0, pxLeft/window.innerWidth)}`)

    let pxRight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--sar"))
    pxRight -= 10 //Ignore the small safe area decrease caused by rounded corners.
    document.documentElement.style.setProperty('--shiftPercentageRight', `${Math.max(0, pxRight/window.innerWidth)}`)
}

window.addEventListener('resize', setVisibleAreaHeight)
window.addEventListener('orientationchange', setVisibleAreaHeight)

setVisibleAreaHeight()

//Otherwise Safari will scroll the page when the user drags tiles.
//It's possible that we need feature detection for passive listeners, as it may be misinterpreted by older browsers, however I currently observe no side effects.
window.addEventListener('touchmove', function () {}, {passive: false});
