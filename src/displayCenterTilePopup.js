const {updateTilesInContainer} = require("./updateTilesInContainer.js")
const {Panel} = require("./Popups.js")

//Intended to display expanded view for Wall and Discard Pile.
function displayCenterTilePopup(tiles, headerText) {
	let panel = new Panel(headerText)
	console.log(panel)
	panel.panel.classList.add("fitToBoardArea")

	let wallPreview = document.createElement("div")
	wallPreview.classList.add("tileGridPopupView")
	updateTilesInContainer(wallPreview, tiles)
	panel.panel.appendChild(wallPreview)

	panel.show(gameBoard)


	let panelDims = panel.panel.getBoundingClientRect()
	let wallPreviewDims = wallPreview.getBoundingClientRect()
	let height = panelDims.bottom - wallPreviewDims.top
	let width = panelDims.right - panelDims.left

	//Add a little bit of padding.
	//We don't need any horizontally, as the tiles have a small transparent area on the left and right sides.
	height *= 0.99

	let imageHeight = 128
	let imageWidth = 96

	//Breakpoints are where we gain an additional row or column.
	//tiles.length is number of tiles we need to fit.
	while (true) {
		let rows = height / imageHeight
		let columns = width / imageWidth

		let tileCount = Math.floor(rows) * Math.floor(columns)

		if (tileCount >= tiles.length) {break}

		//Shrink both dimensions equally, until we can add either one more row or one more column.
		//Add a tiny amount of margin to ensure the new row amount ends up slightly OVER. Otherwise, we might Math.floor 14.999999999998 to 14, and infinite loop.
		let newRowHeight = height / (Math.floor(rows) + 1 + 1e-7)
		let newColumnWidth = width / (Math.floor(columns) + 1 + 1e-7)

		let scalingFactor = Math.max(newRowHeight / imageHeight, newColumnWidth / imageWidth) //Downscale as little as possible.
		imageHeight *= scalingFactor
		imageWidth *= scalingFactor
	}

	let imageElems = wallPreview.querySelectorAll("img")

	for (let i=0;i<imageElems.length;i++) {
		let elem = imageElems[i]
		elem.style.width = imageWidth + "px"
		elem.style.height = imageHeight + "px"
	}
}

module.exports = {displayCenterTilePopup}
