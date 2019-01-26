
/*
*
*	Sewers UI terminal package
*
*/

	self.addEventListener("load", async()=>{
		app.functions.shrinkInputField().then(async()=>{
			app.functions.resetClearBreaks();
		});

		await app.functions.getSessionConfig( app.environment.relay, location.pathname.replace(/.*\//, "") );
		await app.functions.getRelayConfig(app.environment.relay);
		await app.functions.parseUserAgent();

		app.functions.printInstructions();

		Object.keys(app.commands.builtin).forEach(async(command)=>{
			app.commands.builtin[command].load();
		});
		Object.keys(app.commands.pluggedin).forEach(async(command)=>{
			app.commands.pluggedin[command].load();
		});

		document.title = app.environment.sessionConfig.session_id + ' - ' + app.environment.sessionConfig.hostname;

		app.environment.textarea.focus();
	});
