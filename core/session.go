package core

/*
*	
*	Handles session payload generation and obfuscation.
*	
*/

import(
	"io/ioutil"
)

type Session struct {
	SessionID string
	OS string
	Device string
	Hostname string
	EncryptKey string
	RelayAddress string
	InterpreterGetTag string
	InterpreterPostTag string
	SewersGetTag string
	SewersPostTag string
	FetchRate string
	FetchRateTag string
	TerminalSize string
	FetchSchedule []string
	PauseTerminal bool
}

func GetSession(relay, session string) string {
	session_config, e := ioutil.ReadFile(PATH_RELAYS + "/" + relay + "/sessions/" + session + ".json")
	if e != nil {
		LogToConsole(BOLD_RED + "ERROR" + STD + " Unable to read " + BOLD + "relays/" + relay + "/sessions/" + session + ".json" + STD)
	} else {
		return string(session_config)
	}

	return ""
}
