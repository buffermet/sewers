package core

/*
*	
*	Handles relay payload generation and obfuscation.
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

func GetRelays() string {
	relays := []Relay{}

	// Read relay configs.
	var relay_configs []string
	config_list, e := ioutil.ReadDir(PATH_RELAYS)
	if e != nil {
		LogToConsole( BOLD_RED + "ERROR" + STD + " " + e.Error() )
		return "{{error_relays_dir_missing}}"
	}
	for _, file := range config_list {
		relay_configs = append( relay_configs, file.Name() )
	}

	// Parse relay data
	if len(relay_configs) < 1 {
		LogToConsole( BOLD_BLACK_ON_GREY + "[" + Timestamp() + "]" + STD + " did not find any relay configurations in sewers." )

		return ""
	} else {
		for i := 0; i < len(relay_configs); i++ {
			relay_path := PATH_RELAYS + "/" + relay_configs[i] + "/" + relay_configs[i] + ".json"

			config, e := ioutil.ReadFile(relay_path)
			if e != nil {
				LogToConsole( BOLD_RED + "ERROR" + STD + " " + e.Error() )
			}

			var json_decoded map[string]interface{}
			if e := json.Unmarshal( []byte(config), &json_decoded ); e != nil {
				LogToConsole( BOLD_RED + "ERROR" + STD + " Invalid JSON file: " + BOLD + relay_path + STD + "\n[" + BOLD_RED + "STACK TRACE" + STD + "]\n" + e.Error() )
			}

			if json_decoded["relay_address"] != nil && json_decoded["sewers_post_tag"] != nil && json_decoded["sewers_get_tag"] != nil {
				relay_id := strings.Replace(relay_configs[i], ".json", "", 1)
				relay_address := json_decoded["relay_address"].(string)

				relay_slice := Relay{}
				relay_slice.RelayID = relay_id
				relay_slice.RelayAddress = relay_address

				relays = append(relays, relay_slice)
			} else {
				LogToConsole( BOLD_RED + "ERROR" + STD + BOLD + relay_path + STD + " is missing one of the following parameters: 'relay_address', 'sewers_post_tag' or 'sewers_get_tag'" + "\n[" + BOLD_RED + "STACK TRACE" + STD + "]\n" + e.Error() )
			}
		}
	}

	return_bytes, _ := json.MarshalIndent(relays, "", "\t")

	return string(return_bytes)
}

func GetRelaySessions(relay string) string {
	config, e := ioutil.ReadFile(PATH_RELAYS + "/" + relay + "/" + relay + ".json")
	if e != nil {
		LogToConsole( BOLD_RED + "ERROR" + STD + " Unable to retrieve relay configuration: " + BOLD + relay + ".json" + STD + "\n[" + BOLD_RED + "STACK TRACE" + STD + "]\n" + e.Error() )
	}

	var json_decoded map[string]interface{}
	if e := json.Unmarshal( []byte(config), &json_decoded ); e != nil {
		LogToConsole( BOLD_RED + "ERROR" + STD + " Invalid JSON file: " + BOLD + PATH_RELAYS + "/" + relay + "/" + relay + ".json" + STD + "\n[" + BOLD_RED + "STACK TRACE" + STD + "]\n" + e.Error() )
	}

	sessions := ""

	// Send HTTP request
	if json_decoded["relay_address"] != nil && json_decoded["sewers_get_tag"] != nil {
		relay_address := json_decoded["relay_address"].(string)
		get_tag := json_decoded["sewers_get_tag"].(string)

		sessions = SendHTTPRequest(relay_address, get_tag, "nil", "nil")
	} else {
		LogToConsole( BOLD_RED + "ERROR" + STD + " " + BOLD + relay + ".json" + STD + " is missing a \"relay_address\" and/or \"get_tag\" property." )
	}

	return sessions
}
