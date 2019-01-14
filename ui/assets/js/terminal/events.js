
/* Set events for terminal.html */

	// Focus input field unless selecting span text
	self.addEventListener("click", async(event)=>{
		if (event.target.tagName != "SPAN" && event.target.tagName != "INPUT") {
			app.environment.textarea.focus()
		}
	})

	// Focus input field unless selecting span text
	app.environment.xssButton.addEventListener("click", async event=>{
		app.environment.xssButton.classList.add("show");
		self.addEventListener("click", async function f(event){
			if (event.target.name !== "xssfield") {
				app.environment.xssButton.classList.remove("show");
				this.removeEventListener("click", f);
			}
		});
	})

	// Custom keyboard handler
	self.addEventListener("keydown", async event=>{
		if (!event.ctrlKey) {
			// If nothing is focused, add new character to stdin field
			if ( 
				app.environment.allowedCharacters.includes(event.key) 
				&& !(
					app.environment.textarea === document.activeElement 
					|| app.environment.xssField === document.activeElement
				) 
			) {
				const oldValue = app.environment.textarea.value,
				      newValue = oldValue + event.key

				app.environment.textarea.value = newValue

				app.environment.textarea.focus()
			}

			// Scroll to bottom on StdIn if applicable
			if (app.environment.scrollOnInput) {
				if (document.activeElement !== app.environment.xssField) {
					app.functions.scrollToBottom()
				}
			}
			if (app.environment.scrollOnJsInput) {
				if (document.activeElement === app.environment.xssField) {
					app.functions.scrollToBottom()
				}
			}

			// Terminal controls
			if (event.keyCode == 9) { // Tab
				event.preventDefault()

				const command_slice = app.environment.textarea.value.replace(/^\s*/, "").slice(0, app.environment.textarea.selectionEnd)
				const tabbed_command = command_slice.replace(/.*\s/g, "")

				if (tabbed_command != "") {
					app.functions.autoComplete(tabbed_command, command_slice)
				}
			} else if (event.keyCode == 13) { // Enter
				if (document.activeElement === app.environment.textarea) {
					event.preventDefault()

					app.functions.onCommand()
				} else if (document.activeElement === app.environment.xssField) {
					event.preventDefault()

					app.functions.onXSSCommand()
				}

				app.environment.cmdCurrent = ""
			} else if (event.keyCode == 38) { // Up arrow
				event.preventDefault()

				if (app.environment.cmdHistoryIndex < app.environment.cmdHistory.length) {
					app.environment.textarea.value = app.environment.cmdHistory[app.environment.cmdHistoryIndex]

					app.environment.cmdHistoryIndex += 1

					setTimeout(async()=>{
						app.environment.textarea.selectionStart = app.environment.textarea.selectionEnd = app.environment.textarea.value.length // todo: make cursor position persistent
					}, 3)
				}
				app.environment.textarea.focus()
			} else if (event.keyCode == 40) { // Down arrow
				event.preventDefault()

				if (app.environment.cmdHistoryIndex > 0) {
					app.environment.cmdHistoryIndex -= 1

					app.environment.textarea.value = app.environment.cmdHistory[app.environment.cmdHistoryIndex]
				} else {
					app.environment.textarea.value = app.environment.cmdCurrent
				}
				app.environment.textarea.focus()
			}
		}
	})

	// Set current command value after keystroke is registered
	self.addEventListener("keyup", async event => {
		if ( !(event.keyCode == 9 || event.keyCode == 13 || event.keyCode == 38 || event.keyCode == 40) ) {
			app.environment.cmdCurrent = app.environment.textarea.value
		}
	})

	// Clear button
	document.querySelector("html body div.menu div.item[name=clear]").addEventListener("click", async()=>{
		app.functions.clear()
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
		app.functions.shrinkInputField()

		setTimeout(app.functions.resetClearBreaks, 100)
	})

	// Warn before quit
	if (app.environment.warnBeforeClose) {
		self.onbeforeunload = async () => {
			return "Close?"
		}
	}
