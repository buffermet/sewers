
/* Set functions for index.html */

	// Escape HTML
	escapeHTML = async data => {
		return new String(data).replace(/\&/g, "&amp;").replace(/\</g,"&lt;").replace(/\>/g,"&gt;").replace(/\"/g, "&quot;").replace(/\'/g,"&#39;").replace(/\//g, "&#x2F;").replace(/ /g, "&nbsp;").replace(/\t/g, "&emsp;").replace(/\n/g, "<br>")
	}

	// Log to console
	log = async data => {
		console.log(data)
	}

	// Open terminal in new pop-up tab
	openTerminal = async (relay, session_id) => {
		window.open('./terminal/' + relay + '/' + session_id, session_id +' - TAB' + Math.floor( (Math.random() * 9999) + 1), 'menubar=no,location=no,resizable=yes,scrollbars=no,status=yes')
	}

	// Fetch console log
	fetchLog = async () => {
		let res = await sendRequest("GET", "/console_log", "")

		let response = res.responseText.replace(/\n/g, "<br>")

		if (consoleContainer.innerHTML != response) {
			consoleContainer.innerHTML = response

			scrollOnOutput ? consoleContainer.scrollTop += 999999 : ""
		}
	}

	getSewersConfig = async () => {
		let res = await sendRequest("GET", "/config/sewers", "")

		config = JSON.parse(res.responseText)
	}

	getSewersUserAgent = async () => {
		let res = await sendRequest("GET", "/useragent", "")

		return res.responseText
	}

	showRelays = async () => {
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

		setTimeout(async()=>{
			container.innerHTML = skeleton

			let res = await sendRequest("GET", "/get_relays", "")
			let response = res.responseText

			if (response != "nil") {
				let relays = JSON.parse(response)

				for (var i = 0; i < Object.keys(relays).length; i++) {
					let relay = document.createElement("div")
					relay.name = await escapeHTML(relays[i]["RelayID"])
					relay.className = "relay"
					relay.innerHTML = `
							<span class="relaynumber">RELAY ` + (i + 1) + `</span>
							<span class="name" title="Relay name">` + await escapeHTML(relays[i]["RelayID"]) + `</span>
							<span class="url" title="Relay address">` + await escapeHTML(relays[i]["RelayAddress"]) + `</span>
						`

					document.querySelector("html body div.scrollcontainer div.container div.relaylist div.space")
					.before(relay)
				}

				setTimeout(async()=>{
					await updateTunnelCount()

					currentRelaysNews = 0

					await cycleNews()

					container.classList.remove("hide")
					container.classList.remove("nopointerevents")
				}, 720)
			} else {
				let span = document.createElement("span")
				span.class = "nonefound"
				span.innerText = "No relays found"

				document.querySelector("html body div.scrollcontainer div.container div.relaylist div.space")
				.before(span)

				currentRelaysNews = 0

				await cycleNews()

				container.classList.remove("hide")
				container.classList.remove("nopointerevents")
			}
		}, 360)
	}

	getSessions = async relay => {
		let skeleton = `
			<div class="sessionlist">
				<div class="header">
					<h1>` + await escapeHTML(relay) + `</h1>
					<span class="newsmessage">&nbsp;</span>
				</div>
				<div class="space"></div>
			</div>
		`

		container.classList.add("hide")
		container.classList.add("nopointerevents")

		setTimeout(async()=>{
			container.innerHTML = skeleton

			backbutton.classList.remove("hidden")

			let res = await sendRequest("GET", "/relay/" + relay, "")

			if (res.status == 200) {
				let response = res.responseText

				if ( response != "nil" && response.match(/([a-zA-Z]+)/) ) {
					let sessionlist = response.split(","),

					skeleton = ""

					for (var i = 0; i < sessionlist.length; i++) {
						let url = "./session/" + relay.replace(".json", "") + "/" + sessionlist[i]

						res = await sendRequest("GET", url, "")

						if (res.status == 200) {
							let response = res.responseText

							let session = sessionlist[i]

							if (response != "nil") {
								sessionConfig = JSON.parse(response)
								device = ( sessionConfig["os"].indexOf("Android" || "android") >= 0 ) 
									? "phone" 
									: ( sessionConfig["os"].indexOf("Darwin" || "darwin") >= 0 ) 
									? "laptop"
									: ( sessionConfig["os"].indexOf("cygwin" || "cygwin" || "mswin" || "mingw" || "bccwin" || "wince" || "emx") >= 0 ) 
									? "laptop" 
									: ( sessionConfig["device"].indexOf("Acer Aspire") >= 0 ) 
									? "laptop" 
									: "unknown"
								logo = ( sessionConfig["device"].indexOf("Acer") >= 0 ) 
									? "acer" 
									: ( sessionConfig["os"].indexOf("Android" || "android") >= 0 ) 
									? "android" 
									: ( sessionConfig["os"].indexOf("Darwin" || "darwin") >= 0 ) 
									? "apple" 
									: ( sessionConfig["os"].indexOf("cygwin" || "cygwin" || "mswin" || "mingw" || "bccwin" || "wince" || "emx") >= 0 ) 
									? "windows" 
									: "unknown"
								skeleton += `
									<div class="session">
										<div class="icon ` + await escapeHTML(device) + `">
											<div class="logo ` + await escapeHTML(logo) + `"></div>
										</div>
										<span class="device">` + await escapeHTML(sessionConfig["device"]) + `</span>
										<span class="id">` + await escapeHTML(session) + `</span>
										<span class="hostname">` + await escapeHTML(sessionConfig["hostname"]) + `</span>
									</div>
								`
							} else {
								skeleton += `
									<div class="session unknown">
										<div class="icon unknown"></div>
										<span class="device">` + await escapeHTML(sessionConfig["device"]) + `</span>
										<span class="id">` + await escapeHTML(session) + `</span>
										<span class="hostname">undefined</span>
									</div>"
								`
							}
						}
					}
					// debug
					skeleton += new String(
						"<div class=\"session\">" + 
							"<div class=\"icon router\">" + 
								"<div class=\"logo tplink\"></div>" +
							"</div>" + 
							"<span class=\"device\">Tor Exit TP-Link TL-WR840N</span>" + 
							"<span class=\"id\">aX302ioJjf0mk21</span>" + 
							"<span class=\"hostname\">gateway</span>" + 
						"</div>"
					)
					$("html body div.scrollcontainer div.container div.sessionlist div.space").before(skeleton)
					currentSessionsNews = 0
					cycleNews()
					container.classList.remove("hide")
					container.classList.remove("nopointerevents")
				} else {
					skeleton = new String(
						"<span class=\"nonefound\">No interpreters found</span>" +
						"<div class=\"space\"></div>"
					)
					$("html body div.scrollcontainer div.container div.sessionlist div.space").before(skeleton)
					currentSessionsNews = 0
					cycleNews()
					container.classList.remove("hide")
					container.classList.remove("nopointerevents")
				}
			}

			$.ajax({
				method: "get",
				url: "/relay/" + relay,
				success: r => {
				},
				error: (r, status, error) => {
					print(r.responseText)
					skeleton = new String(
						"<span class=\"nonefound\">Unable to connect to relay</span>" +
						"<div class=\"space\"></div>"
					)
					$("html body div.scrollcontainer div.container div.sessionlist div.space").before(skeleton)
					currentSessionsNews = 0
					cycleNews()
					container.classList.remove("hide")
					container.classList.remove("nopointerevents")
				}
			})
		}, 380)

		updateSessionCount()
	}

	// Update relay count
	updateTunnelCount = async () => {
		relays = $("html body div.scrollcontainer div.container div.relaylist div.relay")
		relays.unbind("click")
		relays.on("click", async event => {
			getSessions(event.currentTarget.children[1].innerText)
		})
	}

	// Update session count
	updateSessionCount = async () => {
		relay = $("html body div.scrollcontainer div.container div.sessionlist div.header h1").text()
		sessions = $("html body div.scrollcontainer div.container div.sessionlist div.session")
		sessions.unbind("click")
		sessions.on("click", async event => {
			openTerminal(relay, event.currentTarget.querySelector("span.id").innerText)
		})
	}

	// Override CSS
	updateCSS = async () => {
		// Console resizing
		let newHeight = parseInt( config["console_height"] )
		webConsole.style.height = newHeight
		topbar.style.bottom = (newHeight - 1) + "px"
		scrollContainer.style.height = "calc(100% - " + newHeight + "px)"

		// Center message box
		let messageboxHeight = messageBox.getBoundingClientRect().height
		messageBox.style.marginTop = "-" + ( (messageboxHeight / 2) + 20 ) + "px"

		// Center modal box
		let openModalBox = document.querySelector("html body div.fade div.modalbox.open")
		let openOptions = document.querySelector("html body div.fade div.modalbox.open div.optionbox ul")
		if (openModalBox) {
			openModalBox.css( "min-height", "calc(" + openOptions.getBoundingClientRect().height + "px + 44px)" )
			modalboxHeight = openModalBox.getBoundingClientRect().height
			openModalBox.css( "margin-top", "-" + ( (modalboxHeight / 2) + 20 ) + "px" )
		}
	}

	// Print to console
	print = async string => {
		consoleContainer.append(string + "<br>")
	}

	// Fetch new HTML
	// fetchHTML = (address, element) => {
	// 	$.ajax({
	// 		method: "get",
	// 		url: address,
	// 		success: r => {
	// 			if (element.html() != r) {
	// 				element.animate({"opacity":"0"}, 360)
	// 				setTimeout(async()=>{
	// 					element.html(r)
	// 					element.animate({"opacity":"1"}, 360)
	// 				}, 360)
	// 			}
	// 		}
	// 	})
	// }

	// Show message box
	showMessage = async (title, message) => {
		messageTitle.innerText = title
		messageBody.innerHTML = message
		fade.classList.remove("hide")
		setTimeout(async()=>{
			messageBox.classList.remove("down")
			updateCSS()
		}, 180)
	}

	// Close message box
	hideMessage = async () => {
		messageBox.classList.add("up")
		setTimeout(async()=>{
			fade.classList.add("hide")
			setTimeout(async()=>{
				messageBox.classList.remove("up")
				messageBox.classList.add("down")
			}, 360)
		}, 180)
	}

	// Show modal box
	showPreferences = async () => {
		$("html body div.fade div.modalbox.settings").classList.add("open")
		openModalBox = $("html body div.fade div.modalbox.open")
		fade.classList.remove("hide")
		setTimeout(async()=>{
			openModalBox.classList.remove("down")
			updateCSS()
		}, 180)
	}

	// Hide modal box
	hideMenu = async () => {
		openModalBox.classList.add("up")
		setTimeout(async()=>{
			fade.classList.add("hide")
			setTimeout(async()=>{
				openModalBox.classList.remove("up")
				openModalBox.classList.add("down")
				modalBoxes.classList.remove("open")
			}, 360)
		}, 180)
	}

	// Cycle news messages
	cycleNews = async () => {
		// Update vars
		let newsMessage = document.querySelector("html body div.scrollcontainer div.container div div.header span.newsmessage")
		let newsMessageRelays = document.querySelector("html body div.scrollcontainer div.container div.relaylist div.header span.newsmessage")
		let newsMessageSessions = document.querySelector("html body div.scrollcontainer div.container div.sessionlist div.header span.newsmessage")
		// Update news messages
		updateTunnelCount()
		updateSessionCount()
		newsRelays = {
			0: relays.length + " relay" + (relays.length > 1 || relays.length < 1 ? "s" : ""),
			1: "User-Agent: <span style=\"font-weight:bold\">" + await escapeHTML( await getSewersUserAgent() ) + "</span>",
		},
		newsSessions = {
			0: sessions.length + " session" + (sessions.length > 1 || sessions.length < 1 ? "s" : ""),
			1: "User-Agent: <span style=\"font-weight:bold\">" + await escapeHTML( await getSewersUserAgent() ) + "</span>",
		}

		// Cycle
		newsMessage.classList.add('hide')
		if ( currentRelaysNews == Object.keys(newsRelays).length ) {
			currentRelaysNews = 0
		}
		if ( currentSessionsNews == Object.keys(newsSessions).length ) {
			currentSessionsNews = 0
		}
		setTimeout(async()=>{
			if (newsMessageRelays) {
				newsMessageRelays.innerHTML = newsRelays[currentRelaysNews]
				newsMessageRelays.classList.remove("hide")
				currentRelaysNews += 1
			}
			if (newsMessageSessions) {
				newsMessageSessions.innerHTML = newsSessions[currentSessionsNews]
				newsMessageSessions.classList.remove("hide")
				currentSessionsNews += 1
			}
		}, 360)
	}

	// Close sewers
	quit = async () => {
		location = "/quit"
	}
