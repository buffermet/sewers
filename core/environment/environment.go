package environment

/*

	Handles installed environment.

*/

import (
	"fmt"
	"os"
	"os/exec"
	"regexp"
	"runtime"
	"strings"	
)

var (
	GOPATH string
	SEWERSPATH = "/src/github.com/buffermet/sewers"
	PATH_UI string
	PATH_RELAYS string
	PATH_MODULES_RELAYS string
	PATH_MODULES_STAGERS string
	PATH_MODULES_INTERPRETERS string
	PATH_MODULES_PLUGINS string
	VERSION = "1.0"
	WHOAMI string
)

func goPath() string {
	go_path := os.Getenv("GOPATH")
	if go_path == "" {
		var stdout_bytes []byte
		var err error
		if runtime.GOOS == "android" {
			stdout_bytes, err = exec.Command("/system/bin/sh", "-c", "go env").Output()
		} else if runtime.GOOS == "windows" {
			stdout_bytes, err = exec.Command("cmd", "/C", "go env").Output()
		} else {
			stdout_bytes, err = exec.Command("/usr/bin/env", "sh", "-c", "go env").Output()
		}
		if err != nil {
			fmt.Println("error: could not determine GOPATH: " + err.Error())
			os.Exit(1)
		}
		stdout_bytes = regexp.MustCompile(`(?s).*GOPATH="([^"]+)".*`).ReplaceAll(stdout_bytes, []byte("${1}"))
		if len(stdout_bytes) == 0 {
			fmt.Println("error: could not find GOPATH of go environment")
			os.Exit(1)
		}
		return string(stdout_bytes)
	}
	return go_path
}

func whoAmI() string {
	user, _ := exec.Command("whoami").Output()
	hostname, _ := exec.Command("hostname").Output()
	return strings.TrimSpace(string(user)) + "@" + strings.TrimSpace(string(hostname))
}

func Init() {
	GOPATH = goPath()
	PATH_UI                   = GOPATH + SEWERSPATH + "/ui"
	PATH_RELAYS               = GOPATH + SEWERSPATH + "/relays"
	PATH_MODULES_RELAYS       = GOPATH + SEWERSPATH + "/modules/relays"
	PATH_MODULES_STAGERS      = GOPATH + SEWERSPATH + "/modules/stagers"
	PATH_MODULES_INTERPRETERS = GOPATH + SEWERSPATH + "/modules/interpreters"
	PATH_MODULES_PLUGINS      = GOPATH + SEWERSPATH + "/modules/plugins"
	WHOAMI = whoAmI()
}
