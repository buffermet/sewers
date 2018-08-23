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
	PATH_RAW_INTERPRETERS = "./modules/raw_interpreters"
	PATH_RAW_RELAYS       = "./modules/raw_relays"
	PATH_RAW_STAGERS      = "./modules/raw_stagers"
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
