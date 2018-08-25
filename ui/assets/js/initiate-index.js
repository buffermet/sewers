
/* Initiate index.html */

	self.addEventListener("load", async()=>{

		// Start streaming console log
		fetchLog()
		setInterval(fetchLog, 2500)

		// Get sewers config
		await getSewersConfig()

		// Override CSS values
		await updateCSS()

		// Get all relay configurations
		await showRelays()

		// Cycle news messages
		setInterval(cycleNews, 4000)

		// Reveal relays
		setTimeout(async()=>{
			container.classList.remove("hide")
		}, 720)

	})
