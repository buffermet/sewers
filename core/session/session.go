package session

/*
*	
*	Handles session payload generation and configuration.
*	
*/

import(
	"io/ioutil"

	"github.com/yungtravla/sewers/core/log"
	"github.com/yungtravla/sewers/core/environment"
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

func Get(relay_id, session_id string) string {
	encoded, e := ioutil.ReadFile(environment.PATH_RELAYS + "/" + relay_id + "/sessions/" + session_id + ".json")
	if e != nil {
		log.Warn("unknown session connected to relay: " + log.BOLD + session_id + log.RESET, true)
		return ""
	}

	return string(encoded)
}

func Set(relay_id, session_id, encoded_json string) {
	ioutil.WriteFile( environment.PATH_RELAYS + "/" + relay_id + "/sessions/" + session_id + ".json", []byte(encoded_json), 600 )
}

func New(relay, session, encoded string) {

}
