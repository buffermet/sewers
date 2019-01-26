
/*
*	
*	Sewers UI terminal events package
*	
*/

	// Focus input field unless selecting span text
	self.addEventListener("click", async(event)=>{
		if (event.target.tagName != "SPAN" && event.target.tagName != "INPUT" && event.target.tagName != "STAMP") {
			app.environment.textarea.focus()
		}
	});

	// Focus input field unless selecting span text
	app.environment.xssButton.addEventListener("mousedown", async(event)=>{
		app.environment.xssButton.setAttribute("data-state", "on");
		self.addEventListener("click", async function a(event){
			if (event.target.name !== "xssfield") {
				app.environment.xssButton.setAttribute("data-state", "off");
				this.removeEventListener("click", a);
			}
		});
	});

	// Custom keyboard handler
	self.addEventListener("keydown", async(event)=>{
		if (!event.ctrlKey) {
			// If nothing is focused, focus stdin field
			if ( 
				app.environment.allowedCharacters.includes(event.key) 
				&& !(
					app.environment.textarea === document.activeElement 
					|| app.environment.xssField === document.activeElement
				) 
			) {
				app.environment.textarea.focus();
			}

			// Scroll to bottom on StdIn if preferred
			if (app.environment.scrollOnInput) {
				if (document.activeElement !== app.environment.xssField) {
					app.functions.scrollToBottom();
				}
			}
			if (app.environment.scrollOnJsInput) {
				if (document.activeElement === app.environment.xssField) {
					app.functions.scrollToBottom();
				}
			}

			// Terminal controls
			if (event.keyCode == 9) { // Tab
				event.preventDefault();

				const cursor_position = app.environment.textarea.selectionEnd;
				const command = app.environment.textarea.value;
				const current_command = app.environment.textarea.value.replace(/^\s*/, "").replace(/\s.*/, "");
				const tabbed_command = app.environment.textarea.value.slice(0, cursor_position).replace(/.*\s/, "");
				const pre_cursor = app.environment.textarea.value.slice(0, cursor_position);
				let choices;
				if ( !tabbed_command.match(/^\s*$/) ) {
					if ( command.match( new RegExp( "^\\s*" + await app.functions.escapeRegExp(tabbed_command) + "$" ) ) ) {
						if (app.streams.current == "") {
							choices = Object.keys(app.commands.builtin).concat( Object.keys(app.commands.pluggedin) ).sort(function(a,b){
								return a.length - b.length;
							});
						} else {
							switch (app.streams.active[app.streams.current].type) {
								case "microphone":
									choices = Object.keys(app.commands.microphone).sort(function(a,b){
										return a.length - b.length;
									});
									break;
								case "monitor":
									choices = Object.keys(app.commands.monitor).sort(function(a,b){
										return a.length - b.length;
									});
									break;
								case "shell":
									choices = Object.keys(app.commands.shell).sort(function(a,b){
										return a.length - b.length;
									});
									break;
								case "webcam":
									choices = Object.keys(app.commands.webcam).sort(function(a,b){
										return a.length - b.length;
									});
							}
						}

						app.functions.autoComplete(command, tabbed_command, pre_cursor, choices);
					} else {
						if (app.streams.current == "") {
							Object.keys(app.commands.builtin).forEach(async(option)=>{
								if (current_command == option) {
									app.commands.builtin[option].autocomplete(command, cursor_position);
								}
							});
						} else {
							switch (app.streams.active[app.streams.current].type) {
								case "microphone":
									Object.keys(app.commands.microphone).forEach(async(option)=>{
										if (current_command == option) {
											app.commands.microphone[option].autocomplete(command, cursor_position);
										}
									});
									break;
								case "monitor":
									Object.keys(app.commands.monitor).forEach(async(option)=>{
										if (current_command == option) {
											app.commands.monitor[option].autocomplete(command, cursor_position);
										}
									});
									break;
								case "shell":
									Object.keys(app.commands.shell).forEach(async(option)=>{
										if (current_command == option) {
											app.commands.shell[option].autocomplete(command, cursor_position);
										}
									});
									break;
								case "webcam":
									Object.keys(app.commands.webcam).forEach(async(option)=>{
										if (current_command == option) {
											app.commands.webcam[option].autocomplete(command, cursor_position);
										}
									});
							}
						}
					}
				}
			} else if (event.keyCode == 13) { // Enter
				if (document.activeElement === app.environment.textarea) {
					event.preventDefault();

					app.functions.onCommand();
				} else if (document.activeElement === app.environment.xssField) {
					event.preventDefault();

					app.functions.onXSSCommand();
				}

				app.environment.cmdCurrent = ""
			} else if (event.keyCode == 38) { // Up arrow
				event.preventDefault();

				if (app.environment.cmdHistoryIndex < app.environment.cmdHistory.length) {
					app.environment.textarea.value = app.environment.cmdHistory[app.environment.cmdHistoryIndex];

					app.environment.cmdHistoryIndex++;

					// todo: make cursor position persistent
					app.environment.textarea.selectionStart = app.environment.textarea.selectionEnd = app.environment.textarea.value.length;
				}
				app.environment.textarea.focus();
			} else if (event.keyCode == 40) { // Down arrow
				event.preventDefault();

				if (app.environment.cmdHistoryIndex > 0) {
					app.environment.cmdHistoryIndex--;

					app.environment.textarea.value = app.environment.cmdHistory[app.environment.cmdHistoryIndex];
				} else {
					app.environment.textarea.value = app.environment.cmdCurrent;
				}
				app.environment.textarea.focus();
			}
		} else { // CTRL key is pressed
			if (event.key == "s") {
				event.preventDefault();
				app.environment.textarea.selectionStart = 0;
				app.environment.textarea.selectionEnd = 0;
			} else if (event.key == "e") {
				event.preventDefault();
				app.environment.textarea.selectionStart = app.environment.textarea.value.length;
				app.environment.textarea.selectionEnd = app.environment.textarea.value.length;
			}
		}
	});

	// Set current command value after keystroke is registered
	self.addEventListener("keyup", async(event)=>{
		if ( !(event.keyCode == 9 || event.keyCode == 13 || event.keyCode == 38 || event.keyCode == 40) ) {
			app.environment.cmdCurrent = app.environment.textarea.value;
		};
	});

	// Clear button
	document.querySelector("html body div.menu div.item[name=clear]").addEventListener("click", async()=>{
		app.functions.clear();
	});

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
		app.functions.shrinkInputField();

		setTimeout(app.functions.resetClearBreaks, 100);
	})

	// Warn before quit
	if (app.environment.warnOnClose) {
		self.onbeforeunload = async () => {
			return "Close?";
		}
	}
