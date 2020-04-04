
/*
*	
*	Sewers UI index events package
*	
*/

	// Quit button
	/*
	document.querySelector("html body div.menu div[name=quit]").addEventListener("click", async()=>{
		// 
	});
	*/

	// Preferences button
	document.querySelector("html body div.menu div.item[name=settings]").addEventListener("click", async()=>{
		app.functions.showPreferences();
	});

	// Back button
	app.environment.backbutton.addEventListener("click", async(event)=>{
		app.environment.backbutton.setAttribute("data-state", "off");

		app.functions.showRelays();
	});

	// Console clear button
	app.environment.consoleClear.addEventListener("click", async()=>{
		app.http.Request("GET", "/clear_console_log", [[]], "").then(async(res)=>{
			if (res.status == 200) {
				app.environment.consoleContainer.innerHTML = "";
				app.functions.fetchLog();
			}
		});
	});

	// Start resizing console with cursor
	app.environment.consoleResizeBar.addEventListener("mousedown", async(event)=>{
		app.environment.resizingConsole = true;
	});

	// Start resizing console with touchscreen
	app.environment.consoleResizeBar.addEventListener("touchstart", async(event)=>{
		app.environment.resizingConsole = true;
	});

	// Resizing of console with cursor
	self.addEventListener("mousemove", async function startResizing(event){
		if (app.environment.resizingConsole) {
			app.functions.resizeConsole(event.clientY);
		}
	});

	// Resizing of console with touchscreen
	self.addEventListener("touchmove", async function resize(event){
		if (app.environment.resizingConsole) {
			app.functions.resizeConsole(event.touches[0].clientY);
		}
	});

	// Stop resizing console with cursor
	self.addEventListener("mouseup", async function stopResizing(event){
		if (app.environment.resizingConsole) {
			app.environment.resizingConsole = false;
			app.http.Request( "POST", "/config/sewers", [["Content-Type", "application/x-www-form-urlencoded"]], "console_height=" + app.environment.webConsole.getBoundingClientRect().height );
		}
	});

	// Stop resizing console with touchscreen
	self.addEventListener("touchend", async function stopResizing(event){
		if (app.environment.resizingConsole) {
			app.environment.resizingConsole = false;
			app.http.Request( "POST", "/config/sewers", [["Content-Type", "application/x-www-form-urlencoded"]], "console_height=" + app.environment.webConsole.getBoundingClientRect().height );
		}
	});

	// Prevent console from being hidden when resizing window.
	self.addEventListener("resize", async()=>{
		if ( app.environment.webConsole.getBoundingClientRect().height >= ( self.innerHeight - 75 ) && app.environment.webConsole.getBoundingClientRect().height > 51 ) {
			app.environment.webConsole.style.height = ( self.innerHeight - 75 ) + "px";
			app.environment.consoleResizeBar.style.bottom = ( self.innerHeight - 75 - 1 ) + "px";
			app.environment.scrollContainer.style.height = "calc(100% - " + ( self.innerHeight - 75 ) + "px)";

			let console_height = app.environment.webConsole.getBoundingClientRect().height;

			app.http.Request("POST", "/config/sewers", [["Content-Type", "application/x-www-form-urlencoded"]], "console_height=" + console_height);
		}
	});
