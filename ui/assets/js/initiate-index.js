
/* Initiate index.html */

	// Wait for everything to load
	self.addEventListener("load", async()=>{

		// Start streaming console log
		await fetchLog()
		setInterval(async()=>{
			await fetchLog()
		}, 2500)

		// Get sewers config
		getSewersConfig()

		// Override CSS values
		updateCSS()

		// Get all relay configurations
		showRelays()

		// Cycle news messages
		setInterval(async()=>{
			cycleNews()
		}, 6666)

		// Reveal relays
		setTimeout(async()=>{
			container.classList.remove("hide")
		}, 720)

	})
