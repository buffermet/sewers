package config

/*

  Handles JSON configuration files.

*/

import (
	"io/ioutil"
	"encoding/json"

	"github.com/buffermet/sewers/core/log"
)

func Configure(json_path string, new_json_data map[string][]string) {
	// Read old config
	json_encoded, e := ioutil.ReadFile(json_path)
	if e != nil {
		log.Fatal(e.Error())
	}

	// Encode old config
	var json_decoded map[string]interface{}
	if e := json.Unmarshal([]byte(json_encoded), &json_decoded); e != nil {
		log.Error("invalid JSON file: " + log.BOLD + json_path + log.RESET + "\n[" + log.BOLD_RED + "STACK TRACE" + log.RESET + "]" + "\n" + e.Error())
	}

	// Set new config
	for param, value := range new_json_data {
		json_decoded[param] = value[0]
	}

	// Indent config
	json_indented, e := json.MarshalIndent(json_decoded, "", "\t")
	if e != nil {
		log.Error("could not indent JSON data.\n[" + log.BOLD_RED + "STACK TRACE" + log.RESET + "]" + "\n" + e.Error())
	}

	// Write new config
	ioutil.WriteFile(json_path, json_indented, 0600)
}
