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

	log "github.com/yungtravla/sewers/core/log"
	environment "github.com/yungtravla/sewers/core/environment"
	transport "github.com/yungtravla/sewers/core/transport"
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
	encoded_json, e := ioutil.ReadFile(environment.PATH_RELAYS + "/" + relay_id + "/" + relay_id + ".json")
	if e != nil {
		log.Error("could not read relay config " + log.BOLD + environment.PATH_RELAYS + "/" + relay_id + "/" + relay_id + ".json" + log.RESET, true)
	}

	return string(encoded_json)
}

func GetRelays() string {
	relays := []Relay{}

	// Read relay configs.
	var relay_configs []string
	config_list, e := ioutil.ReadDir(environment.PATH_RELAYS)
	if e != nil {
		log.Error( e.Error(), true )
		return "{{cannot_read_relay_dir}}"
	}
	for _, file := range config_list {
		relay_configs = append( relay_configs, file.Name() )
	}

	// Parse relay data
	if len(relay_configs) < 1 {
		log.Info( "did not find any relay configurations in sewers", true )

		return ""
	} else {
		for i := 0; i < len(relay_configs); i++ {
			relay_path := environment.PATH_RELAYS + "/" + relay_configs[i] + "/" + relay_configs[i] + ".json"

			json_encoded, e := ioutil.ReadFile(relay_path)
			if e != nil {
				log.Error( e.Error(), true )
			}

			var json_decoded map[string]interface{}
			if e := json.Unmarshal( []byte(json_encoded), &json_decoded ); e != nil {
				log.Error( "invalid JSON file: " + log.BOLD + relay_path + log.RESET + "\n[" + log.BOLD_RED + "STACK TRACE" + log.RESET + "]\n" + e.Error(), true )
			}

			if json_decoded["relay_address"] != nil && json_decoded["sewers_post_tag"] != nil && json_decoded["sewers_get_tag"] != nil {
				relay := Relay{}

				relay.RelayID = strings.Replace(relay_configs[i], ".json", "", 1)
				relay.RelayAddress = json_decoded["relay_address"].(string)

				relays = append(relays, relay)
			} else {
				log.Error( log.BOLD + relay_path + log.RESET + " is missing one of the following parameters: 'relay_address', 'sewers_post_tag' or 'sewers_get_tag'" + "\n[" + log.BOLD_RED + "STACK TRACE" + log.RESET + "]\n" + e.Error(), true )
			}
		}
	}

	return_bytes, _ := json.MarshalIndent(relays, "", "\t")

	return string(return_bytes)
}

func GetRelaySessions(relay string) string {
	json_encoded, e := ioutil.ReadFile(environment.PATH_RELAYS + "/" + relay + "/" + relay + ".json")
	if e != nil {
		log.Error( "Unable to retrieve relay configuration: " + log.BOLD + relay + ".json" + log.RESET + "\n[" + log.BOLD_RED + "STACK TRACE" + log.RESET + "]\n" + e.Error(), true )
	}

	var json_decoded map[string]interface{}
	if e := json.Unmarshal( []byte(json_encoded), &json_decoded ); e != nil {
		log.Error( "invalid JSON file: " + log.BOLD + environment.PATH_RELAYS + "/" + relay + "/" + relay + ".json" + log.RESET + "\n[" + log.BOLD_RED + "STACK TRACE" + log.RESET + "]\n" + e.Error(), true )
	}

	sessions := ""

	// Send HTTP request
	if json_decoded["relay_address"] != nil && json_decoded["sewers_get_tag"] != nil {
		relay_address := json_decoded["relay_address"].(string)
		get_tag := json_decoded["sewers_get_tag"].(string)
		user_agent := json_decoded["user_agent"].(string)

		response := transport.SendHTTPRequest(relay_address, get_tag, user_agent, "", "")

		body, e := ioutil.ReadAll(response.Body)
		if e != nil {
			log.Error( "Could not read response body (" + e.Error() + ")", true )
		}

		defer response.Body.Close()

		sessions = string(body)
	} else {
		log.Error( log.BOLD + relay + ".json" + log.RESET + " is missing a \"relay_address\" and/or \"get_tag\" property.", true )
	}

	return sessions
}

func GenerateRelay(payload_type string) []byte {
	raw_payload, e := ioutil.ReadFile(environment.PATH_RELAYS + "/" + payload_type + "/raw." + payload_type)
	if e != nil {
		log.Error( "Unable to retrieve raw relay payload: " + log.BOLD + environment.PATH_RELAYS + "/" + payload_type + "/" + "raw." + payload_type + log.RESET + "\n[" + log.BOLD_RED + "STACK TRACE" + log.RESET + "]\n" + e.Error(), true )
	}

	return raw_payload
}