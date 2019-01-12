
/* Set events for index.html */

	// Console resizing.
	app.environment.topbar.addEventListener("mousedown", async(event) => {
		app.environment.resizeConsole = true
	})
	app.environment.topbar.addEventListener("touchstart", async(event) => {
		app.environment.resizeConsole = true
	})
	document.addEventListener("mousemove", async(event) => {
		if (app.environment.resizeConsole) {
			const offset = self.innerHeight - event.clientY

			if ( event.clientY > 75 && event.clientY < ( self.innerHeight - 50 ) ) {
				app.environment.webConsole.style.height = offset + "px"
				app.environment.topbar.style.bottom = (offset - 1) + "px"
				app.environment.scrollContainer.style.height = "calc(100% - " + offset + "px)"
			}
		}
	})
	document.addEventListener("touchmove", async(event) => {
		if (app.environment.resizeConsole) {
			const offset = self.innerHeight - event.clientY

			if ( event.clientY > 75 && event.clientY < ( self.innerHeight - 50 ) ) {
				app.environment.webConsole.style.height = offset + "px"
				app.environment.topbar.style.bottom = (offset - 1) + "px"
				app.environment.scrollContainer.style.height = "calc(100% - " + offset + "px)"
			}
		}
	})
	document.addEventListener("mouseup", async(event) => {
		if (app.environment.resizeConsole) {
			app.environment.resizeConsole = false
			app.http.Request( "POST", "/config/sewers", [["Content-Type", "application/x-www-form-urlencoded"]], "console_height=" + app.environment.webConsole.getBoundingClientRect().height )
		}
	})
	document.addEventListener("touchend", async(event) => {
		if (app.environment.resizeConsole) {
			app.environment.resizeConsole = false
			app.http.Request( "POST", "/config/sewers", [["Content-Type", "application/x-www-form-urlencoded"]], "console_height=" + app.environment.webConsole.getBoundingClientRect().height )
		}
	})

	// Prevent console from being hidden when resizing window.
	self.addEventListener("resize", async()=>{
		if ( app.environment.webConsole.getBoundingClientRect().height >= ( self.innerHeight - 75 ) && app.environment.webConsole.getBoundingClientRect().height > 51 ) {
			app.environment.webConsole.style.height = ( self.innerHeight - 75 ) + "px"
			app.environment.topbar.style.bottom = ( self.innerHeight - 75 - 1 ) + "px"
			app.environment.scrollContainer.style.height = "calc(100% - " + ( self.innerHeight - 75 ) + "px)"

			let console_height = app.environment.webConsole.getBoundingClientRect().height

			app.http.Request("POST", "/config/sewers", [["Content-Type", "application/x-www-form-urlencoded"]], "console_height=" + console_height)
		}
	})

	// Console "CLEAR" button
	app.environment.consoleClear.addEventListener("click", async()=>{
		app.http.Request("GET", "/clear_console_log", [[]], "").then(async(res)=>{
			if (res.status == 200) {
				app.environment.consoleContainer.innerHTML = ""
				app.functions.fetchLog()
			}
		})
	})

	// // Fetch log when user is active on window
	// document.addEventListener("mouseenter", async()=>{
	// 	app.functions.fetchLog()
	// })

	// Quit button
	document.querySelector("html body div.menu div[name=quit]").addEventListener("click", async()=>{
		app.functions.showMessage("Quit?", "Do you want to close sewers?<br><div class=\"button\" onclick=\"app.functions.quit()\">Yes</div><div class=\"button\" onclick=\"app.functions.hideMessage()\">No</div>")
	})

	// Preferences button
	document.querySelector("html body div.menu div.item[name=settings]").addEventListener("click", async()=>{
		app.functions.showPreferences()
	})

	document.querySelector("html body div.fade div.modal div.optionbox ul li").addEventListener("mousedown", async(event)=>{
		document.querySelectorAll("html body div.fade div.modal div.optionbox ul li").forEach(async(li)=>{
			li.classList.remove("selected")
		})

		event.currentTarget.classList.add("selected")
	})

	app.environment.backbutton.addEventListener("click", async(event)=>{
		event.currentTarget.classList.add("hidden")

		app.functions.showRelays()
	})

	app.environment.menuCancel.addEventListener("click", async()=>{
		app.functions.hideMenu()
	})
