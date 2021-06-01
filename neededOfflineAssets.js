//Includes everything but index.html
let arr = [
	"packages/index.js",
	"packages/index.css",
	"assets/edit.svg",
	"assets/exit-full-screen.svg",
	"assets/go-full-screen.svg",
	"assets/reload-icon.svg",
	"assets/tiles/joker.png",
	"assets/tiles/face-down.png",
	"assets/tiles/tile-outline.png",
]

;"north east south west".split(" ").forEach((wind) => {
	arr.push(`assets/compass-${wind}.svg`)
	arr.push(`assets/tiles/winds/${wind}.png`)
})

;[1,2,3,4].forEach((num) => {
	arr.push(`assets/tiles/flowers/${num}.png`)
	arr.push(`assets/tiles/seasons/${num}.png`)
})

;"red green white".split(" ").forEach((dragon) => {
	arr.push(`assets/tiles/dragons/${dragon}.png`)
})

;["circle", "bamboo", "character", "dragon", "wind", "any"].forEach((category) => {
	arr.push(`assets/tiles/any/${category}.png`)
})

;[1,2,3,4,5,6,7,8,9].forEach((num) => {
	arr.push(`assets/tiles/circles/${num}.png`)
	arr.push(`assets/tiles/bamboos/${num}.png`)
	arr.push(`assets/tiles/characters/${num}.png`)
	arr.push(`assets/tiles/any/${num}.png`)
})



module.exports = arr
