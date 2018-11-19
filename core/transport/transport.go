package transport

/*
*	
*	Handles HTTP transport.
*	
*/

import (
	"strings"
	"net/http"

	"github.com/yungtravla/sewers/core/log"
	"github.com/yungtravla/sewers/core/environment"
)

func SendHTTPRequest(relay_address, request_type, user_agent, session_id, payload string) *http.Response {
	packet := request_type + "\n" + session_id + "\n" + payload
	packet_reader := strings.NewReader(packet)

	req, e := http.NewRequest("POST", relay_address, packet_reader)
	if e != nil {
		log.Error( e.Error(), true )
	}

	if (user_agent == "") {
		req.Header.Set("User-Agent", environment.USER_AGENT)
	} else {
		req.Header.Set("User-Agent", user_agent)
	}

	client := &http.Client{}
	res, e := client.Do(req)
	if e != nil {
		log.Error( e.Error(), true )
	}

	/* DEBUG */

	// fmt.Println("\n---PACKET---\n")
	// fmt.Println(packet)
	// fmt.Println("\n---RESPONSE---\n")
	// fmt.Println(body)

	return res
}
