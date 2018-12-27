
/* Set events for terminal.html */

	// Focus input field unless selecting span text
	self.addEventListener("click", async event=>{
		if (event.target.tagName != "SPAN" && event.target.tagName != "INPUT") {
			textarea.focus()
		}
	})

	// Custom keyboard handler
	self.addEventListener("keydown", async event=>{
		if (!event.ctrlKey) { // unless CTRL key is pressed

			// If nothing is focused, add new character to stdin field
			if ( 
				allowed_characters.includes(event.key) 
				&& !(
					textarea === document.activeElement 
					|| jsfield === document.activeElement
				) 
			) {
				const oldValue = textarea.value,
				      newValue = oldValue + event.key

				textarea.value = newValue

				textarea.focus()
			}

			// Scroll to bottom on StdIn if applicable
			if (scrollOnInput) {
				if (document.activeElement !== jsfield) {
					scrollToBottom()
				}
			}
			if (scrollOnJsInput) {
				if (document.activeElement === jsfield) {
					scrollToBottom()
				}
			}

			// Terminal controls
			if (event.keyCode == 9) { // Tab
				event.preventDefault()

				autoComplete(textarea.value)
			} else if (event.keyCode == 13) { // Enter
				if (document.activeElement === textarea) {
					event.preventDefault()
					onCommand()
				} else if (document.activeElement === jsfield) {
					event.preventDefault()
					onXSSCommand()
				}

				cmd_current = ""
			} else if (event.keyCode == 38) { // Up arrow
				if (cmd_history_i < cmd_history.length) {
					textarea.value = cmd_history[cmd_history_i]

					cmd_history_i += 1

					setTimeout(async()=>{					
						textarea.selectionStart = textarea.selectionEnd = textarea.value.length // todo: make cursor position persistent
					}, 3)
				}
				textarea.focus()
			} else if (event.keyCode == 40) { // Down arrow
				if (cmd_history_i > 0) {
					cmd_history_i -= 1
					textarea.value = cmd_history[cmd_history_i]
				} else {
					textarea.value = cmd_current
				}
				textarea.focus()
			}

		}
	})

	// Set current command value after keystroke is registered
	self.addEventListener("keyup", async event => {
		if ( !(event.keyCode == 9 || event.keyCode == 13 || event.keyCode == 38 || event.keyCode == 40) ) {
			cmd_current = textarea.value
		}
	})

	// Clear button
	document.querySelector("html body div.menu div.item[name=clear]").addEventListener("click", async()=>{
		clear()
	})

	// // Stream microphone button
	// document.querySelector("html body div.menu div.item[name=streammic]").addEventListener("click", async()=>{
	// 	print(request_tag + "<span title='" + timestamp() + "'>Streaming microphone at " + mic_bitrate +  "bps...</span>")
	// 	streamMic(mic_bitrate)
	// })

	// // Stream monitor button
	// document.querySelector("html body div.menu div.item[name=streammon]").addEventListener("click", async()=>{
	// 	print(request_tag + "<span title='" + timestamp() + "'>Streaming monitor at a resolution of " + mon_resolution + " pixels at " + mon_bitrate + "bps...</span>")
	// 	streamMon(mon_bitrate, mon_resolution)
	// })

	// // Stream webcam button
	// document.querySelector("html body div.menu div.item[name=streamcam]").addEventListener("click", async()=>{
	// 	print(request_tag + "<span title='" + timestamp() + "'>Streaming webcam at a resolution of " + cam_resolution + " pixels at " + cam_bitrate + "bps...</span>")
	// 	streamCam(cam_bitrate, cam_resolution)
	// })

	// // End all streams button
	// document.querySelector("html body div.menu div.item[name=endallstreams]").addEventListener("click", async()=>{
	// 	print(request_tag + "<span title='" + timestamp() + "'>Ending all streams...</span>")
	// 	stdIn("ENDALLSTREAMS")
	// 	$("html body div.menu div.item").find("div.rec.blinking").parent().parent().remove()
	// })

	// Window resize handler
	self.addEventListener("resize", async()=>{
		shrinkInputField()

		setTimeout(resetClearBreaks, 100)
	})

	// Warn before quit
	if (warnBeforeClose) {
		self.onbeforeunload = async () => {
			return "Close?"
		}
	}
