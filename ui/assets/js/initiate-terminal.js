
/* Initiate terminal.html */

	self.addEventListener("load", async()=>{
		await resetClearBreaks()
		await getSessionConfig(relay, session_id)
		await getRelayConfig(relay)
		await parseUserAgent()
		await printSessionInfo()

		document.title = session_config['session_id'] + ' - ' + session_config['hostname']

		textarea.focus()
	})
