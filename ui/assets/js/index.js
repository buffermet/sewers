
/*
*
*	Sewers UI index package
*
*/

	self.addEventListener("load", async()=>{
		await app.functions.whoAmI();
		await app.functions.getSewersConfig();
		await app.functions.updateCSS();
		await app.functions.showRelays();

		app.functions.fetchLog();
		setInterval(app.functions.fetchLog, 400); // make websocket

		setInterval(app.functions.cycleNews, 4000);
		setTimeout(async()=>{ app.environment.container.classList.remove("hide") }, 720);
	})
