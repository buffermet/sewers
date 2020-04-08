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

	"github.com/buffermet/sewers/core/shell"
)

var (
	PATH_GO string
	PATH_RELAYS string
	PATH_MODULES_RELAYS string
	PATH_MODULES_STAGERS string
	PATH_MODULES_INTERPRETERS string
	PATH_MODULES_PLUGINS string
	PATH_SEWERS = "/src/github.com/buffermet/sewers"
	PATH_UI string
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
	user, _ := shell.Output("whoami")
	hostname, _ := shell.Output("hostname")
	regexp_whitespace := regexp.MustCompile(`(?s)\s`)
	user = regexp_whitespace.ReplaceAll(user, []byte(""))
	hostname = regexp_whitespace.ReplaceAll(hostname, []byte(""))
	return string(user) + "@" + string(hostname)
}

func Init() {
	PATH_GO = goPath()
	PATH_UI                   = PATH_GO + PATH_SEWERS + "/ui"
	PATH_RELAYS               = PATH_GO + PATH_SEWERS + "/relays"
	PATH_MODULES_RELAYS       = PATH_GO + PATH_SEWERS + "/modules/relays"
	PATH_MODULES_STAGERS      = PATH_GO + PATH_SEWERS + "/modules/stagers"
	PATH_MODULES_INTERPRETERS = PATH_GO + PATH_SEWERS + "/modules/interpreters"
	PATH_MODULES_PLUGINS      = PATH_GO + PATH_SEWERS + "/modules/plugins"
	WHOAMI = whoAmI()
}
