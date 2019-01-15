
/*
*	
*	Sewers UI index environment package
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
		whoami: "",
		relayConfig: {},
		sewersConfig: {},
		webConsole: document.querySelector("html body div.console"),
		consoleContainer: document.querySelector("html body div.console div.consolecontainer"),
		consoleClear: document.querySelector("html body div.console div.clear"),
		consoleResizeBar: document.querySelector("html body div.console div.resizebar"),
		scrollOnOutput: true,
		events: [],
		terminals: [],
		backbutton: document.querySelector("div.icon.back").parentElement,
		scrollContainer: document.querySelector("html body div.scrollcontainer"),
		container: document.querySelector("html body div.scrollcontainer div.container"),
		relayList: document.querySelector("html body div.scrollcontainer div.container div.relaylist"),
		relays: document.querySelectorAll("html body div.scrollcontainer div.container div.relaylist div.relay"),
		sessions: document.querySelectorAll("html body div.scrollcontainer div.container div.sessionlist div.session"),
		newsMessage: document.querySelector("html body div.scrollcontainer div.container div div.header span.newsmessage"),
		newsMessageRelays: document.querySelectorAll("html body div.scrollcontainer div.container div.relaylist div.header span.newsmessage"),
		newsMessageSessions: document.querySelector("html body div.scrollcontainer div.container div.sessionlist div.header span.newsmessage"),
		newsRelays: {},
		newsSessions: {},
		currentRelaysNews: 0,
		currentSessionsNews: 0,
		currentRelay: "",
		relayUserAgent: "",
		messageBox: document.querySelector("html body div.fade div.messagebox"),
		messageTitle: document.querySelector("html body div.fade div.messagebox span.title"),
		messageBody: document.querySelector("html body div.fade div.messagebox div.message"),
		fade: document.querySelector("html body div.fade"),
		modals: document.querySelectorAll("html body div.fade div.modal"),
		openModal: document.querySelector("html body div.fade div.modal.open"),
		openOption: document.querySelector("html body div.fade div.modal.open div.optionbox ul"),
		menuCancel: document.querySelector("html body div.fade div.modal div.optionbox div.bottom div.cancel"),
		lastIP: "",
		resizingConsole: false
	}
