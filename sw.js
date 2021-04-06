async function openCache() {
	let cacheName = "Mahjong4Friends"
	let cache = await caches.open(cacheName)
	return cache
}

self.addEventListener("install", function() {
    self.skipWaiting()
})

self.addEventListener("activate", async function() {
	let cache = await openCache();
	let arr = [
		registration.scope,
		"packages/index.js",
		"packages/index.css",
		"assets/exit.svg",
		"assets/exit-full-screen.svg",
		"assets/go-full-screen.svg",
		"assets/tiles/joker.png",
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

	;[1,2,3,4,5,6,7,8,9].forEach((num) => {
		arr.push(`assets/tiles/circles/${num}.png`)
		arr.push(`assets/tiles/bamboos/${num}.png`)
		arr.push(`assets/tiles/characters/${num}.png`)
	})

	arr.forEach((item) => {
		cache.add(item).catch(function(e) {console.log(item, e)})
	})
})

//Network, with fallback to cache.
self.addEventListener('fetch', async function(event) {
	let url = event.request.url
	event.respondWith((async() => {
		let cache = await openCache()
		let network;
		try {
			network = await fetch(event.request)
			try {
				cache.put(url, network.clone())
			}
			catch (e) {console.error(e)}
			return network
		}
		catch (e) {
			let fromCache = await cache.match(url)
			if (fromCache) {return fromCache}
		}
	})())
});
