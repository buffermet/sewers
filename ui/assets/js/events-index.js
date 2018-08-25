
/* Set events for index.html */

	// Make console resizable.
	topbar.addEventListener("mousedown", async event => {
		resizeConsole = true
	})
	topbar.addEventListener("touchstart", async event => {
		resizeConsole = true
	})
	document.addEventListener("mousemove", async event => {
		if (resizeConsole) {
			let offset = self.innerHeight - event.clientY

			if ( event.clientY > 75 && event.clientY < ( self.innerHeight - 50 ) ) {
				webConsole.style.height = offset + "px"
				topbar.style.bottom = (offset - 1) + "px"
				scrollContainer.style.height = "calc(100% - " + offset + "px)"
			}
		}
	})
	document.addEventListener("touchmove", async event => {
		if (resizeConsole) {
			let offset = self.innerHeight - event.clientY

			if ( event.clientY > 75 && event.clientY < ( self.innerHeight - 50 ) ) {
				webConsole.style.height = offset + "px"
				topbar.style.bottom = (offset - 1) + "px"
				scrollContainer.style.height = "calc(100% - " + offset + "px)"
			}
		}
	})
	document.addEventListener("mouseup", async event => {
		if (resizeConsole) {
			resizeConsole = false
			sendForm( "POST", "/config/sewers", "console_height=" + webConsole.getBoundingClientRect().height )
		}
	})
	document.addEventListener("touchend", async event => {
		if (resizeConsole) {
			resizeConsole = false
			sendForm( "POST", "/config/sewers", "console_height=" + webConsole.getBoundingClientRect().height )
		}
	})

	// Prevent console from being hidden when resizing window.
	self.addEventListener("resize", async()=>{
		if ( webConsole.getBoundingClientRect().height >= ( self.innerHeight - 75 ) && webConsole.getBoundingClientRect().height > 51 ) {
			webConsole.style.height = ( self.innerHeight - 75 ) + "px"
			topbar.style.bottom = ( self.innerHeight - 75 - 1 ) + "px"
			scrollContainer.style.height = "calc(100% - " + ( self.innerHeight - 75 ) + "px)"

			let console_height = webConsole.getBoundingClientRect().height

			sendForm("POST", "/config/sewers", "console_height=" + console_height)
		}
	})

	// Console "CLEAR" button
	consoleClear.addEventListener("click", async()=>{
		sendRequest("GET", "/clear_console_log", "").then(async res=>{
			if (res.status == 200) {
				consoleContainer.innerHTML = ""
				fetchLog()
			}
		})
	})

	// // Fetch log when user is active on window
	// document.addEventListener("mouseenter", async()=>{
	// 	fetchLog()
	// })

	// Quit button
	document.querySelector("html body div.menu div[name=quit]").addEventListener("click", async()=>{
		showMessage("Quit?", "Do you want to close sewers?<br><div class=\"button\" onclick=\"quit()\">Yes</div><div class=\"button\" onclick=\"hideMessage()\">No</div>")
	})

	// Preferences button
	document.querySelector("html body div.menu div.item[name=settings]").addEventListener("click", async()=>{
		showPreferences()
	})

	document.querySelector("html body div.fade div.modalbox div.optionbox ul li").addEventListener("mousedown", async event=>{
		document.querySelectorAll("html body div.fade div.modalbox div.optionbox ul li").forEach(async li=>{
			li.classList.remove("selected")
		})

		event.currentTarget.classList.add("selected")
	})

	backbutton.addEventListener("click", event=>{
		event.currentTarget.classList.add("hidden")

		showRelays()
	})

	menuCancel.addEventListener("click", async()=>{
		hideMenu()
	})
