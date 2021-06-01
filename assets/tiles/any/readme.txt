//The following code was used to generate the Marvelous Mahjongg "any" character/number/tile images.

let img;

//Any Tile

url = "/assets/tiles/dragons/white.png"
img = document.createElement("img")
img.addEventListener("load", function() {
	let cnv = document.createElement("canvas")
	cnv.width = 96;cnv.height=128
	let ctx = cnv.getContext("2d")
	ctx.drawImage(img, 0, 0)
	document.body.appendChild(cnv)
    ctx.fillStyle = "center"
	ctx.font = "32px Arial"
	let topText = "ANY"
	ctx.fillText(topText, (cnv.width - ctx.measureText(topText).width) / 2, 60)
	ctx.font = "32px Arial"
    let text = "TILE"
    ctx.fillStyle = "black"
	ctx.fillText(text, (cnv.width - ctx.measureText(text).width) / 2, 100)
})
img.src = url

await new Promise((r,j) => {setTimeout(r,50)});




//Any Character

url = "/assets/tiles/any/blanks/character.png"
img = document.createElement("img")
img.addEventListener("load", function() {
	let cnv = document.createElement("canvas")
	cnv.width = 96;cnv.height=128
	let ctx = cnv.getContext("2d")
	ctx.drawImage(img, 0, 0)
	document.body.appendChild(cnv)
    ctx.fillStyle = "center"
	ctx.font = "32px Arial"
	let topText = "ANY"
	ctx.fillText(topText, (cnv.width - ctx.measureText(topText).width) / 2, 45)
})
img.src = url

await new Promise((r,j) => {setTimeout(r,50)});



//Any Bamboo

url = "/assets/tiles/any/blanks/bamboo.png"
img = document.createElement("img")
img.addEventListener("load", function() {
	let cnv = document.createElement("canvas")
	cnv.width = 96;cnv.height=128
	let ctx = cnv.getContext("2d")
	ctx.drawImage(img, 0, 0)
	document.body.appendChild(cnv)
    ctx.fillStyle = "center"
	ctx.font = "32px Arial"
	let topText = "ANY"
	ctx.fillText(topText, (cnv.width - ctx.measureText(topText).width) / 2, 45)
})
img.src = url

await new Promise((r,j) => {setTimeout(r,50)});





//Any Circle - I do not believe Marvelous ever uses this one.

url = "/assets/tiles/any/blanks/circle.png"
img = document.createElement("img")
img.addEventListener("load", function() {
	let cnv = document.createElement("canvas")
	cnv.width = 96;cnv.height=128
	let ctx = cnv.getContext("2d")
	ctx.drawImage(img, 0, 0)
	document.body.appendChild(cnv)
    ctx.fillStyle = "center"
	ctx.font = "32px Arial"
	let topText = "ANY"
	ctx.fillText(topText, (cnv.width - ctx.measureText(topText).width) / 2, 45)
})
img.src = url

await new Promise((r,j) => {setTimeout(r,50)});




//Any Dragon - TODO: Get some sort of image.

url = "/assets/tiles/dragons/white.png"
img = document.createElement("img")
img.addEventListener("load", function() {
	let cnv = document.createElement("canvas")
	cnv.width = 96;cnv.height=128
	let ctx = cnv.getContext("2d")
	ctx.drawImage(img, 0, 0)
	document.body.appendChild(cnv)
    ctx.fillStyle = "center"
	ctx.font = "25px Arial"
	let topText = "ANY"
	ctx.fillText(topText, (cnv.width - ctx.measureText(topText).width) / 2, 35)
	ctx.font = "100px Arial"
    let text = "D"
    ctx.fillStyle = "black"
	ctx.fillText(text, (cnv.width - ctx.measureText(text).width) / 2, 115)
})
img.src = url

await new Promise((r,j) => {setTimeout(r,50)});



//Any Wind

url = "/assets/tiles/dragons/white.png"
img = document.createElement("img")
img.addEventListener("load", function() {
	let cnv = document.createElement("canvas")
	cnv.width = 96;cnv.height=128
	let ctx = cnv.getContext("2d")
	ctx.drawImage(img, 0, 0)
	document.body.appendChild(cnv)
    ctx.fillStyle = "center"
	ctx.font = "32px Arial"
	let topText = "ANY"
	ctx.fillText(topText, (cnv.width - ctx.measureText(topText).width) / 2, 42)
	ctx.font = "70px Arial"
    let text = "W"
    ctx.fillStyle = "black"
	ctx.fillText(text, (cnv.width - ctx.measureText(text).width) / 2, 110)
})
img.src = url

await new Promise((r,j) => {setTimeout(r,50)});



//Any of a number.

for (let i=1;i<10;i++) {
	url = "/assets/tiles/dragons/white.png"
	img = document.createElement("img")
	img.addEventListener("load", function() {
		let cnv = document.createElement("canvas")
		cnv.width = 96;cnv.height=128
		let ctx = cnv.getContext("2d")
		ctx.drawImage(img, 0, 0)
		document.body.appendChild(cnv)
	    ctx.fillStyle = "center"
		ctx.font = "25px Arial"
		let topText = "ANY"
		ctx.fillText(topText, (cnv.width - ctx.measureText(topText).width) / 2, 35)
		ctx.font = "100px Arial"
	    let text = i
	    ctx.fillStyle = "black"
		ctx.fillText(text, (cnv.width - ctx.measureText(text).width) / 2, 115)
	})
	img.src = url

	await new Promise((r,j) => {setTimeout(r,50)});
}
