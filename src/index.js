try {
    let isIE = (/MSIE (\d+\.\d+);/.test(navigator.userAgent) || navigator.userAgent.indexOf("Trident/") > -1)
    if (isIE) {
        let warning = document.createElement("h2")
        warning.innerHTML = "Internet Explorer is NOT Supported. Choose a different browser (Chrome, Firefox, Edge, Safari, Opera, and most other browsers should work)"
        document.body.insertBefore(warning, document.body.firstChild)
    }
}
catch(e) {console.error(e)}

try {
    if (window.Capacitor) {
        window.Capacitor.Plugins.SplashScreen.hide()
    }
}
catch (e) {console.error(e)}

if ('serviceWorker' in navigator) {
    try {
        navigator.serviceWorker.register('packagedsw.js');
    }
    catch (e) {
        console.error(e)
    }
}

document.title = "Mahjong 4 Friends - Free Mahjong, Friends and/or Bots"

require("./appUpdates.js")
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
require("drag-drop-touch")


let url = new URL(window.location.origin + window.location.pathname)
if (window.location.protocol === "https:") {
    url.protocol = "wss:"
}
else {
    url.protocol = "ws:"
}
let websocketURL = url.toString()
if (window.Capacitor) {
    websocketURL = "wss://mahjong4friends.com/"
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
function setVisibleAreaHeight(callAgain = true) {
    let width = Math.max(document.documentElement.clientWidth, Math.min(screen.width, window.innerWidth))
    let height = Math.max(document.documentElement.clientHeight, window.innerHeight)

	document.documentElement.style.setProperty('--vh', `${height/100}px`)
    document.documentElement.style.setProperty('--vw', `${width/100}px`)

    //Configure notch for screenshotting. params.get returns null, which evaluates to zero, if the param is not defined.
    let params = new URLSearchParams(window.location.hash.slice(1))
    let minLeft = Number(params.get("shiftPercentageLeft"))
    let minRight = Number(params.get("shiftPercentageRight"))

    //Add some margin to handle the notch.
    let pxLeft = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--sal"))
    pxLeft -= 10 //Ignore the small safe area decrease caused by rounded corners.
    document.documentElement.style.setProperty('--shiftPercentageLeft', `${Math.max(minLeft, pxLeft/width)}`)

    let pxRight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--sar"))
    pxRight -= 10 //Ignore the small safe area decrease caused by rounded corners.
    document.documentElement.style.setProperty('--shiftPercentageRight', `${Math.max(minRight, pxRight/width)}`)

    //Somewhat occasionally, we get some issues with resizes.
    if (callAgain && callAgain?.isTrusted !== false) {
        setTimeout(function() {
            setVisibleAreaHeight(false)
        }, 500)
    }
}

window.addEventListener('resize', setVisibleAreaHeight)
//Fire resize on orientationchange.
window.addEventListener('orientationchange', function() {
    window.dispatchEvent(new Event("resize"))
})

setVisibleAreaHeight()

//In case any issues surface with load, resize constantly for first 3000 ms.
let resizer = setInterval(function() {
    window.dispatchEvent(new Event("resize"))
}, 300)
setTimeout(function() {
    clearInterval(resizer)
}, 3000)

//We are probably being hit by a race condition where the JavaScript can load before the CSS,
//causing resizing to be intermittent. This should fix it.
document.body.addEventListener("load", setVisibleAreaHeight)

//Otherwise Safari will scroll the page when the user drags tiles.
//It's possible that we need feature detection for passive listeners, as it may be misinterpreted by older browsers, however I currently observe no side effects.
window.addEventListener('touchmove', function () {}, {passive: false});
