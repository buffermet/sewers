package interpreter

/*

  Raw interpreter handlers.

*/

import (
  "errors"
  "io/ioutil"
  "regexp"

  "github.com/buffermet/sewers/core/environment"
)

type Interpreter struct {
  Device string
  EncryptionKey []byte
  FetchRate []int
  FetchRateTag string
  Hostname string
  Icon string
  InterpreterGetTag string
  InterpreterPostTag string
  InterpreterStreamTag string
  Logo string
  OS string
  Payload []byte
  RelayAddress string
  SessionID string
  SewersGetTag string
  SewersPostTag string
  SewersStreamTag string
  StreamRate []int
  StreamTag string
  TerminalSize []int
  UserAgent string
}

func New(platform string) (*[]byte, error) {
  if "" != regexp.MustCompile(`^(android|ios|linux|macos|windows)$`).FindString(platform) {
    return nil, errors.New("tried to generate payload for invalid platform: " + platform)
  }
  payload_path := environment.PATH_MODULES_INTERPRETERS + "/" + platform + "/raw.go"
  payload, err := ioutil.ReadFile(payload_path)
  if err != nil {
    return nil, errors.New(err.Error())
  }
  return &payload, nil
}
