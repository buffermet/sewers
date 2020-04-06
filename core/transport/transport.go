package transport

/*

	Handles HTTP transport.

*/

import (
	"net/http"
	"strings"

	"github.com/buffermet/sewers/core/log"
)

func SendHTTPRequest(relay_address, request_type, user_agent, session_id, payload string) *http.Response {
	body := request_type + "\n" + session_id + "\n" + payload
	reader := strings.NewReader(body)

  req, err := http.NewRequest(
    "POST",
    relay_address,
    reader)
	if err != nil {
		log.Error(err.Error())
	}

  if user_agent != "" {
		req.Header.Set("User-Agent", user_agent)
	}

	client := &http.Client{}
	res, err := client.Do(req)
	if err != nil {
		log.Error(err.Error())
	}

	return res
}
