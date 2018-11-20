
/* Initiate index.html */

	self.addEventListener("load", async()=>{
		await whoAmI()
		await getSewersConfig()
		await updateCSS()
		await showRelays()

		fetchLog()
		setInterval(fetchLog, 400) // make websocket

		setInterval(cycleNews, 4000)
		setTimeout(async()=>{ container.classList.remove("hide") }, 720)
	})
