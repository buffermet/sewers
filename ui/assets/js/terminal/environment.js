
/*
*	
*	Sewers UI terminal environment
*	
*/

	// App
	const app = {}

	// Modules
	app.commands = {}
	app.events = {}
	app.functions = {}
	app.http = {}
	app.environment = {
		form: document.querySelector("html body form"),
		textarea: document.querySelector("html body form textarea"),
		scrollBox: document.querySelector("html body div.scrollBox"),
		terminal: document.querySelector("html body div.scrollBox div.terminal"),
		jsField: document.querySelector("html body div.menu div.item[name=javascript] input"),
		sessionConfig: {},
		relayConfig: {},
		autoFetch: async()=>{},
		autoFetchSession: null,
		fetch_delay: 1000,
		auto_fetching: false,
		fetch_on_auto_fetch_start: true,
		load_line: document.querySelector("html body form div.loadline"),
		relay: location.href.replace(/.*\/terminal\//g, "").replace(/\/.*/g, ""),
		session_id: location.href.replace(/.*\//g, ""),
		request_tag: "<span class=\"orange bold\">sewers</span> \xBB ",
		response_tag: "<span class=\"cyan bold\">interpreter</span> \xBB ",
		request: null,
		onResponse: async()=>{},
		active_streams: new Array(),
		allowed_characters: " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz".split(""),
		cmd_history: new Array(),
		cmd_history_i: 0,
		cmd_current: "",
		linebreaks: null,
		warnBeforeClose: true,
		warnOnReset: false,
		scrollOnInput: true,
		scrollOnOutput: true,
		scrollOnScrolledOutput: false,
		scrollOnJsInput: false,
		mic_bitrate: "16000",
		mon_bitrate: "512000",
		mon_resolution: "1280x800",
		cam_bitrate: "512000",
		cam_resolution: "1280x800"
	}

	app.environment.clearBreaks = parseInt( app.environment.scrollBox.getBoundingClientRect().height / 12 )
