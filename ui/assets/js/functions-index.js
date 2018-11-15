
/* Set functions for index.html */

	// Sleep
	const sleep = async seconds => {
		return new Promise(async(resolve)=>{
			setTimeout(resolve, seconds * 1000)
		})
	}

	// Escape HTML
	const escapeHTML = async data => {
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
	const log = async data => {
		console.log(data)
	}

	// Open terminal in new pop-up tab
	const openTerminal = async (relay, session_id) => {
		self.open('./terminal/' + relay + '/' + session_id, session_id +' - TAB' + Math.floor( (Math.random() * 9999) + 1), 'menubar=no,location=no,resizable=yes,scrollbars=no,status=yes')
	}

	// Fetch console log
	const fetchLog = async () => {
		sendRequest("GET", "/console_log", null).then(async(res)=>{
			if (res.status == 200) {
				let response = res.responseText.replace(/\n/g, "<br>")

				if (consoleContainer.innerHTML != response) {
					consoleContainer.innerHTML = response

					scrollOnOutput ? consoleContainer.scrollTop += 999999 : ""
				}
			} else {
				print("<span class=\"bold grey\">&nbsp;" + await timestamp() + "&nbsp;</span><span>Could not connect to sewers.</span><br>")
			}
		})
	}

	const getRelayConfig = async relay_id => {
		return new Promise(async(resolve)=>{
			sendRequest("GET", "/config/" + relay_id, null).then(async(res)=>{
				if (res.status == 200) {
					resolve(res.responseText)
				} else {
					print("Could not fetch sewers config.")
					resolve()
				}
			})
		})
	}

	const getSewersConfig = async () => {
		return new Promise(async(resolve)=>{
			sendRequest("GET", "/config/sewers", null).then(async(res)=>{
				if (res.status == 200) {
					resolve(res.responseText)
				} else {
					print("Could not fetch sewers config.")
					resolve()
				}
			})
		})
	}

	const whoAmI = async () => {
		let res = await sendRequest("GET", "/host", null)

		return res.responseText
	}

	const showRelays = async () => {
		let skeleton = `
			<div class="relaylist">
				<div class="header">
					<h1>Relays</h1>
					<span class="newsmessage">&nbsp;</span>
				</div>
				<div class="space"></div>
			</div>
		`

		container.classList.add("hide")
		container.classList.add("nopointerevents")

		sleep(0.4).then(()=>{
			container.innerHTML = skeleton

			const relayNewsMessage = document.querySelector("html body div.scrollcontainer div.container div.relaylist div.header span.newsmessage")
			relayNewsMessage.classList.add("hide")

			sendRequest("GET", "/get_relays", null).then(async(res)=>{
				const response = res.responseText

				if (response.length > 0) {
					const relay_configs = JSON.parse(response)

					for (let i = 0; i < Object.keys(relay_configs).length; i++) {
						const relay_address = await escapeHTML(relay_configs[i].RelayAddress),
						      relay_id = await escapeHTML(relay_configs[i].RelayID)

						let relay = document.createElement("div")

						relay.name = await escapeHTML(relay_configs[i].RelayID)
						relay.className = "relay"
						relay.innerHTML = `
							<span class="relaynumber">RELAY ` + (i + 1) + `</span>
							<span class="name" title="` + relay_id + `">` + relay_id + `</span>
							<span class="url" title="` + relay_address + `">` + relay_address + `</span>
						`
						relay.onclick = async () => {
							showSessions(relay_configs[i].RelayID)
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

				cycleNews().then(async()=>{
					container.classList.remove("hide")
					container.classList.remove("nopointerevents")
				})
			})
		})

		relays = document.querySelectorAll("html body div.scrollcontainer div.container div.relaylist div.relay")
	}

	const showSessions = async relay_id => {
		currentRelay = relay_id

		let res = await sendRequest("GET", "/config/" + relay_id, null)
		let currentRelayConfig = JSON.parse(res.responseText)

		relayUserAgent = currentRelayConfig.user_agent

		container.classList.add("hide")
		container.classList.add("nopointerevents")

		sleep(0.4).then(async()=>{
			container.innerHTML = `
				<div class="sessionlist">
					<div class="header">
						<h1>` + await escapeHTML(relay_id) + `</h1>
						<span class="newsmessage">&nbsp;</span>
					</div>
					<div class="space"></div>
				</div>
			`

			const SessionsNewsMessage = document.querySelector("html body div.scrollcontainer div.container div.sessionlist div.header span.newsmessage")
			SessionsNewsMessage.classList.add("hide")

			backbutton.classList.remove("hidden")

			sendRequest("GET", "/relay/" + relay_id, null).then(async(res)=>{
				if (res.status == 200) {
					if ( res.responseText != "nil" && res.responseText.match(/([a-zA-Z]+)/) ) {
						let sessionlist = res.responseText.split(",")

						for (let i = 0; i < sessionlist.length; i++) {
							let url = "./session/" + relay_id.replace(".json", "") + "/" + sessionlist[i]

							let div = document.createElement("div")

							sendRequest("GET", url, null).then(async(res)=>{
								if (res.status == 200) {
									let session_id = sessionlist[i]

									if (res.responseText != "") {
										let sessionConfig = JSON.parse(res.responseText)

										div.onclick = async () => { openTerminal(relay_id, session_id) }
										div.className = "session"
										div.innerHTML = `
											<div class="icon ` + await escapeHTML(sessionConfig.icon) + `">
												<div class="logo ` + await escapeHTML(sessionConfig.logo) + `"></div>
											</div>
											<span class="device" title="Device">` + await escapeHTML(sessionConfig.device) + `</span>
											<span class="id" title="Session ID">` + await escapeHTML(session_id) + `</span>
											<span class="hostname" title="Hostname">` + await escapeHTML(sessionConfig.hostname) + `</span>
										`
									} else {
										div.className = "session unknown"
										div.innerHTML = `
											<div class="icon unknown"></div>
											<span class="device" title="Device">unknown device</span>
											<span class="id" title="Session ID">` + await escapeHTML(session_id) + `</span>
											<span class="hostname" title="Hostname">unknown hostname</span>
										`
									}

									document.querySelector("html body div.scrollcontainer div.container div.sessionlist div.space").before(div)
								}
							})
						}
						// debug
						div = document.createElement("div")
						div.className = "session"
						div.innerHTML = `
							<div class="icon router">
								<div class="logo tplink"></div>
							</div>
							<span class="device">Tor Exit TP-Link TL-WR840N</span>
							<span class="id">aX302ioJjf0mk21</span>
							<span class="hostname">gateway</span>
						`
						document.querySelector("html body div.scrollcontainer div.container div.sessionlist div.space").before(div)
					} else {
						print(response)

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

				currentSessionsNews = 0

				cycleNews().then(async()=>{
					container.classList.remove("hide")
					container.classList.remove("nopointerevents")
				})
			})
		})

		sessions = document.querySelectorAll("html body div.scrollcontainer div.container div.sessionlist div.session")
	}

	// Override CSS
	const updateCSS = async () => {
		// Console resizing
		let newHeight = parseInt(config.console_height)

		webConsole.style.height = newHeight + "px"
		topbar.style.bottom = (newHeight - 1) + "px"
		scrollContainer.style.height = "calc(100% - " + newHeight + "px)"

		// Center message box
		let messageboxHeight = messageBox.getBoundingClientRect().height
		messageBox.style.marginTop = "-" + ( (messageboxHeight / 2) + 20 ) + "px"

		// Center modal
		let openModal = document.querySelector("html body div.fade div.modal.open")
		let openOptions = document.querySelector("html body div.fade div.modal.open div.optionbox ul")
		if (openModal) {
			openModal.css( "min-height", "calc(" + openOptions.getBoundingClientRect().height + "px + 44px)" )
			modalHeight = openModal.getBoundingClientRect().height
			openModal.css( "margin-top", "-" + ( (modalHeight / 2) + 20 ) + "px" )
		}
	}

	// Network activity indicator
	const showNetworkIndicator = async () => {
		const network_indicator = document.querySelector("html body div.menu div.item div.network-indicator")

		network_indicator.classList.remove("hidden")
	}

	// Network activity indicator
	const hideNetworkIndicator = async () => {
		const network_indicator = document.querySelector("html body div.menu div.item div.network-indicator")

		network_indicator.classList.add("hidden")
	}

	// Print to console
	const print = async html => {
		const timestamped = document.createElement("stamp")

		timestamped.setAttribute( "time", new Date() )
		timestamped.innerHTML = html

		consoleContainer.append(timestamped)
	}

	// Return readable timestamp
	const timestamp = async () => {
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
	const showMessage = async (title, message) => {
		messageTitle.innerText = title
		messageBody.innerHTML = message

		fade.classList.remove("hide")

		sleep(0.2).then(async()=>{
			messageBox.classList.remove("down")

			updateCSS()
		})
	}

	// Close message box
	const hideMessage = async () => {
		messageBox.classList.add("up")

		setTimeout(async()=>{
			fade.classList.add("hide")

			setTimeout(async()=>{
				messageBox.classList.add("down")
				messageBox.classList.remove("up")
			}, 360)
		}, 180)
	}

	// Show modal
	const showPreferences = async () => {
		const openModal = document.querySelector("html body div.fade div.modal.settings")

		if (openModal) {
			openModal.classList.add("open")

			fade.classList.remove("hide")

			setTimeout(async()=>{
				openModal.classList.remove("down")
				updateCSS()
			}, 180)
		}
	}

	// Hide modal
	const hideMenu = async () => {
		openModal.classList.add("up")

		setTimeout(async()=>{
			fade.classList.add("hide")

			setTimeout(async()=>{
				openModal.classList.remove("up")
				openModal.classList.add("down")
				modales.classList.remove("open")
			}, 360)
		}, 180)
	}

	// Cycle news messages
	const cycleNews = async () => {
		// Update vars
		const newsMessage = document.querySelector("html body div.scrollcontainer div.container div div.header span.newsmessage")
		const relayNewsMessage = document.querySelector("html body div.scrollcontainer div.container div.relaylist div.header span.newsmessage")
		const SessionsNewsMessage = document.querySelector("html body div.scrollcontainer div.container div.sessionlist div.header span.newsmessage")

		newsMessage.classList.add('hide')

		const relays = document.querySelectorAll("html body div.scrollcontainer div.container div.relaylist div.relay")
		const sessions = document.querySelectorAll("html body div.scrollcontainer div.container div.sessionlist div.session")

		// Cycle
		newsRelays = {
			0: relays.length + " relay" + (relays.length > 1 || relays.length < 1 ? "s" : ""),
			1: "Host: <span style=\"font-weight:bold\">" + await escapeHTML( await whoAmI() ) + "</span>",
		}
		newsSessions = {
			0: sessions.length + " session" + (sessions.length > 1 || sessions.length < 1 ? "s" : ""),
			1: "User-Agent: <span style=\"font-weight:bold\">" + await escapeHTML(relayUserAgent) + "</span>",
		}

		if ( currentRelaysNews == Object.keys(newsRelays).length ) {
			currentRelaysNews = 0
		}
		if ( currentSessionsNews == Object.keys(newsSessions).length ) {
			currentSessionsNews = 0
		}

		setTimeout(async()=>{
			if (relayNewsMessage) {
				relayNewsMessage.innerHTML = newsRelays[currentRelaysNews]
				relayNewsMessage.classList.remove("hide")
				currentRelaysNews += 1
			}
			if (SessionsNewsMessage) {
				SessionsNewsMessage.innerHTML = newsSessions[currentSessionsNews]
				SessionsNewsMessage.classList.remove("hide")
				currentSessionsNews += 1
			}
		}, 400)
	}

	// Hide and shut down sewers.
	const quit = async () => {
		self.stop()

		sendRequest("GET", "/quit", null)
		.then(async()=>{
			document.documentElement.innerHTML = ""
			document.title = "Untitled"

			setTimeout(async()=>{
				self.location = self.location
			}, 600)
		})
	}
