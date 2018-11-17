package core

/*
*	
*	Handles present sewer environment.
*	
*/

import (
	"strings"
	"os/exec"
)

const (
	PATH_UI     = "./ui"
	PATH_RELAYS = "./relays"
	PATH_MODULES_RELAYS       = "./modules/relays"
	PATH_MODULES_STAGERS      = "./modules/stagers"
	PATH_MODULES_INTERPRETERS = "./modules/interpreters"
	PATH_MODULES_PLUGINS      = "./modules/plugins"
)

var (
	VERSION = "1.0"
	USER_AGENT = "Sewers/" + VERSION + " HTTP Test Session"
)

func WhoAmI() string {
	user, _ := exec.Command("whoami").Output()
	hostname, _ := exec.Command("hostname").Output()

	return strings.TrimSpace( string(user) ) + "@" + strings.TrimSpace( string(hostname) )
}
