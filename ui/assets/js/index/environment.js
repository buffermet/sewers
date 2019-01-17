
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
		timezone: "",
		lastIP: "",
		currentRelay: "",
		relayUserAgent: "",
		relayConfig: {},
		sewersConfig: {},
		resizingConsole: false,
		scrollOnOutput: false,
		warnOnRequest: true,
		webConsole: document.querySelector("html body div.console"),
		consoleContainer: document.querySelector("html body div.console div.consolecontainer"),
		consoleClear: document.querySelector("html body div.console div.clear"),
		consoleResizeBar: document.querySelector("html body div.console div.resizebar"),
		popupBackground: document.querySelector("html body div.popup"),
		upstreamIndicator: document.querySelector("html body div.menu div.item div.upstream-indicator"),
		backbutton: document.querySelector("html body div.menu div.item[name=backbutton]"),
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
	}
