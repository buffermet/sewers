
/* Initiate terminal.html */

	self.addEventListener("load", async()=>{
		app.functions.shrinkInputField().then(async()=>{
			app.functions.resetClearBreaks();
		});

		await app.functions.getSessionConfig(app.environment.relay, app.environment.sessionID);
		await app.functions.getRelayConfig(app.environment.relay);
		await app.functions.parseUserAgent();

		app.functions.printInstructions();

		Object.keys(app.commands.builtin).forEach(async()=>{
			
		});

		document.title = app.environment.sessionConfig.session_id + ' - ' + app.environment.sessionConfig.hostname;

		app.environment.textarea.focus();
	});
