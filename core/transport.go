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

func SendHTTPRequest(relay_address, request_type, session_id, payload string) string {
	packet := request_type + "\n" + session_id + "\n" + payload
	p := strings.NewReader(packet)

	req, e := http.NewRequest("POST", relay_address, p)
	if e != nil {
		LogToConsole( BOLD_RED + "ERROR" + STD + " " + e.Error() )
	}

	req.Header.Set("User-Agent", USER_AGENT)

	client := &http.Client{}
	res, e := client.Do(req)
	if e != nil {
		LogToConsole( BOLD_RED + "ERROR" + STD + " " + e.Error() )
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
