
/*
*	
*	Sewers UI terminal environment package
*	
*/

	// App
	const app = {};

	// Modules
	app.environment = {
		form: document.querySelector("html body form"),
		textarea: document.querySelector("html body form textarea"),
		scrollBox: document.querySelector("html body div.scrollBox"),
		terminal: document.querySelector("html body div.scrollBox div.terminal"),
		xssButton: document.querySelector("html body div.menu div.item[name=xssbutton]"),
		xssField: document.querySelector("html body div.menu div.item[name=xssbutton] input"),
		upstreamIndicator: document.querySelector("html body div.menu div.item div.upstream-indicator"),
		ctrlKey: false,
		sessionConfig: {},
		relayConfig: {},
		autoFetch: async () => {},
		autoFetchTimeout: null,
		fetchDelay: 1000,
		autoFetching: false,
		loadLine: document.querySelector("html body form div.loadline"),
		relay: location.href.replace(/.*\/terminal\//g, "").replace(/\/.*/g, ""),
		requestTag: "<span class=\"orange bold\">sewers</span>&nbsp;\xBB&nbsp;",
		responseTag: "<span class=\"cyan bold\">interpreter</span>&nbsp;\xBB&nbsp;",
		request: null,
		onResponse: async () => {},
		streamingMicrophone: false,
		streamingMonitor: false,
		streamingShell: false,
		streamingWebcam: false,
		allowedCharacters: " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz".split(""),
		cmdHistory: new Array(),
		cmdHistoryIndex: 0,
		cmdCurrent: "",
		clearBreaks: parseInt( document.querySelector("html body div.scrollBox").getBoundingClientRect().height / 12 ),
		micBitrate: "16000",
		monBitrate: "512000",
		monResolution: "1280x800",
		camBitrate: "512000",
		camResolution: "1280x800",
		fetchOnAutoFetchStart: true,
		warnOnReset: false,
		scrollOnInput: true,
		scrollOnOutput: false,
		scrollOnJsInput: false,
		playSoundOnStdout: false,
		warnOnRequest: true,
		warnOnClose: true,
	};
	app.http = {};
	app.functions = {};
	app.functions.prototypes = {};
	app.events = {};
	app.commands = {};
	app.commands.prototypes = {};
	app.streams = {};
	app.streams.active = {};
	app.streams.current = "";
