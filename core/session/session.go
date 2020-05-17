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

func Encode(s *Session) (*[]byte, error) {
  var encoded map[string]interface{}
  encoded["session_id"] = s.SessionID
  encoded["os"] = s.OS
  encoded["device"] = s.Device
  encoded["hostname"] = s.Hostname
  encoded["encryption_key"] = s.EncryptKey
  encoded["relay_address"] = s.RelayAddress
  encoded["interpreter_get_tag"] = s.InterpreterGetTag
  encoded["interpreter_post_tag"] = s.InterpreterPostTag
  encoded["sewers_get_tag"] = s.SewersGetTag
  encoded["sewers_post_tag"] = s.SewersPostTag
  encoded["fetch_rate"] = s.FetchRate
  encoded["fetch_rate_tag"] = s.FetchRateTag
  encoded["terminal_size"] = s.TerminalSize
  encoded["fetch_schedule"] = s.FetchSchedule
  encoded["pause_terminal"] = s.PauseTerminal

  b, err := json.Marshal(encoded)
  if err != nil {
    return nil, errors.New("could not JSON encode session config with session ID " + encoded["session_id"].(string))
  }

  return &b, nil
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

func New() *Session {
  return &Session{}
}

func Set(relay_id, session_id, encoded string) error {
  filepath := environment.PATH_RELAYS + "/" + relay_id + "/sessions/" + session_id + ".json"
  err := ioutil.WriteFile(environment.PATH_RELAYS + "/" + relay_id + "/sessions/" + session_id + ".json", []byte(encoded), 600)
  if err != nil {
    return errors.New("could not write file: " + filepath + "\n" + err.Error())
  }

  return nil
}
