package core

/*
*	
*	Handles HTTP transport.
*	
*/

import(
	"strings"
	"net/http"
	"io/ioutil"
)

func SendHTTPRequest(relay_address, request_type, user_agent, session_id, payload string) string {
	packet := request_type + "\n" + session_id + "\n" + payload
	p := strings.NewReader(packet)

	req, e := http.NewRequest("POST", relay_address, p)
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

	defer res.Body.Close()

	b, _ := ioutil.ReadAll(res.Body)

	body := string(b)

	/* DEBUG */

	// fmt.Println("\n---PACKET---\n")
	// fmt.Println(packet)
	// fmt.Println("\n---RESPONSE---\n")
	// fmt.Println(body)

	return body
}
