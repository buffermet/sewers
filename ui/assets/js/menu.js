
/* Sewers UI menu package */

	// Reveal submenus on desktop and mobile
	document.querySelectorAll("html body div.menu div.item").forEach(async(item)=>{
		if (item.getAttribute("name") !== "xssbutton") {
			item.addEventListener("mouseenter", async(event)=>{
				event.target.setAttribute("data-state", "on");

				item.addEventListener("mouseleave", async function a(event){
					event.target.setAttribute("data-state", "off");
					this.removeEventListener("mouseleave", a);
				});

				event.target.addEventListener("click", async function b(event){
					if ( event.target.getAttribute("data-state") == "off" ) {
						event.target.setAttribute("data-state", "on");
						this.removeEventListener("click", b);
						this.removeEventListener("click", b);
					} else {
						event.target.setAttribute("data-state", "off");
						this.removeEventListener("click", b);
					}
				});
			});
		}
	});
