
/*
*	
*	Sewers UI terminal commands package
*	
*/

	app.commands.builtin = {
		"?": {
			"arguments": [],
			"button": "",
			"category": "terminal",
			"description": "Show help menu.",
			"text": "Show help",
			launch: async args => {
				app.functions.printHelp();
			},
			load: async () => {},
			"os": [".*"],
		},
		"clear": {
			"arguments": [],
			"button": "",
			"category": "terminal",
			"description": "Clear the terminal.",
			"text": "Clear",
			launch: async args => {
				app.functions.clear();
			},
			load: async () => {},
		},
		"commands": {
			"arguments": [],
			"button": "",
			"category": "terminal",
			"description": "Show help menu.",
			"text": "Show help",
			launch: async args => {
				app.functions.printHelp();
			},
			load: async () => {},
			"os": [".*"],
		},
		"exit": {
			"arguments": [],
			"button": "",
			"category": "terminal",
			"description": "Exit the terminal.",
			"text": "Exit",
			launch: async args => {
				self.close() || alert("You can only use this in pop-up windows.");
			},
			load: async () => {},
		},
		"fetch": {
			"arguments": [],
			"button": "",
			"category": "interpreter",
			"description": "Fetch new packets from interpreter.",
			"text": "Fetch",
			launch: async args => {
				app.functions.fetchPackets();
			},
			load: async () => {},
		},
		"fetchrate": {
			"arguments": ["MIN SECONDS", "MAX SECONDS"],
			"button": "",
			"category": "interpreter",
			"description": "Set automatic fetch rate of interpreter.",
			"text": "Change fetchrate",
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
			"os": [".*"],
		},
		"h": {
			"arguments": [],
			"button": "",
			"category": "terminal",
			"description": "Show help menu.",
			"text": "Show help",
			launch: async args => {
				app.functions.printHelp();
			},
			load: async () => {},
			"os": [".*"],
		},
		"help": {
			"arguments": [],
			"button": "",
			"category": "terminal",
			"description": "Show help menu.",
			"text": "Show help",
			launch: async args => {
				app.functions.printHelp();
			},
			load: async () => {},
			"os": [".*"],
		},
		"info": {
			"arguments": [],
			"button": "",
			"category": "terminal",
			"description": "Show help menu.",
			"text": "Show help",
			launch: async args => {
				app.functions.printHelp();
			},
			load: async () => {},
			"os": [".*"],
		},
		"reset": {
			"arguments": [],
			"category": "terminal",
			"description": "",
			"text": "",
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
			"arguments": ["COMMAND"],
			"button": "",
			"category": "terminal",
			"description": "Execute shell command/start shell stream.",
			"text": "Shell",
			launch: async args => {
				if (args == "") {
					let new_stream_session = 0;
					app.environment.activeStreams.forEach(async(active_stream_session)=>{
						active_stream_session == new String(new_stream_session) ? new_stream_session++ : "";
					});
					new_stream_session = new String(new_stream_session);
					app.functions.startStreamingShell(new_stream_session).catch(async(err)=>{
						app.functions.print("ERROR: " + err + "<br>");
					});
				} else {
					app.functions.toShell( encodeURIComponent(args) );
				}
			},
			load: async () => {},
			"os": [".*"],
		},
		"shell": {
			"arguments": ["COMMAND"],
			"button": "",
			"category": "terminal",
			"description": "Execute shell command/start shell stream.",
			"text": "Shell",
			launch: async args => {
				if (args == "") {
					let new_stream_session = 0;
					app.environment.activeStreams.forEach(async(active_stream_session)=>{
						active_stream_session == new String(new_stream_session) ? new_stream_session++ : "";
					});
					new_stream_session = new String(new_stream_session);
					app.functions.startStreamingShell(new_stream_session).catch(async(err)=>{
						app.functions.print("ERROR: " + err + "<br>");
					});
				} else {
					app.functions.toShell( encodeURIComponent(args) );
				}
			},
			load: async () => {},
			"os": [".*"],
		},
		"startautofetching": {
			"arguments": ["COMMAND"],
			"button": "",
			"category": "terminal",
			"description": "Start auto fetching.",
			"text": "Start auto fetching",
			launch: async args => {
				const arguments = args.replace(/^\s*/, "").replace(/\s*$/, "").replace(/\s{2,}/g, " ").split(" ");
				if (arguments[2]) {
					app.functions.print(
						new String( 
							"Too many arguments.<br>" + 
							"Usage: <span class=\"tan\">startautofetching</span> <span class=\"grey\">&lt;MIN SECONDS&gt; &lt;MAX SECONDS&gt;</span><br>" 
						)
					);
				} else if (!arguments[1]) {
					app.functions.print(
						new String( 
							"Not enough arguments.<br>" + 
							"Usage: <span class=\"tan\">startautofetching</span> <span class=\"grey\">&lt;MIN SECONDS&gt; &lt;MAX SECONDS&gt;</span><br>" 
						)
					);
				} else if ( parseInt(arguments[0]) >= parseInt(arguments[1]) ) {
					app.functions.print(
						new String( 
							"Minimum value must be less than maximum.<br>" + 
							"Usage: <span class=\"tan\">startautofetching</span> <span class=\"grey\">&lt;MIN SECONDS&gt; &lt;MAX SECONDS&gt;</span><br>" 
						)
					);
				} else if ( parseInt(arguments[0]) < 1 ) {
					app.functions.print(
						new String( 
							"Minimum value must be at least 1.<br>" + 
							"Usage: <span class=\"tan\">startautofetching</span> <span class=\"grey\">&lt;MIN SECONDS&gt; &lt;MAX SECONDS&gt;</span><br>" 
						)
					);
				} else {
					const min = parseInt(arguments[0]);
					const max = parseInt(arguments[1]);
					app.functions.startAutoFetching(min, max);
				}
			},
			load: async () => {},
			"os": [".*"],
		},
		"stopautofetching": {
			"arguments": ["COMMAND"],
			"button": "",
			"category": "terminal",
			"description": "Stop auto fetching.",
			"text": "Stop auto fetching",
			launch: async args => {
				app.functions.stopAutoFetching();
			},
			load: async () => {},
			"os": [".*"],
		},
		"telemetry": {
			"arguments": [],
			"button": "",
			"category": "terminal",
			"description": "Show telemetry data of current session.",
			"text": "Telemetry",
			launch: async args => {
				app.functions.printTelemetry()
			},
			load: async () => {},
			"os": [".*"],
		},
		"usage": {
			"arguments": [],
			"button": "",
			"category": "terminal",
			"description": "Show help menu.",
			"text": "Show help",
			launch: async args => {
				app.functions.printHelp();
			},
			load: async () => {},
			"os": [".*"],
		},
		"xss": {
			"arguments": ["JAVASCRIPT"],
			"category": "terminal",
			"description": "Execute JavaScript in the terminal.",
			"text": "Execute JavaScript",
			launch: async args => {
				app.functions.parseXSSCommand(args);
			},
			load: async () => {},
		},
	}

	app.commands.pluggedin = {
		"snapmon": {
			"arguments": [],
			"button": "html body div.menu div.subitem[name=yungtravla-terminal-linux-gnome-screenshot]",
			"category": "interpreter",
			"description": "Take a screenshot.",
			"text": "Capture screenshot",
			launch: async args => {
				const os_string = app.environment.sessionConfig.os;
				if ( os_string.match("GNU/Linux") ) {
					const filename = await app.functions.randomString(8, 16);
					const command = "sh gnome-screenshot -p -f ./" + filename + ".png &> /dev/null && cat ./" + filename + ".png && rm ./" + filename + ".png";
					app.functions.parseCommand(command);
				}
			},
			load: async () => {},
			"os": ["GNU[/]Linux$"],
		},
		// "your-command": {
		// 	"arguments": [],
		// 	"button": "html body div.menu div.subitem[name=name-of-your-command-button]",
		// 	"category": "",
		// 	"description": "Describe your command.",
		// 	"text": "Text of your command button",
		// 	launch: async args => {
		// 		// your code
		// 	},
		// 	"os": ["RegularExpression|[wW]indows|[mM][aA][cC][oO][sS]|[aA]ndroid|..."],
		// },
	}

	app.commands.shell = {
		"stream.clear": {
			"arguments": [],
			"button": "",
			"category": "terminal",
			"description": "Clear the terminal.",
			"text": "Clear",
			launch: async args => {
				app.functions.clear();
			},
			load: async () => {},
		},
		"stream.detach": {
			"arguments": [],
			"button": "",
			"category": "terminal",
			"description": "Clear the terminal.",
			"text": "Clear",
			launch: async args => {
				app.functions.detachStream(app.environment.currentStream);
			},
			load: async () => {},
		},
		"stream.exit": {
			"arguments": [],
			"button": "",
			"category": "shell",
			"description": "Exit the shell.",
			"text": "Exit shell",
			launch: async args => {
				app.functions.stopStreamingShell(app.environment.currentStream);
			},
			load: async () => {},
		},
		"stream.syncrate": {
			"arguments": ["MIN SECONDS", "MAX SECONDS"],
			"button": "",
			"category": "shell",
			"description": "Set sync rate of current shell stream.",
			"text": "Change sync rate",
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
					const min = parseInt(arguments[0]);
					const max = parseInt(arguments[1]);
					app.functions.print(app.environment.requestTag + "changed syncrate to fill buffer every " + min + " to " + max + " seconds."); // debug
				}
			},
			load: async () => {},
		},
	}



// to do:

// } else if ( cmd.match(/^\s*checkstreams\s*$/) ) {
	// checkStreams()
// } else if ( cmd.match(/^\s*streammon /) ) {
	// const args = cmd.split(" ")
	// streamMon( args[1], args[2] )
// } else if ( cmd.match(/^\s*streammic /) ) {
	// streamMic( cmd.split(" ")[1] )
