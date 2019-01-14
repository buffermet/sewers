
/* Sewers UI menu package */

	// Reveal submenus on desktop and mobile
	document.querySelectorAll("html body div.menu div.item").forEach(async(item)=>{
		if (item.getAttribute("name") !== "xssbutton") {
			item.addEventListener("pointerenter", async(event)=>{
				event.target.setAttribute("data-state", "on");
			});

			item.addEventListener("pointerleave", async(event)=>{
				event.target.setAttribute("data-state", "off");
			});

			item.addEventListener("click", async(event)=>{
				if ( event.target.getAttribute("data-state") == "off" ) {
					event.target.setAttribute("data-state", "on");
				} else {
					event.target.setAttribute("data-state", "off");
				}
			});
		}
	});
