package core

/*
*	
*	Manages and generates relays.
*	
*/

import(
	"io/ioutil"
	"encoding/json"
	"strings"
)

type Relay struct {
	RelayID string
	RelayAddress string
	InterpreterGetTag string
	InterpreterPostTag string
	SewersGetTag string
	SewersPostTag string
	Sessions []string
}

func GetRelayConfig(relay_id string) string {
	enc_config, e := ioutil.ReadFile(PATH_RELAYS + "/" + relay_id + "/" + relay_id + ".json")
	if e != nil {
		LogToConsole(BOLD_RED + "ERROR" + RESET + " Could not read relay config " + BOLD + PATH_RELAYS + "/" + relay_id + "/" + relay_id + ".json" + RESET)
	}

	return string(enc_config)
}

func GetRelays() string {
	relays := []Relay{}

	// Read relay configs.
	var relay_configs []string
	config_list, e := ioutil.ReadDir(PATH_RELAYS)
	if e != nil {
		LogToConsole( BOLD_RED + "ERROR" + RESET + " " + e.Error() )
		return "{{error_relays_dir_missing}}"
	}
	for _, file := range config_list {
		relay_configs = append( relay_configs, file.Name() )
	}

	// Parse relay data
	if len(relay_configs) < 1 {
		LogToConsole( BOLD_BLACK_ON_GREY + "[" + Timestamp() + "]" + RESET + " did not find any relay configurations in sewers." )

		return ""
	} else {
		for i := 0; i < len(relay_configs); i++ {
			relay_path := PATH_RELAYS + "/" + relay_configs[i] + "/" + relay_configs[i] + ".json"

			config, e := ioutil.ReadFile(relay_path)
			if e != nil {
				LogToConsole( BOLD_RED + "ERROR" + RESET + " " + e.Error() )
			}

			var json_decoded map[string]interface{}
			if e := json.Unmarshal( []byte(config), &json_decoded ); e != nil {
				LogToConsole( BOLD_RED + "ERROR" + RESET + " Invalid JSON file: " + BOLD + relay_path + RESET + "\n[" + BOLD_RED + "STACK TRACE" + RESET + "]\n" + e.Error() )
			}

			if json_decoded["relay_address"] != nil && json_decoded["sewers_post_tag"] != nil && json_decoded["sewers_get_tag"] != nil {
				relay_id := strings.Replace(relay_configs[i], ".json", "", 1)
				relay_address := json_decoded["relay_address"].(string)

				relay := Relay{}
				relay.RelayID = relay_id
				relay.RelayAddress = relay_address

				relays = append(relays, relay)
			} else {
				LogToConsole( BOLD_RED + "ERROR" + RESET + BOLD + relay_path + RESET + " is missing one of the following parameters: 'relay_address', 'sewers_post_tag' or 'sewers_get_tag'" + "\n[" + BOLD_RED + "STACK TRACE" + RESET + "]\n" + e.Error() )
			}
		}
	}

	return_bytes, _ := json.MarshalIndent(relays, "", "\t")

	return string(return_bytes)
}

func GetRelaySessions(relay string) string {
	config, e := ioutil.ReadFile(PATH_RELAYS + "/" + relay + "/" + relay + ".json")
	if e != nil {
		LogToConsole( BOLD_RED + "ERROR" + RESET + " Unable to retrieve relay configuration: " + BOLD + relay + ".json" + RESET + "\n[" + BOLD_RED + "STACK TRACE" + RESET + "]\n" + e.Error() )
	}

	var json_decoded map[string]interface{}
	if e := json.Unmarshal( []byte(config), &json_decoded ); e != nil {
		LogToConsole( BOLD_RED + "ERROR" + RESET + " Invalid JSON file: " + BOLD + PATH_RELAYS + "/" + relay + "/" + relay + ".json" + RESET + "\n[" + BOLD_RED + "STACK TRACE" + RESET + "]\n" + e.Error() )
	}

	sessions := ""

	// Send HTTP request
	if json_decoded["relay_address"] != nil && json_decoded["sewers_get_tag"] != nil {
		relay_address := json_decoded["relay_address"].(string)
		get_tag := json_decoded["sewers_get_tag"].(string)
		user_agent := json_decoded["user_agent"].(string)

		sessions = SendHTTPRequest(relay_address, get_tag, user_agent, "", "")
	} else {
		LogToConsole( BOLD_RED + "ERROR" + RESET + " " + BOLD + relay + ".json" + RESET + " is missing a \"relay_address\" and/or \"get_tag\" property." )
	}

	return sessions
}

func GenerateRelay(payload_type string) []byte {
	raw_payload, e := ioutil.ReadFile(PATH_RELAYS + "/" + payload_type + "/raw." + payload_type)
	if e != nil {
		LogToConsole( BOLD_RED + "ERROR" + RESET + " Unable to retrieve raw relay payload: " + BOLD + PATH_RELAYS + "/" + payload_type + "/" + "raw." + payload_type + RESET + "\n[" + BOLD_RED + "STACK TRACE" + RESET + "]\n" + e.Error() )
	}

	return raw_payload
}