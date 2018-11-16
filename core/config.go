package core

/*
*	
*	Handles JSON configuration files.
*	
*/

import (
	"log"
	"io/ioutil"
	"encoding/json"
)

func Configure(json_path string, new_json_data map[string][]string) {
	// Read old config
	json_data, e := ioutil.ReadFile(json_path)
	if e != nil {
		log.Fatal(e)
	}

	// Encode old config
	var json_encoded map[string]interface{}
	if e := json.Unmarshal( []byte(json_data), &json_encoded ); e != nil {
		LogToConsole( BOLD_RED + "ERROR" + RESET + " Invalid JSON file: " + BOLD + json_path + RESET + "\n[" + BOLD_RED + "STACK TRACE" + RESET + "]" + "\n" + e.Error() )
	}

	// Set new config
	for param, value := range new_json_data {
		json_encoded[param] = value[0]
	}

	// Indent config
	json_indented, e := json.MarshalIndent(json_encoded, "", "\t")
	if e != nil {
		LogToConsole( BOLD_RED + "ERROR" + RESET + " Could not indent JSON data.\n[" + BOLD_RED + "STACK TRACE" + RESET + "]" + "\n" + e.Error() )
	}

	// Write new config
	ioutil.WriteFile(json_path, json_indented, 0600)
}
