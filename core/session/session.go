package session

/*

  Session config handlers.

*/

import (
	"errors"
	"encoding/json"
	"io/ioutil"

	"github.com/buffermet/sewers/core/environment"
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

func Get(relay_id, session_id string) (*Session, error) {
  encoded, err := GetEncoded(relay_id, session_id)
  if err != nil {
    return nil, err
  }

	s := New()
  err = json.Unmarshal(encoded, &s)
  if err != nil {
    session_path := environment.PATH_RELAYS + "/" + relay_id + "/sessions/" + session_id + ".json"
    return nil, errors.New("could not decode JSON file: " + session_path)
  }

  return s, nil
}

func GetEncoded(relay_id, session_id string) ([]byte, error) {
  session_path := environment.PATH_RELAYS + "/" + relay_id + "/sessions/" + session_id + ".json"
	encoded, e := ioutil.ReadFile(session_path)
	if e != nil {
		return nil, errors.New("could not read session config: " + session_id)
	}

  return encoded, nil
}

func Set(relay_id, session_id, encoded string) error {
  filepath := environment.PATH_RELAYS + "/" + relay_id + "/sessions/" + session_id + ".json"
 	err := ioutil.WriteFile(environment.PATH_RELAYS + "/" + relay_id + "/sessions/" + session_id + ".json", []byte(encoded), 600)
  if err != nil {
    return errors.New("could not write file: " + filepath + "\n" + err.Error())
  }

  return nil
}

func New() *Session {
  return &Session {
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    []string{},
    false,
  }
}
