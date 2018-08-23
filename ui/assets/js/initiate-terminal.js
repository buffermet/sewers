
/* Initiate terminal.html */

	self.addEventListener("load", async()=>{

		// Set clear breaks
		await resetClearBreaks()

		// Get configs
		await getSessionConfig(relay, session_id)
		await getRelayConfig(relay)

		await printSessionInfo()

		textarea.focus()

		// Set title
		document.title = session_config['session_id'] + ' - ' + session_config['hostname']

	})
