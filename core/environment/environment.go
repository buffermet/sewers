package environment

/*

	Handles installed environment.

*/

import (
	"os"
	"os/exec"
	"strings"
)

var (
	PATH_UI = ""
	PATH_RELAYS = ""
	PATH_MODULES_RELAYS = ""
	PATH_MODULES_STAGERS = ""
	PATH_MODULES_INTERPRETERS = ""
	PATH_MODULES_PLUGINS = ""

	PWD = ""
	WHOAMI = ""
	VERSION = "1.0"
)

func whoAmI() string {
	user, _ := exec.Command("whoami").Output()
	hostname, _ := exec.Command("hostname").Output()

	return strings.TrimSpace( string(user) ) + "@" + strings.TrimSpace( string(hostname) )
}

func Configure() {
	PWD, _ = os.Getwd()

	PATH_UI                   = PWD + "/ui"
	PATH_RELAYS               = PWD + "/relays"
	PATH_MODULES_RELAYS       = PWD + "/modules/relays"
	PATH_MODULES_STAGERS      = PWD + "/modules/stagers"
	PATH_MODULES_INTERPRETERS = PWD + "/modules/interpreters"
	PATH_MODULES_PLUGINS      = PWD + "/modules/plugins"

	WHOAMI = whoAmI()
}
