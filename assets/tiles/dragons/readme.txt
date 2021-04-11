//Green dragon has been edited to make it more green.


//Ultimately decided not to include labels
//Red and green edited to include labels. The code used to edit them is below: (You might need to run it twice if the images don't load properly the first time)

;["red"].forEach((i) => {
	url = "/assets/tiles/dragons/" + i + ".png"
	let img = document.createElement("img")
	img.addEventListener("load", function() {
		let cnv = document.createElement("canvas")
		cnv.width = 96;cnv.height=128
		let ctx = cnv.getContext("2d")
		ctx.drawImage(img, 0, 0)
		document.body.appendChild(cnv)
		ctx.fillStyle = "#960202" //From dragon
		//ctx.fillStyle = "#e78723" //2 rows into border from white
		ctx.font = "25px Arial"
		ctx.fillText("R", 14, 42)
	})
	img.src = url
	//document.body.appendChild(img)
})


;["green"].forEach((i) => {
	url = "/assets/tiles/dragons/" + i + ".png"
	let img = document.createElement("img")
	img.addEventListener("load", function() {
		let cnv = document.createElement("canvas")
		cnv.width = 96;cnv.height=128
		let ctx = cnv.getContext("2d")
		ctx.drawImage(img, 0, 0)
		document.body.appendChild(cnv)
		ctx.fillStyle = "#224528" //From dragon
		//ctx.fillStyle = "#e78723" //2 rows into border from white
		ctx.font = "25px Arial"
		ctx.fillText("G", 14, 42)
	})
	img.src = url
	//document.body.appendChild(img)
})
