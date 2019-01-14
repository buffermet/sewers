
/* Sewers UI menu package */

	// Reveal submenus on desktop and mobile
	document.querySelectorAll("html body div.menu div.item").forEach(async(item)=>{
		if (item.getAttribute("name") !== "xssbutton") {
			item.addEventListener("mouseenter", async(event)=>{
				event.target.setAttribute("data-state", "on");

				event.target.addEventListener("click", async function f(event){
					if ( event.target.getAttribute("data-state") == "off" ) {
						event.target.setAttribute("data-state", "on");
						this.removeEventListener("click", f);
					} else {
						event.target.setAttribute("data-state", "off");
						this.removeEventListener("click", f);
					}
				});
			});
			item.addEventListener("mouseleave", async(event)=>{
				event.target.setAttribute("data-state", "off");
			});
		}
	});
