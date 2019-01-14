
/*
*	
*	Sewers UI index fuctions package
*	
*/

	// Sleep
	app.functions.sleep = async seconds => {
		return new Promise(async(resolve)=>{
			setTimeout(resolve, seconds * 1000)
		})
	}

	// Escape HTML
	app.functions.escapeHTML = async data => {
		return new String(data)
		.replace(/\&/g, "&amp;")
		.replace(/\</g,"&lt;")
		.replace(/\>/g,"&gt;")
		.replace(/\"/g, "&quot;")
		.replace(/\'/g,"&#39;")
		.replace(/\\/g, "&#92;")
		.replace(/\//g, "&#x2F;")
		.replace(/ /g, "&nbsp;")
		.replace(/\t/g, "&emsp;")
		.replace(/\n/g, "<br>")
	}

	// Log to console
	app.functions.log = async data => {
		console.log(data)
	}

	// Open terminal in new pop-up tab
	app.functions.openTerminal = async (relay, session_id) => {
		self.open('./terminal/' + relay + '/' + session_id, session_id +' - TAB' + Math.floor( (Math.random() * 9999) + 1), 'menubar=no,location=no,resizable=yes,scrollbars=no,status=yes')
	}

	// Fetch console log
	app.functions.fetchLog = async () => {
		app.http.Request("GET", "/console_log", [[]], null).then(async(res)=>{
			if (res.status == 200) {
				const logs = res.responseText.replace(/\n/g, "<br>")

				if (app.environment.consoleContainer.innerHTML != logs) {
					app.environment.consoleContainer.innerHTML = logs

					app.environment.scrollOnOutput ? app.environment.consoleContainer.scrollTop += 999999 : ""
				}
			} else {
				print("<span class=\"bold grey\">&nbsp;" + await app.functions.timestamp() + "&nbsp;</span><span>Could not connect to sewers.</span><br>")
			}
		})
	}

	app.functions.getRelayConfig = async relay_id => {
		return new Promise(async(resolve)=>{
			app.http.Request("GET", "/config/" + relay_id, [[]], null).then(async(res)=>{
				if (res.status == 200) {
					resolve(res.responseText)
				} else {
					print("Could not fetch sewers config.")
					resolve()
				}
			})
		})
	}

	app.functions.getSewersConfig = async () => {
		return new Promise(async(resolve)=>{
			app.http.Request("GET", "/config/sewers", [[]], null).then(async(res)=>{
				if (res.status == 200) {
					sewersConfig = JSON.parse(res.responseText)
					resolve()
				} else {
					print("Could not fetch sewers config.")
					resolve()
				}
			})
		})
	}

	app.functions.whoAmI = async () => {
		const res = await app.http.Request("GET", "/host", [[]], null)

		whoami = res.responseText
	}

	app.functions.showRelays = async () => {
		app.environment.container.classList.add("hide")
		app.environment.container.classList.add("nopointerevents")

		app.functions.sleep(0.4).then(async()=>{
			app.environment.container.innerHTML = new String( 
				"<div class=\"relaylist\">" + 
					"<div class=\"header\">" + 
						"<h1>Relays</h1>" + 
						"<span class=\"newsmessage\">&nbsp;</span>" + 
					"</div>" + 
					"<div class=\"space\"></div>" + 
				"</div>" 
			)

			const relay_news_message = document.querySelector("html body div.scrollcontainer div.container div.relaylist div.header span.newsmessage")
			relay_news_message.classList.add("hide")

			const res = await app.http.Request("GET", "/relays", [[]], null)

			if (res.responseText.length > 0) {
				const relay_configs = JSON.parse(res.responseText)

				for (let i = 0; i < Object.keys(relay_configs).length; i++) {
					const relay_address = await app.functions.escapeHTML(relay_configs[i].RelayAddress),
					      relay_id = await app.functions.escapeHTML(relay_configs[i].RelayID),
					      relay = document.createElement("div")

					relay.name = await app.functions.escapeHTML(relay_configs[i].RelayID)
					relay.className = "relay"
					relay.innerHTML = new String( 
						"<span class=\"relaynumber\">RELAY " + (i + 1) + "</span>" + 
						"<span class=\"name\" title=\"" + relay_id + "\">" + relay_id + "</span>" + 
						"<span class=\"url\" title=\"" + relay_address + "\">" + relay_address + "</span>" 
					)
					relay.onclick = async () => {
						app.functions.showSessions(relay_configs[i].RelayID)
					}

					document.querySelector("html body div.scrollcontainer div.container div.relaylist div.space").before(relay)
				}
			} else {
				let span = document.createElement("span")
				span.class = "nonefound"
				span.innerText = "No relays found"

				document.querySelector("html body div.scrollcontainer div.container div.relaylist div.space").before(span)
			}

			currentRelaysNews = 0

			app.functions.cycleNews().then(async()=>{
				app.environment.container.classList.remove("hide")
				app.environment.container.classList.remove("nopointerevents")
			})

		})

		relays = document.querySelectorAll("html body div.scrollcontainer div.container div.relaylist div.relay")
	}

	app.functions.showSessions = async relay_id => {
		currentRelay = relay_id

		const res = await app.http.Request("GET", "/config/" + relay_id, [[]], null)
		// catch stuff
		const currentRelayConfig = JSON.parse(res.responseText)

		app.environment.relayUserAgent = currentRelayConfig.user_agent

		app.environment.container.classList.add("hide")
		app.environment.container.classList.add("nopointerevents")

		app.functions.sleep(0.4).then(async()=>{
			app.environment.container.innerHTML = new String( 
				"<div class=\"sessionlist\">" + 
					"<div class=\"header\">" + 
						"<h1>" + await app.functions.escapeHTML(relay_id) + "</h1>" + 
						"<span class=\"newsmessage\">&nbsp;</span>" + 
					"</div>" + 
					"<div class=\"space\"></div>" + 
				"</div>" 
			)

			const SessionsNewsMessage = document.querySelector("html body div.scrollcontainer div.container div.sessionlist div.header span.newsmessage")
			SessionsNewsMessage.classList.add("hide")

			app.environment.backbutton.classList.remove("hidden")

			const res = await app.http.Request("GET", "/relay/" + relay_id , [[]], null)

			if (res.status == 200) {
				if (res.responseText != "") {
					const sessionlist = res.responseText.split(",")

					for (let i = 0; i < sessionlist.length; i++) {
						const url = "/session/" + relay_id + "/" + sessionlist[i]

						const div = document.createElement("div")

						app.http.Request("GET", url, [[]], null).then(async(res)=>{
							if (res.status == 200) {
								const session_id = sessionlist[i]

								if (res.responseText != "") {
									const sessionConfig = JSON.parse(res.responseText)

									div.onclick = async () => { app.functions.openTerminal(relay_id, session_id) }
									div.className = "session"
									div.innerHTML = new String( 
										"<div class=\"icon " + await app.functions.escapeHTML(sessionConfig.icon) + "\">" + 
											"<div class=\"logo " + await app.functions.escapeHTML(sessionConfig.logo) + "\"></div>" + 
										"</div>" + 
										"<span class=\"device\" title=\"Device: " + await app.functions.escapeHTML(sessionConfig.device) + "\">" + await app.functions.escapeHTML(sessionConfig.device) + "</span>" + 
										"<span class=\"id\" title=\"Session ID: " + await app.functions.escapeHTML(session_id) + "\">" + await app.functions.escapeHTML(session_id) + "</span>" + 
										"<span class=\"hostname\" title=\"Hostname: " + await app.functions.escapeHTML(sessionConfig.hostname) + "\">" + await app.functions.escapeHTML(sessionConfig.hostname) + "</span>" 
									)
								} else {
									div.className = "session unknown"
									div.innerHTML = new String( 
										"<div class=\"icon unknown\"></div>" + 
										"<span class=\"device\" title=\"Device: unknown\">unknown device</span>" + 
										"<span class=\"id\" title=\"Session ID: " + await app.functions.escapeHTML(session_id) + "\">" + await app.functions.escapeHTML(session_id) + "</span>" + 
										"<span class=\"hostname\" title=\"Hostname: unknown\">unknown hostname</span>" 
									)
								}

								document.querySelector("html body div.scrollcontainer div.container div.sessionlist div.space").before(div)
							}
						})
					}
					// debug
					div = document.createElement("div")
					div.className = "session"
					div.innerHTML = new String( 
						"<div class=\"icon router\">" + 
							"<div class=\"logo tplink\"></div>" + 
						"</div>" + 
						"<span class=\"device\">TP-Link TL-WR840N</span>" + 
						"<span class=\"id\">aX302</span>" + 
						"<span class=\"hostname\">gateway</span>" 
					)
					document.querySelector("html body div.scrollcontainer div.container div.sessionlist div.space").before(div)
				} else {
					print( await app.functions.escapeHTML(res.responseText) )

					let span = document.createElement("span")
					let div = document.createElement("div")
					span.className = "nonefound"
					span.innerText = "No interpreters found"
					div.className = "space"

					document.querySelector("html body div.scrollcontainer div.container div.sessionlist div.space").before(span)
					document.querySelector("html body div.scrollcontainer div.container div.sessionlist div.space").before(div)
				}
			} else {
				let span = document.createElement("span")
				span.className = "nonefound"
				span.innerText = "Unable to connect to relay"

				document.querySelector("html body div.scrollcontainer div.container div.sessionlist div.space").before(span)
			}

			app.environment.currentSessionsNews = 0

			app.functions.cycleNews().then(async()=>{
				app.environment.container.classList.remove("hide")
				app.environment.container.classList.remove("nopointerevents")
			})
		})

		sessions = document.querySelectorAll("html body div.scrollcontainer div.container div.sessionlist div.session")
	}

	// Override CSS
	app.functions.updateCSS = async () => {
		// Console resizing
		let newHeight = parseInt(sewersConfig.console_height)

		app.environment.webConsole.style.height = newHeight + "px"
		app.environment.topbar.style.bottom = (newHeight - 1) + "px"
		app.environment.scrollContainer.style.height = "calc(100% - " + newHeight + "px)"

		// Center message box
		let messageboxHeight = app.environment.messageBox.getBoundingClientRect().height
		app.environment.messageBox.style.marginTop = "-" + ( (messageboxHeight / 2) + 20 ) + "px"

		// Refresh & center modal
		app.environment.openModal = document.querySelector("html body div.fade div.modal.open")
		app.environment.openOption = document.querySelector("html body div.fade div.modal.open div.optionbox ul")
		if (app.environment.openModal) {
			app.environment.openOption.parentElement.style = "min-height: calc(" + (app.environment.openOption.parentElement.children.length * 43) + "px + 44px);"
			app.environment.openModal.style = "min-height: calc(" + app.environment.openOption.getBoundingClientRect().height + "px + 44px);"
			modalHeight = app.environment.openModal.getBoundingClientRect().height
			app.environment.openModal.style = "margin-top: -" + ( (modalHeight / 2) + 20 ) + "px;"
		}
	}

	// Print to console
	app.functions.print = async html => {
		const timestamped = document.createElement("stamp")

		timestamped.setAttribute( "time", new Date() )
		timestamped.innerHTML = html

		app.environment.consoleContainer.append(timestamped)
	}

	// Return readable timestamp
	app.functions.timestamp = async () => {
		const now = new Date()

		let D = now.getDate(),
		    M = now.getMonth() + 1,
		    Y = now.getFullYear(),
		    h = now.getHours(),
		    m = now.getMinutes(),
		    s = now.getSeconds()

		D < 10 ? D = "0" + D : ""
		M < 10 ? M = "0" + M : ""
		Y < 10 ? Y = "0" + Y : ""
		h < 10 ? h = "0" + h : ""
		m < 10 ? m = "0" + m : ""
		s < 10 ? s = "0" + s : ""

		return D + "-" + M + "-" + Y + " " + h + ":" + m + ":" + s
	}

	// Show message box
	app.functions.showMessage = async (title, message) => {
		app.environment.messageTitle.innerText = title
		app.environment.messageBody.innerHTML = message

		app.environment.fade.classList.remove("hide")

		app.functions.sleep(0.2).then(async()=>{
			app.environment.messageBox.classList.remove("down")

			app.functions.updateCSS()
		})
	}

	// Close message box
	app.functions.hideMessage = async () => {
		app.environment.messageBox.classList.add("up")

		setTimeout(async()=>{
			app.environment.fade.classList.add("hide")

			setTimeout(async()=>{
				app.environment.messageBox.classList.add("down")
				app.environment.messageBox.classList.remove("up")
			}, 360)
		}, 180)
	}

	// Show modal
	app.functions.showPreferences = async () => {
		app.environment.openModal = document.querySelector("html body div.fade div.modal.settings")

		if (app.environment.openModal) {
			app.environment.fade.classList.remove("hide")

			setTimeout(async()=>{
				app.environment.openModal.classList.remove("down")
				app.environment.openModal.classList.add("up")
				app.functions.updateCSS()
			}, 180)
		}
	}

	// Hide modal
	app.functions.hideMenu = async () => {
		app.environment.openModal = document.querySelector("html body div.fade div.modal.settings")

		if (app.environment.openModal) {
			app.environment.openModal.classList.remove("up")
			app.environment.openModal.classList.add("down")

			setTimeout(async()=>{
				app.environment.fade.classList.add("hide")
			}, 180)
		}
	}

	// Cycle news messages
	app.functions.cycleNews = async () => {
		// Update vars
		const relay_news_message = document.querySelector("html body div.scrollcontainer div.container div.relaylist div.header span.newsmessage")
		const SessionsNewsMessage = document.querySelector("html body div.scrollcontainer div.container div.sessionlist div.header span.newsmessage")

		app.environment.newsMessage = document.querySelector("html body div.scrollcontainer div.container div div.header span.newsmessage")
		app.environment.newsMessage.classList.add('hide')

		app.environment.relays = document.querySelectorAll("html body div.scrollcontainer div.container div.relaylist div.relay")
		app.environment.sessions = document.querySelectorAll("html body div.scrollcontainer div.container div.sessionlist div.session")

		// Cycle
		newsRelays = {
			0: app.environment.relays.length + " relay" + (app.environment.relays.length > 1 || app.environment.relays.length < 1 ? "s" : ""),
			1: "Host: <span style=\"font-weight:bold\">" + await app.functions.escapeHTML(whoami) + "</span>",
		}
		newsSessions = {
			0: app.environment.sessions.length + " session" + (app.environment.sessions.length > 1 || app.environment.sessions.length < 1 ? "s" : ""),
			1: "User-Agent: <span style=\"font-weight:bold\">" + await app.functions.escapeHTML(app.environment.relayUserAgent) + "</span>",
		}

		if ( currentRelaysNews == Object.keys(newsRelays).length ) {
			currentRelaysNews = 0
		}
		if ( app.environment.currentSessionsNews == Object.keys(newsSessions).length ) {
			app.environment.currentSessionsNews = 0
		}

		setTimeout(async()=>{
			if (relay_news_message) {
				relay_news_message.innerHTML = newsRelays[currentRelaysNews]
				relay_news_message.classList.remove("hide")
				currentRelaysNews += 1
			}
			if (SessionsNewsMessage) {
				SessionsNewsMessage.innerHTML = newsSessions[app.environment.currentSessionsNews]
				SessionsNewsMessage.classList.remove("hide")
				app.environment.currentSessionsNews += 1
			}
		}, 400)
	}

	// Hide and shut down sewers.
	app.functions.quit = async () => {
		self.stop()

		app.http.Request("GET", "/quit", [[]], null).then(async()=>{
			document.documentElement.innerHTML = ""
			document.title = "Untitled"

			setTimeout(async()=>{
				self.location = self.location
			}, 600)
		})
	}
