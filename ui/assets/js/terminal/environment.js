
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
		fetchDelay: 1000,
		autoFetching: false,
		fetchOnAutoFetchStart: true,
		loadLine: document.querySelector("html body form div.loadline"),
		relay: location.href.replace(/.*\/terminal\//g, "").replace(/\/.*/g, ""),
		sessionID: location.href.replace(/.*\//g, ""),
		requestTag: "<span class=\"orange bold\">sewers</span> \xBB ",
		responseTag: "<span class=\"cyan bold\">interpreter</span> \xBB ",
		request: null,
		onResponse: async()=>{},
		activeStreams: new Array(),
		streamingShell: false,
		allowedCharacters: " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz".split(""),
		cmdHistory: new Array(),
		cmdHistoryIndex: 0,
		cmdCurrent: "",
		linebreaks: null,
		warnBeforeClose: true,
		warnOnReset: false,
		scrollOnInput: true,
		scrollOnOutput: true,
		scrollOnScrolledOutput: false,
		scrollOnJsInput: false,
		micBitrate: "16000",
		monBitrate: "512000",
		monResolution: "1280x800",
		camBitrate: "512000",
		camResolution: "1280x800"
	}

	app.environment.clearBreaks = parseInt( app.environment.scrollBox.getBoundingClientRect().height / 12 )
