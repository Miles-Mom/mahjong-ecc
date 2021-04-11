//These files have been edited to include numbers. The code used to edit them is below: (You might need to run it twice if the images don't load properly the first time)

;[1].forEach((i) => {
	url = "/assets/tiles/bamboos/" + i + ".png"
	let img = document.createElement("img")
	img.addEventListener("load", function() {
		let cnv = document.createElement("canvas")
		cnv.width = 96;cnv.height=128
		let ctx = cnv.getContext("2d")
		ctx.drawImage(img, 0, 0)
		document.body.appendChild(cnv)
		ctx.fillStyle = "#b66d17" //From top of tiles.
		//ctx.fillStyle = "#e78723" //2 rows into border from white
		ctx.font = "25px Arial"
		ctx.fillText(i, 15, 40)
	})
	img.src = url
	//document.body.appendChild(img)
})


;[2,3,7].forEach((i) => {
	url = "/assets/tiles/bamboos/" + i + ".png"
	let img = document.createElement("img")
	img.addEventListener("load", function() {
		let cnv = document.createElement("canvas")
		cnv.width = 96;cnv.height=128
		let ctx = cnv.getContext("2d")
		ctx.drawImage(img, 0, 0)
		document.body.appendChild(cnv)
		ctx.fillStyle = "#b66d17" //From top of tiles.
		//ctx.fillStyle = "#e78723" //2 rows into border from white
		ctx.font = "25px Arial"
		ctx.fillText(i, 15, 42)
	})
	img.src = url
	//document.body.appendChild(img)
})


;[4,5].forEach((i) => {
	url = "/assets/tiles/bamboos/" + i + ".png"
	let img = document.createElement("img")
	img.addEventListener("load", function() {
		let cnv = document.createElement("canvas")
		cnv.width = 96;cnv.height=128
		let ctx = cnv.getContext("2d")
		ctx.drawImage(img, 0, 0)
		document.body.appendChild(cnv)
		ctx.fillStyle = "#b66d17" //From top of tiles.
		//ctx.fillStyle = "#e78723" //2 rows into border from white
		ctx.font = "25px Arial"
		ctx.fillText(i, 41, 42)
	})
	img.src = url
	//document.body.appendChild(img)
})


;[6].forEach((i) => {
	url = "/assets/tiles/bamboos/" + i + ".png"
	let img = document.createElement("img")
	img.addEventListener("load", function() {
		let cnv = document.createElement("canvas")
		cnv.width = 96;cnv.height=128
		let ctx = cnv.getContext("2d")
		ctx.drawImage(img, 0, 0)
		document.body.appendChild(cnv)
		ctx.fillStyle = "#b66d17" //From top of tiles.
		//ctx.fillStyle = "#e78723" //2 rows into border from white
		ctx.font = "25px Arial"
		ctx.fillText(i, 28, 30)
	})
	img.src = url
	//document.body.appendChild(img)
})


;[8].forEach((i) => {
	url = "/assets/tiles/bamboos/" + i + ".png"
	let img = document.createElement("img")
	img.addEventListener("load", function() {
		let cnv = document.createElement("canvas")
		cnv.width = 96;cnv.height=128
		let ctx = cnv.getContext("2d")
		ctx.drawImage(img, 0, 0)
		document.body.appendChild(cnv)
		ctx.fillStyle = "#b66d17" //From top of tiles.
		//ctx.fillStyle = "#e78723" //2 rows into border from white
		ctx.font = "25px Arial"
		ctx.fillText(i, 34, 32)
	})
	img.src = url
	//document.body.appendChild(img)
})

;[9].forEach((i) => {
	url = "/assets/tiles/bamboos/" + i + ".png"
	let img = document.createElement("img")
	img.addEventListener("load", function() {
		let cnv = document.createElement("canvas")
		cnv.width = 96;cnv.height=128
		let ctx = cnv.getContext("2d")
		ctx.drawImage(img, 0, 0)
		document.body.appendChild(cnv)
		ctx.fillStyle = "#b66d17" //From top of tiles.
		//ctx.fillStyle = "#e78723" //2 rows into border from white
		ctx.font = "23px Arial"
		ctx.fillText(i, 30, 28)
	})
	img.src = url
	//document.body.appendChild(img)
})
