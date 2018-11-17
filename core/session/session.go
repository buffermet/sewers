package core

/*
*	
*	Handles session payload generation and obfuscation.
*	
*/

import(
	"io/ioutil"

	log "github.com/yungtravla/sewers/core/log"
	environment "github.com/yungtravla/sewers/core/environment"
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

func Get(relay, session string) string {
	encoded, e := ioutil.ReadFile(environment.PATH_RELAYS + "/" + relay + "/sessions/" + session + ".json")
	if e != nil {
		log.Info("unable to read " + log.BOLD + "relays/" + relay + "/sessions/" + session + ".json" + log.RESET, true)
	} else {
		return string(encoded)
	}

	return ""
}

func Set(relay, session, encoded string) {
	ioutil.WriteFile( environment.PATH_RELAYS + "/" + relay + "/sessions/" + session + ".json", []byte(encoded), 600 )
}
