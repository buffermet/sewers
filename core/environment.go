package core

/*
*	
*	Handles present sewer environment.
*	
*/

import(
	"strings"
	"os/exec"
)

const(
	PATH_UI               = "./ui"
	PATH_RELAYS           = "./relays"
	PATH_MODULES_RELAYS       = "./modules/relays"
	PATH_MODULES_STAGERS      = "./modules/stagers"
	PATH_MODULES_INTERPRETERS = "./modules/interpreters"
	PATH_MODULES_PLUGINS      = "./modules/plugins"
)

var(
	VERSION = "1.0"
	USER_AGENT = "sewers/" + VERSION + " HTTP Test Session"
)

func WhoAmI() string {
	user, e := exec.Command("whoami").Output()
	if e != nil {
		Log( e.Error() )
	}

	hostname, e := exec.Command("hostname").Output()
	if e != nil {
		Log( e.Error() )
	}

	return strings.TrimSpace( string(user) ) + "@" + strings.TrimSpace( string(hostname) )
}
