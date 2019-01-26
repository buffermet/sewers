
/*
*	
*	Sewers UI terminal commands package
*	
*/

	app.commands.builtin = {
		"?": {
			arguments: [],
			autocomplete: async (args, cursor_position) => {},
			button: "",
			category: "terminal",
			default: "",
			description: "Show help menu.",
			text: "Show help",
			launch: async args => {
				app.functions.printHelp();
			},
			load: async () => {},
			os: [".*"],
		},
		"activestreams": {
			arguments: [],
			autocomplete: async (args, cursor_position) => {},
			button: "",
			category: "interpreter",
			default: "",
			description: "Show active stream sessions.",
			text: "Show active streams",
			launch: async args => {
				const active_streams = Object.keys(app.streams.active);
				if (active_streams.length > 0) {
					active_streams.forEach(async(active_stream_id)=>{
						await app.functions.print( await app.functions.escapeHTML(active_stream_id) + "<br>" );
					});
				} else {
					app.functions.print("There are no streams.<br>")
				}
			},
			load: async () => {},
		},
		"attach": {
			arguments: ["SESSION ID"],
			autocomplete: async (command, cursor_position) => {
				const tabbed_command = command.slice(0, cursor_position).replace(/.*\s/, "");
				const pre_cursor = command.slice(0, cursor_position);
				const choices = Object.keys(app.streams.active);
console.log(tabbed_command)
				app.functions.autoComplete(command, tabbed_command, pre_cursor, choices);
			},
			button: "",
			category: "interpreter",
			default: "",
			description: "Attach to a stream session.",
			text: "Attach stream",
			launch: async args => {
				const stream_session_id = args.replace(/^\s*/, "").replace(/\s.*/, "");
				app.functions.attachStream(stream_session_id);
			},
			load: async () => {},
		},
		"clear": {
			arguments: [],
			autocomplete: async (args, cursor_position) => {},
			button: "",
			category: "terminal",
			default: "",
			description: "Clear the terminal.",
			text: "Clear",
			launch: async args => {
				app.functions.clear();
			},
			load: async () => {},
		},
		"exit": {
			arguments: [],
			autocomplete: async (args, cursor_position) => {},
			button: "",
			category: "terminal",
			default: "",
			description: "Exit the terminal.",
			text: "Exit",
			launch: async args => {
				self.close() || alert("You can only use this in pop-up windows.");
			},
			load: async () => {},
		},
		"fetch": {
			arguments: [],
			autocomplete: async (args, cursor_position) => {},
			button: "",
			category: "interpreter",
			default: "",
			description: "Fetch new packets from interpreter.",
			text: "Fetch",
			launch: async args => {
				app.functions.fetchPackets();
			},
			load: async () => {},
		},
		"fetchrate": {
			arguments: ["MIN SECONDS", "MAX SECONDS"],
			autocomplete: async (args, cursor_position) => {},
			button: "",
			category: "interpreter",
			default: "",
			description: "Set automatic fetch rate of interpreter.",
			text: "Change fetchrate",
			launch: async args => {
				const arguments = args.replace(/^\s*/, "").replace(/\s*$/, "").replace(/\s{2,}/g, " ").split(" ");
				if (arguments[2]) {
					app.functions.print(
						"Too many arguments.<br>" + 
						"Usage: <span class=\"tan\">fetchrate</span> <span class=\"grey\">&lt;MIN SECONDS&gt; &lt;MAX SECONDS&gt;</span><br>" 
					);
				} else if (!arguments[1]) {
					app.functions.print(
						"Not enough arguments.<br>" + 
						"Usage: <span class=\"tan\">fetchrate</span> <span class=\"grey\">&lt;MIN SECONDS&gt; &lt;MAX SECONDS&gt;</span><br>" 
					);
				} else if ( parseInt(arguments[0]) >= parseInt(arguments[1]) ) {
					app.functions.print(
						"Minimum value must be less than maximum.<br>" + 
						"Usage: <span class=\"tan\">fetchrate</span> <span class=\"grey\">&lt;MIN SECONDS&gt; &lt;MAX SECONDS&gt;</span><br>" 
					);
				} else if ( parseInt(arguments[0]) < 1 ) {
					app.functions.print(
						"Minimum value must be at least 1.<br>" + 
						"Usage: <span class=\"tan\">fetchrate</span> <span class=\"grey\">&lt;MIN SECONDS&gt; &lt;MAX SECONDS&gt;</span><br>" 
					);
				} else {
					const min = parseInt(arguments[0]);
					const max = parseInt(arguments[1]);
					app.functions.changeFetchRate(min, max);
				}
			},
			load: async () => {},
			os: [".*"],
		},
		"h": {
			arguments: [],
			autocomplete: async (args, cursor_position) => {},
			button: "",
			category: "terminal",
			default: "",
			description: "Show help menu.",
			text: "Show help",
			launch: async args => {
				app.functions.printHelp();
			},
			load: async () => {},
			os: [".*"],
		},
		"help": {
			arguments: [],
			autocomplete: async (args, cursor_position) => {},
			button: "",
			category: "terminal",
			default: "",
			description: "Show help menu.",
			text: "Show help",
			launch: async args => {
				app.functions.printHelp();
			},
			load: async () => {},
			os: [".*"],
		},
		"info": {
			arguments: [],
			autocomplete: async (args, cursor_position) => {},
			button: "",
			category: "terminal",
			default: "",
			description: "Show help menu.",
			text: "Show help",
			launch: async args => {
				app.functions.printHelp();
			},
			load: async () => {},
			os: [".*"],
		},
		"reset": {
			arguments: [],
			autocomplete: async (args, cursor_position) => {},
			category: "terminal",
			default: "",
			description: "",
			text: "",
			launch: async args => {
				if (app.environment.warnOnReset) {
					self.location = location.href;
				} else {
					document.body.innerHTML = "";
					window.onbeforeunload = null;
					self.location = location.href;
				}
			},
			load: async () => {},
		},
		"sh": {
			arguments: ["COMMAND"],
			autocomplete: async (args, cursor_position) => {},
			button: "",
			category: "terminal",
			default: "",
			description: "Execute shell command/start shell stream.",
			text: "Shell",
			launch: async args => {
				if (args == "") {
					app.functions.startStream("shell").catch(async(err)=>{
						app.functions.print("ERROR: " + err + "<br>");
					});
				} else {
					app.functions.toShell( encodeURIComponent(args) );
				}
			},
			load: async () => {},
			os: [".*"],
		},
		"shell": {
			arguments: ["COMMAND"],
			autocomplete: async (args, cursor_position) => {},
			button: "",
			category: "terminal",
			default: "",
			description: "Execute shell command/start shell stream.",
			text: "Shell",
			launch: async args => {
				if (args == "") {
					app.functions.startStream("shell").catch(async(err)=>{
						app.functions.print("ERROR: " + err + "<br>");
					});
				} else {
					app.functions.toShell( encodeURIComponent(args) );
				}
			},
			load: async () => {},
			os: [".*"],
		},
		"startautofetching": {
			arguments: ["COMMAND"],
			autocomplete: async (args, cursor_position) => {},
			button: "",
			category: "terminal",
			default: "",
			description: "Start auto fetching.",
			text: "Start auto fetching",
			launch: async args => {
				const arguments = args.replace(/^\s*/, "").replace(/\s*$/, "").replace(/\s{2,}/g, " ").split(" ");
				if (arguments[2]) {
					app.functions.print(
						"Too many arguments.<br>" + 
						"Usage: <span class=\"tan\">startautofetching</span> <span class=\"grey\">&lt;MIN SECONDS&gt; &lt;MAX SECONDS&gt;</span><br>"
					);
				} else if (!arguments[1]) {
					app.functions.print(
						"Not enough arguments.<br>" + 
						"Usage: <span class=\"tan\">startautofetching</span> <span class=\"grey\">&lt;MIN SECONDS&gt; &lt;MAX SECONDS&gt;</span><br>"
					);
				} else if ( parseInt(arguments[0]) >= parseInt(arguments[1]) ) {
					app.functions.print(
						"Minimum value must be less than maximum.<br>" + 
						"Usage: <span class=\"tan\">startautofetching</span> <span class=\"grey\">&lt;MIN SECONDS&gt; &lt;MAX SECONDS&gt;</span><br>"
					);
				} else if ( parseInt(arguments[0]) < 1 ) {
					app.functions.print(
						"Minimum value must be at least 1.<br>" + 
						"Usage: <span class=\"tan\">startautofetching</span> <span class=\"grey\">&lt;MIN SECONDS&gt; &lt;MAX SECONDS&gt;</span><br>"
					);
				} else {
					const min = parseInt(arguments[0]);
					const max = parseInt(arguments[1]);
					app.functions.startAutoFetching(min, max);
				}
			},
			load: async () => {},
			os: [".*"],
		},
		"stopautofetching": {
			arguments: ["COMMAND"],
			autocomplete: async (args, cursor_position) => {},
			button: "",
			category: "terminal",
			default: "",
			description: "Stop auto fetching.",
			text: "Stop auto fetching",
			launch: async args => {
				app.functions.stopAutoFetching();
			},
			load: async () => {},
			os: [".*"],
		},
		"telemetry": {
			arguments: [],
			autocomplete: async (args, cursor_position) => {},
			button: "",
			category: "terminal",
			default: "",
			description: "Show telemetry data of current session.",
			text: "Telemetry",
			launch: async args => {
				app.functions.printTelemetry()
			},
			load: async () => {},
			os: [".*"],
		},
		"usage": {
			arguments: [],
			autocomplete: async (args, cursor_position) => {},
			button: "",
			category: "terminal",
			default: "",
			description: "Show help menu.",
			text: "Show help",
			launch: async args => {
				app.functions.printHelp();
			},
			load: async () => {},
			os: [".*"],
		},
		"xss": {
			arguments: ["JAVASCRIPT"],
			autocomplete: async (args, cursor_position) => {},
			category: "terminal",
			default: "",
			description: "Execute JavaScript in the terminal.",
			text: "Execute JavaScript",
			launch: async args => {
				app.functions.parseXSSCommand(args);
			},
			load: async () => {},
		},
	}

	app.commands.pluggedin = {
		"snapmon": {
			arguments: [],
			autocomplete: async (args, cursor_position) => {},
			button: "html body div.menu div.subitem[name=yungtravla-terminal-linux-gnome-screenshot]",
			category: "interpreter",
			default: "",
			description: "Take a screenshot.",
			text: "Capture screenshot",
			launch: async args => {
				const os_string = app.environment.sessionConfig.os;
				const filename = await app.functions.randomString(8, 16);
				const command = "gnome-screenshot -p -f ./" + filename + ".png &> /dev/null && cat ./" + filename + ".png && rm ./" + filename + ".png";
				app.functions.print(app.environment.requestTag + "sh " + command + "<br>");
				app.functions.toShell( encodeURIComponent(command) );
			},
			load: async () => {},
			os: ["Linux"],
		},
	};

	app.commands.microphone = {};

	app.commands.monitor = {
		"stream.bitrate": {
			arguments: [],
			autocomplete: async (args, cursor_position) => {},
			button: "",
			category: "terminal",
			default: "",
			description: "Set bitrate of current monitor stream.",
			text: "Set strean bitrate",
			launch: async args => {},
			load: async () => {},
		},
		"clear": {
			arguments: [],
			autocomplete: async (args, cursor_position) => {},
			button: "",
			category: "terminal",
			default: "",
			description: "Clear the current monitor stream.",
			text: "Clear monitor stream",
			launch: async args => {
				app.functions.clear();
			},
			load: async () => {},
		},
		"stream.exit": {
			arguments: [],
			autocomplete: async (args, cursor_position) => {},
			button: "",
			category: "monitor",
			default: "",
			description: "Exit the current monitor stream.",
			text: "Exit monitor stream",
			launch: async args => {
				if ( Object.keys(app.streams.current).length == 0 ) {
					app.functions.stopStream(app.streams.current);
				}
			},
			load: async () => {},
		},
		"stream.resolution": {
			arguments: [],
			autocomplete: async (args, cursor_position) => {},
			button: "",
			category: "terminal",
			default: "",
			description: "Set resolution of current monitor stream.",
			text: "Set stream resolution",
			launch: async args => {},
			load: async () => {},
		},
		"stream.rate": {
			arguments: ["MIN SECONDS", "MAX SECONDS"],
			autocomplete: async (args, cursor_position) => {},
			button: "",
			category: "monitor",
			default: "",
			description: "Set rate of current monitor stream.",
			text: "Change stream rate",
			launch: async args => {
				const arguments = args.replace(/^\s*/, "").replace(/\s*$/, "").replace(/\s{2,}/g, "").split(" ");
				if (arguments[2]) {
					app.functions.print(
						"Too many arguments.<br>" + 
						"Usage: <span class=\"tan\">fetchrate</span> <span class=\"grey\">&lt;MIN SECONDS&gt; &lt;MAX SECONDS&gt;</span><br>" 
					);
				} else if (!arguments[1]) {
					app.functions.print(
						"Not enough arguments.<br>" + 
						"Usage: <span class=\"tan\">fetchrate</span> <span class=\"grey\">&lt;MIN SECONDS&gt; &lt;MAX SECONDS&gt;</span><br>" 
					);
				} else if ( parseInt(arguments[0]) >= parseInt(arguments[1]) ) {
					app.functions.print(
						"Minimum value must be less than maximum.<br>" + 
						"Usage: <span class=\"tan\">fetchrate</span> <span class=\"grey\">&lt;MIN SECONDS&gt; &lt;MAX SECONDS&gt;</span><br>" 
					);
				} else if ( parseInt(arguments[0]) < 1 ) {
					app.functions.print(
						"Minimum value must be at least 1.<br>" + 
						"Usage: <span class=\"tan\">fetchrate</span> <span class=\"grey\">&lt;MIN SECONDS&gt; &lt;MAX SECONDS&gt;</span><br>" 
					);
				} else {
					app.streams.active[app.streams.current].rate = arguments;
					app.functions.toStream(app.streams.current, app.environment.sessionConfig.stream_tag).then(async()=>{
						app.functions.print(app.environment.requestTag + "changed stream rate to sync buffer every " + arguments[0] + " to " + arguments[1] + " seconds.<br>");
					}).catch(async(err)=>{
						app.functions.print("ERROR: could not change stream rate of " + await app.functions.escapeHTML(app.streams.current) + ": " + await app.functions.escapeHTML(err) );
					});
				}
			},
			load: async () => {},
		},
	};

	app.commands.shell = {
		"clear": {
			arguments: [],
			autocomplete: async (args, cursor_position) => {},
			button: "",
			category: "terminal",
			default: "",
			description: "Clear the current shell stream.",
			text: "Clear",
			launch: async args => {
				app.functions.clear();
			},
			load: async () => {},
		},
		"stream.detach": {
			arguments: [],
			autocomplete: async (args, cursor_position) => {},
			button: "",
			category: "terminal",
			default: "",
			description: "Detach from current shell stream.",
			text: "Clear",
			launch: async args => {
				app.functions.detachStream(app.streams.current);
			},
			load: async () => {},
		},
		"stream.exit": {
			arguments: [],
			autocomplete: async (args, cursor_position) => {},
			button: "",
			category: "shell",
			default: "",
			description: "Exit the current shell stream.",
			text: "Exit shell stream",
			launch: async args => {
				app.functions.stopStream(app.streams.current);
			},
			load: async () => {},
		},
		"stream.rate": {
			arguments: ["MIN SECONDS", "MAX SECONDS"],
			autocomplete: async (args, cursor_position) => {},
			button: "",
			category: "shell",
			default: "",
			description: "Set rate of current shell stream.",
			text: "Change stream rate",
			launch: async args => {
				const arguments = args.replace(/^\s*/, "").replace(/\s*$/, "").replace(/\s{2,}/g, "").split(" ");
				if (arguments[2]) {
					app.functions.print(
						"Too many arguments.<br>" + 
						"Usage: <span class=\"tan\">fetchrate</span> <span class=\"grey\">&lt;MIN SECONDS&gt; &lt;MAX SECONDS&gt;</span><br>" 
					);
				} else if (!arguments[1]) {
					app.functions.print(
						"Not enough arguments.<br>" + 
						"Usage: <span class=\"tan\">fetchrate</span> <span class=\"grey\">&lt;MIN SECONDS&gt; &lt;MAX SECONDS&gt;</span><br>" 
					);
				} else if ( parseInt(arguments[0]) >= parseInt(arguments[1]) ) {
					app.functions.print(
						"Minimum value must be less than maximum.<br>" + 
						"Usage: <span class=\"tan\">fetchrate</span> <span class=\"grey\">&lt;MIN SECONDS&gt; &lt;MAX SECONDS&gt;</span><br>" 
					);
				} else if ( parseInt(arguments[0]) < 1 ) {
					app.functions.print(
						"Minimum value must be at least 1.<br>" + 
						"Usage: <span class=\"tan\">fetchrate</span> <span class=\"grey\">&lt;MIN SECONDS&gt; &lt;MAX SECONDS&gt;</span><br>" 
					);
				} else {
					app.streams.active[app.streams.current].rate = arguments;
					app.functions.toStream(app.streams.current, app.environment.sessionConfig.stream_tag);
					app.functions.print(app.environment.requestTag + "changed stream rate to sync buffer every " + arguments[0] + " to " + arguments[1] + " seconds.<br>");
				}
			},
			load: async () => {},
		},
	};

	app.commands.webcam = {};


// to do:

// } else if ( cmd.match(/^\s*checkstreams\s*$/) ) {
	// checkStreams()
// } else if ( cmd.match(/^\s*streammon /) ) {
	// const args = cmd.split(" ")
	// streamMon( args[1], args[2] )
// } else if ( cmd.match(/^\s*streammic /) ) {
	// streamMic( cmd.split(" ")[1] )
