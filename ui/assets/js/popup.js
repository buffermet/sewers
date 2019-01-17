
/*
*
*	Sewers UI popup package
*
*/

	app.functions.showPopup = async html => {
		app.environment.popupContent.innerHTML = html;

		app.environment.popup.setAttribute("data-state", "on");
	}

	app.functions.closePopup = async () => {
		app.environment.popup.setAttribute("data-state", "off");

		app.environment.popupContent.innerHTML = "";
	}
