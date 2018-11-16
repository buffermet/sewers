package core

/*
*	
*	Handles HTTP transport.
*	
*/

import (
	"strings"
	"net/http"
)

func SendHTTPRequest(relay_address, request_type, user_agent, session_id, payload string) *http.Response {
	packet := request_type + "\n" + session_id + "\n" + payload
	packet_reader := strings.NewReader(packet)

	req, e := http.NewRequest("POST", relay_address, packet_reader)
	if e != nil {
		LogToConsole( BOLD_RED + "ERROR" + RESET + " " + e.Error() )
	}

	if (user_agent == "") {
		req.Header.Set("User-Agent", USER_AGENT)
	} else {
		req.Header.Set("User-Agent", user_agent)
	}

	client := &http.Client{}
	res, e := client.Do(req)
	if e != nil {
		LogToConsole( BOLD_RED + "ERROR" + RESET + " " + e.Error() )
	}

	/* DEBUG */

	// fmt.Println("\n---PACKET---\n")
	// fmt.Println(packet)
	// fmt.Println("\n---RESPONSE---\n")
	// fmt.Println(body)

	return res
}
