
/* Initiate index.html */

	self.addEventListener("load", async()=>{
		await getSewersConfig()
		await updateCSS()
		await showRelays()

		fetchLog()
		setInterval(fetchLog, 1000) // make websocket

		setInterval(cycleNews, 4000)
		setTimeout(async()=>{ container.classList.remove("hide") }, 720)
	})
