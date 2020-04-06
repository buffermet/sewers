package relay

/*

  Relay config handlers.

*/

import (
	"encoding/json"
  "errors"
	"io/ioutil"
	"strings"

	"github.com/buffermet/sewers/core/environment"
	"github.com/buffermet/sewers/core/log"
	"github.com/buffermet/sewers/core/transport"
)

type Relay struct {
	InterpreterGetTag string
	InterpreterPostTag string
	RelayAddress string
	RelayID string
	SewersGetTag string
	SewersPostTag string
	Sessions []string
}

func Get(relay_id string) string {
	encoded_json, err := ioutil.ReadFile(environment.PATH_RELAYS + "/" + relay_id + "/" + relay_id + ".json")
	if err != nil {
		log.Error("could not read relay config " + log.BOLD + environment.PATH_RELAYS + "/" + relay_id + "/" + relay_id + ".json" + log.RESET)
	}

	return string(encoded_json)
}

func GetAddress(relay_id string) (string, error) {
  relay_path := environment.PATH_RELAYS + "/" + relay_id + "/" + relay_id + ".json"
  encoded, err := ioutil.ReadFile(relay_path)
  if err != nil {
    return "", errors.New("could not read relay config: " + relay_path)
  }

  var decoded map[string]interface{}
  err = json.Unmarshal(encoded, &decoded)
  if err != nil {
    return "", errors.New("could not decode relay config: " + relay_path)
  }

  return decoded["relay_address"].(string), nil
}

func GetAllConfigs() string {
	relays := []Relay{}

	// Read relay configs.
	var relay_configs []string
	config_list, err := ioutil.ReadDir(environment.PATH_RELAYS)
	if err != nil {
		log.Error(err.Error())
		return "{}"
	}
	for _, file := range config_list {
		relay_configs = append(relay_configs, file.Name())
	}

	// Parse relay data
	if len(relay_configs) == 0 {
		log.Info("did not find any relay configurations in sewers")
		return "{}"
	} else {
		for i := 0; i < len(relay_configs); i++ {
			relay_path := environment.PATH_RELAYS + "/" + relay_configs[i] + "/" + relay_configs[i] + ".json"
			json_encoded, err := ioutil.ReadFile(relay_path)
			if err != nil {
				log.Error(err.Error())
			}

			var json_decoded map[string]interface{}
			if err := json.Unmarshal([]byte(json_encoded), &json_decoded); err != nil {
				log.Error("invalid JSON file: " + log.BOLD + relay_path + log.RESET + "\n[" + log.BOLD_RED + "STACK TRACE" + log.RESET + "]\n" + err.Error())
			}

			if json_decoded["relay_address"] != nil && json_decoded["sewers_post_tag"] != nil && json_decoded["sewers_get_tag"] != nil {
				relay := Relay{}
				relay.RelayID = strings.Replace(relay_configs[i], ".json", "", 1)
				relay.RelayAddress = json_decoded["relay_address"].(string)
				relays = append(relays, relay)
			} else {
				log.Error(log.BOLD + relay_path + log.RESET + " is missing one of the following parameters: 'relay_address', 'sewers_post_tag' or 'sewers_get_tag'" + "\n[" + log.BOLD_RED + "STACK TRACE" + log.RESET + "]\n" + err.Error())
			}
		}
	}

	indented, _ := json.MarshalIndent(relays, "", "\t")

	return string(indented)
}

func FetchSessions(relay string) (string, error) {
	json_encoded, err := ioutil.ReadFile(environment.PATH_RELAYS + "/" + relay + "/" + relay + ".json")
	if err != nil {
		return "", errors.New("cannot read relay config: " + log.BOLD + relay + ".json" + log.RESET + "\n[" + log.BOLD_RED + "STACK TRACE" + log.RESET + "]\n" + err.Error())
	}

	var json_decoded map[string]interface{}
	if err := json.Unmarshal([]byte(json_encoded), &json_decoded); err != nil {
		log.Error("invalid JSON file: " + log.BOLD + environment.PATH_RELAYS + "/" + relay + "/" + relay + ".json" + log.RESET + "\n[" + log.BOLD_RED + "STACK TRACE" + log.RESET + "]\n" + err.Error())
	}

	sessions := ""

	// Send HTTP request
	if json_decoded["relay_address"] != nil && json_decoded["sewers_get_tag"] != nil {
		relay_address := json_decoded["relay_address"].(string)
		get_tag := json_decoded["sewers_get_tag"].(string)
		user_agent := json_decoded["user_agent"].(string)

		response := transport.SendHTTPRequest(
      relay_address,
      get_tag,
      user_agent,
      "",
      "")
		body, err := ioutil.ReadAll(response.Body)
		if err != nil {
			return "", errors.New("could not read response body (" + err.Error() + ")")
		}
		defer response.Body.Close()
		sessions = string(body)
	} else {
		return "", errors.New("relay " + log.BOLD + relay + log.RESET + " is missing a \"relay_address\" and/or \"sewers_get_tag\" property.")
	}

	return sessions, nil
}

func New() *Relay {
  return &Relay{}
}

func NewPayload(payload_type string) ([]byte, error) {
	payload_path := environment.PATH_RELAYS + "/" + payload_type + "/raw." + payload_type
  payload, err := ioutil.ReadFile(environment.PATH_RELAYS + "/" + payload_type + "/raw." + payload_type)
	if err != nil {
	  return []byte(""), errors.New("could not read relay payload, filetype is removed or doesn't exist: " + payload_path)
	}

	return payload, nil
}
