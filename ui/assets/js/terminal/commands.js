
/*
*	
*	Sewers UI terminal commands
*	
*/

	app.commands.builtin = {
		"clear": {
			"arguments": [],
			"button": "",
			"category": "terminal",
			"description": "",
			"text": "",
			launch: async () => {}
		},
		"exit": {
			"arguments": [],
			"button": "",
			"category": "terminal",
			"description": "",
			"text": "",
			launch: async () => {}
		},
		"fetch": {
			"arguments": [],
			"button": "",
			"category": "interpreter",
			"description": "Fetch new packets from interpreter.",
			"text": "Fetch",
			launch: async () => {
				app.functions.fetchPackets();
			}
		},
		"fetchrate": {
			"arguments": ["MIN SECONDS", "MAX SECONDS"],
			"button": "",
			"category": "interpreter",
			"description": "Set automatic fetch rate of interpreter.",
			"text": "Change fetchrate",
			launch: async (args) => {
				const arguments = args.split(" ");
				if (arguments[2]) {
					app.functions.print( "Too many arguments.<br>Usage: <span class=\"tan\">fetchrate</span> <span class=\"grey\">" + await app.functions.escapeHTML("<MIN SECONDS> <MAX SECONDS>") + "</span><br>" );
				} else if (!arguments[1]) {
					app.functions.print( "Not enough arguments.<br>Usage: <span class=\"tan\">fetchrate</span> <span class=\"grey\">" + await app.functions.escapeHTML("<MIN SECONDS> <MAX SECONDS>") + "</span><br>" );
				} else if ( parseInt(arguments[0]) >= parseInt(arguments[1]) ) {
					app.functions.print( "Minimum value must be less than maximum.<br>Usage: <span class=\"tan\">fetchrate</span> <span class=\"grey\">" + await app.functions.escapeHTML("<MIN SECONDS> <MAX SECONDS>") + "</span><br>" );
				} else if ( parseInt(arguments[0]) < 1 ) {
					app.functions.print( "Minimum value must be at least 1.<br>Usage: <span class=\"tan\">fetchrate</span> <span class=\"grey\">" + await app.functions.escapeHTML("<MIN SECONDS> <MAX SECONDS>") + "</span><br>" );
				} else {
					const min = parseInt(arguments[0]);
					const max = parseInt(arguments[1]);
					app.functions.changeFetchRate(min, max);
				}
			},
			"os": [".*"]
		},
		"?": {
			"arguments": [],
			"button": "",
			"category": "terminal",
			"description": "Show help menu.",
			"text": "Show help",
			launch: async (args) => {
				app.functions.printHelp()
			},
			"os": [".*"]
		},
		"h": {
			"arguments": [],
			"button": "",
			"category": "terminal",
			"description": "Show help menu.",
			"text": "Show help",
			launch: async (args) => {
				app.functions.printHelp()
			},
			"os": [".*"]
		},
		"help": {
			"arguments": [],
			"button": "",
			"category": "terminal",
			"description": "Show help menu.",
			"text": "Show help",
			launch: async (args) => {
				app.functions.printHelp()
			},
			"os": [".*"]
		},
		"commands": {
			"arguments": [],
			"button": "",
			"category": "terminal",
			"description": "Show help menu.",
			"text": "Show help",
			launch: async (args) => {
				app.functions.printHelp()
			},
			"os": [".*"]
		},
		"usage": {
			"arguments": [],
			"button": "",
			"category": "terminal",
			"description": "Show help menu.",
			"text": "Show help",
			launch: async (args) => {
				app.functions.printHelp()
			},
			"os": [".*"]
		},
		"sh": {
			"arguments": ["COMMAND"],
			"button": "",
			"category": "terminal",
			"description": "Execute shell command/start shell stream.",
			"text": "Shell",
			launch: async (args) => {
				app.functions.stdIn( encodeURIComponent(args) )
			},
			"os": [".*"]
		},
		"shell": {
			"arguments": ["COMMAND"],
			"button": "",
			"category": "terminal",
			"description": "Execute shell command/start shell stream.",
			"text": "Shell",
			launch: async (args) => {
				app.functions.stdIn( encodeURIComponent(args) )
			},
			"os": [".*"]
		},
		"startautofetching": {
			"arguments": ["COMMAND"],
			"button": "",
			"category": "terminal",
			"description": "Start auto fetching.",
			"text": "Start auto fetching",
			launch: async (args) => {
				if (args.split(" ")[2]) {
					app.functions.print( "Too many arguments.<br>Usage: <span class=\"tan\">startautofetching</span> <span class=\"grey\">" + await app.functions.escapeHTML("<MIN SECONDS> <MAX SECONDS>") + "</span><br>" );
				} else if (!args.split(" ")[1]) {
					app.functions.print( "Not enough arguments.<br>Usage: <span class=\"tan\">startautofetching</span> <span class=\"grey\">" + await app.functions.escapeHTML("<MIN SECONDS> <MAX SECONDS>") + "</span><br>" );
				} else if ( parseInt(args.split(" ")[0]) >= parseInt(args.split(" ")[1]) ) {
					app.functions.print( "Minimum value must be less than maximum.<br>Usage: <span class=\"tan\">startautofetching</span> <span class=\"grey\">" + await app.functions.escapeHTML("<MIN SECONDS> <MAX SECONDS>") + "</span><br>" );
				} else if ( parseInt(args.split(" ")[0]) < 1 ) {
					app.functions.print( "Minimum value must be at least 1.<br>Usage: <span class=\"tan\">startautofetching</span> <span class=\"grey\">" + await app.functions.escapeHTML("<MIN SECONDS> <MAX SECONDS>") + "</span><br>" );
				} else {
					const min = parseInt( args.split(" ")[0] );
					const max = parseInt( args.split(" ")[1] );
					app.functions.startAutoFetching(min, max);
				}
			},
			"os": [".*"]
		},
		"stopautofetching": {
			"arguments": ["COMMAND"],
			"button": "",
			"category": "terminal",
			"description": "Stop auto fetching.",
			"text": "Stop auto fetching",
			launch: async (args) => {
				app.functions.stopAutoFetching();
			},
			"os": [".*"]
		},
		"telemetry": {
			"arguments": [],
			"button": "",
			"category": "terminal",
			"description": "Show telemetry data of current session.",
			"text": "Telemetry",
			launch: async (args) => {
				app.functions.printTelemetry()
			},
			"os": [".*"]
		},
		"reset": {
			"arguments": [],
			"category": "terminal",
			"description": "",
			"text": "",
			launch: async () => {
				if (app.environment.warnOnReset) {
					self.location = location.href;
				} else {
					document.body.innerHTML = "";
					window.onbeforeunload = null;
					self.location = location.href;
				}
			}
		},
		"xss": {
			"arguments": ["JAVASCRIPT"],
			"category": "terminal",
			"description": "Execute JavaScript in the terminal.",
			"text": "Execute JavaScript",
			launch: async (args) => {
				app.functions.parseXSSCommand(args);
			}
		}
	}

	app.commands.pluggedin = {
		"snapmon": {
			"arguments": [],
			"button": "html body div.menu div.subitem[name=yungtravla-terminal-linux-gnome-screenshot]",
			"category": "interpreter",
			"description": "Take a screenshot.",
			"text": "Capture screenshot",
			launch: async () => {
				const os_string = app.environment.sessionConfig.os;
				if ( os_string.match("GNU/Linux") ) {
					const filename = await app.functions.randomString(8, 16);
					const command = "sh gnome-screenshot -p -f ./" + filename + ".png &> /dev/null && cat ./" + filename + ".png && rm ./" + filename + ".png";
					app.functions.parseCommand(command);
				}
			},
			"os": ["GNU[/]Linux$"]
		},
		// "your-command": {
		// 	"arguments": [],
		// 	"button": "html body div.menu div.subitem[name=name-of-your-command-button]",
		// 	"category": "",
		// 	"description": "Describe your command.",
		// 	"text": "Text of your command button",
		// 	launch: async () => {
		// 		// your code
		// 	},
		// 	"os": ["RegularExpression|[wW]indows|[mM][aA][cC][oO][sS]|[aA]ndroid|..."]
		// },
	}
