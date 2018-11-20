package ui

/*
*	
*	UI server.
*	
*/

import (
	"os"
	"fmt"
	"regexp"
	"strings"
	"strconv"
	"net/http"
	"io/ioutil"
	"encoding/json"

	"golang.org/x/net/websocket"

	"github.com/yungtravla/sewers/core/log"
	"github.com/yungtravla/sewers/core/relay"
	"github.com/yungtravla/sewers/core/config"
	"github.com/yungtravla/sewers/core/session"
	"github.com/yungtravla/sewers/core/transport"
	"github.com/yungtravla/sewers/core/encryption"
	"github.com/yungtravla/sewers/core/environment"
)

var (
	UI_PORT = "8042"
)

func successBody(res *http.Response) string {
	encoded := "{\"response\":\"\",\"responseType\":\"success\"}"
	var decoded map[string]interface{}
	json.Unmarshal( []byte(encoded), &decoded )

	defer res.Body.Close()
	body, e := ioutil.ReadAll(res.Body)
	if e != nil {
		log.Error( "could not read response body (" + e.Error() + ")", true )
	}

	decoded["response"] = body

	json_body, e := json.Marshal(decoded)
	if e != nil {
		log.Error( "invalid JSON data (" + e.Error() + ")", true )
	}

	return string(json_body)
}

func errorBody(res *http.Response) string {
	encoded := "{\"response\":\"\",\"responseType\":\"error\"}"
	var decoded map[string]interface{}
	json.Unmarshal( []byte(encoded), &decoded )

	defer res.Body.Close()
	body, e := ioutil.ReadAll(res.Body)
	if e != nil {
		log.Error( "could not read response body (" + e.Error() + ")", true )
	}

	decoded["response"] = body

	json_body, e := json.Marshal(decoded)
	if e != nil {
		log.Error( "invalid JSON data (" + e.Error() + ")", true )
	}

	return string(json_body)
}

func stream(ws *websocket.Conn) {
	var allow_connections bool
	var ip_string string

	if strings.HasPrefix(ws.Request().RemoteAddr, "127.0.0.1:") {
		allow_connections = true
		ip_string = log.BOLD_GREEN + ws.Request().RemoteAddr + log.RESET
	} else {
		allow_connections = false
		ip_string = log.BOLD_RED + ws.Request().RemoteAddr + log.RESET
	}

	if allow_connections {

		log.Info(ip_string + " tried to open a websocket", true)

	} else {

		// Received unauthenticated request.
		log.Warn(ip_string + " tried to open a websocket", true)

	}
}

func serve(res http.ResponseWriter, req *http.Request) {
	var allow_connections bool
	var ip_string string

	if strings.HasPrefix(req.RemoteAddr, "127.0.0.1:") {
		allow_connections = true
		ip_string = log.BOLD_GREEN + req.RemoteAddr + log.RESET
	} else {
		allow_connections = false
		ip_string = log.BOLD_RED + req.RemoteAddr + log.RESET
	}

	// Serve
	if allow_connections {

		if strings.Contains(req.URL.Path, "..") {
			log.Warn(ip_string + " tried to access a level up /..", true)
		}
		if req.URL.Path == "/" {
			log.Info(ip_string + " requested " + req.URL.Path, true)

			http.ServeFile(res, req, environment.PATH_UI + "/index.html")
		} else if strings.HasPrefix(req.URL.Path, "/terminal") {
			log.Info(ip_string + " requested " + req.URL.Path, true)

			http.ServeFile(res, req, environment.PATH_UI + "/terminal.html")
		} else if strings.HasSuffix(req.URL.Path, ".html") || 
		          strings.HasSuffix(req.URL.Path, ".css") || 
		          strings.HasSuffix(req.URL.Path, ".js") || 
		          strings.HasSuffix(req.URL.Path, ".ico") || 
		          strings.HasSuffix(req.URL.Path, ".svg") || 
		          strings.HasSuffix(req.URL.Path, ".png") || 
		          strings.HasSuffix(req.URL.Path, ".jpg") || 
		          strings.HasSuffix(req.URL.Path, ".ttf") || 
		          strings.HasSuffix(req.URL.Path, ".mp3") {
			res.Header().Set("Cache-Control", "no-cache, no-store")
			res.Header().Set("Pragma", "no-cache")
			res.Header().Set("Expires", "0")

			http.ServeFile(res, req, environment.PATH_UI + "" + req.URL.Path)
		} else if req.URL.Path == "/relays" {
			relays := relay.GetAll()

			res.Header().Set("Content-Type", "application/json")

			fmt.Fprintf(res, relays)
		} else if strings.HasPrefix(req.URL.Path, "/relay/") {
			log.Info(ip_string + " requested " + req.URL.Path, true)

			relay_id := strings.Replace(req.URL.Path, "/relay/", "", 1)
			body := relay.GetSessions(relay_id)

			fmt.Fprintf(res, body)
		} else if strings.HasPrefix(req.URL.Path, "/session/") {
			log.Info(ip_string + " requested " + req.URL.Path, true)

			parts := strings.Replace(req.URL.Path, "/session/", "", 1)
			relay_id := strings.Split(parts, "/")[0]
			session_id := strings.Split(parts, "/")[1]

			body := session.Get(relay_id, session_id)

			fmt.Fprintf(res, body)
		} else if req.URL.Path == "/console_log" {
			res.Header().Set("Content-Type", "text/plain")
			res.Header().Set("Cache-Control", "no-cache, no-store, must-revalidate")
			res.Header().Set("Pragma", "no-cache")
			res.Header().Set("Expires", "0")

			http.ServeFile(res, req, environment.PATH_UI + "/console_log.html")
		} else if req.URL.Path == "/clear_console_log" {
			log.ClearConsole(ip_string)

			fmt.Fprintf(res, "OK")
		} else if strings.HasPrefix(req.URL.Path, "/config") {
			path := regexp.MustCompile(`^/`).ReplaceAllString(req.URL.Path, "")

			split_path := strings.Split(path, "/")

			json_path := ""
			if len(split_path) > 2 {
				// Request is intended for a session config.
				json_path = environment.PATH_RELAYS + "/" + split_path[1] + "/sessions/" + split_path[2] + ".json"
			} else if len(split_path) == 2 {
				if split_path[1] == "sewers" {
					// Request is intended for sewers config.
					json_path = "./config.json"
				} else {
					// Request is intended for a relay config.
					json_path = environment.PATH_RELAYS + "/" + split_path[1] + "/" + split_path[1] + ".json"
				}
			}

			req.ParseForm()

			if len(req.Form) > 0 {
				config.Configure(json_path, req.Form)
			} else {
				body, e := ioutil.ReadFile(json_path)
				if e != nil {
					log.Error("unable to read " + log.BOLD + json_path + log.RESET, true)
				}

				res.Header().Set("Content-Type", "application/json")

				fmt.Fprintf( res, string(body) )
			}
		} else if req.URL.Path == "/host" {
			fmt.Fprintf( res, environment.WHOAMI )
		} else if strings.HasPrefix(req.URL.Path, "/useragent") {
			relay_id := regexp.MustCompile(`^/useragent/`).ReplaceAllString(req.URL.Path, "")

			if regexp.MustCompile(`^[a-zA-Z0-9._-]+$`).FindString(relay_id) != "" {
				enc_config := relay.Get(relay_id)

				var c map[string]interface{}
				if e := json.Unmarshal( []byte(enc_config), &c ); e != nil {
					log.Error( "could not decode JSON file " + log.BOLD + environment.PATH_RELAYS + "/" + relay_id + "/" + relay_id + ".json" + log.RESET + "\n" + e.Error(), true )
				}

				fmt.Fprintf( res, c["user_agent"].(string) )
			}
		} else if strings.HasPrefix(req.URL.Path, "/get") {
			req.ParseForm()

			var (
				packet_id string
				session_id string
				relay_id string
			)

			f := req.Form
			for param, value := range f {
				if param == "packet_id" {
					packet_id = value[0]
				} else if param == "session_id" {
					session_id = value[0]
				} else if param == "relay_id" {
					relay_id = value[0]
				}
			}

			if session_id != "" && relay_id != "" {
				var c map[string]interface{}
				if e := json.Unmarshal( []byte( session.Get(relay_id, session_id) ), &c ); e != nil {
					log.Error( e.Error(), true )
				}

				res.Header().Set("Content-Type", "text/plain")

				if packet_id == "" {
					log.Info(log.BOLD_YELLOW + "REQUEST" + log.RESET + " " + log.BOLD + "GET" + log.RESET + " " + ip_string + " tried to fetch packet list from interpreter " + log.BOLD_YELLOW + session_id + "/" + relay_id + log.RESET, true)

					response := transport.SendHTTPRequest( c["relay_address"].(string), c["sewers_get_tag"].(string), c["user_agent"].(string), session_id, "" )

					body, e := ioutil.ReadAll(response.Body)
					if e != nil {
						log.Error( "could not read response body (" + e.Error() + ")", true )
					}

					defer response.Body.Close()

					fmt.Fprintf( res, string(body) )
				} else {
					log.Info(log.BOLD_YELLOW + "REQUEST" + log.RESET + " " + ip_string + " tried to fetch packet " + log.BOLD_YELLOW + packet_id + log.RESET + " from interpreter " + log.BOLD_YELLOW + session_id + "/" + relay_id + log.RESET, true)

					response := transport.SendHTTPRequest( c["relay_address"].(string), c["sewers_get_tag"].(string), c["user_agent"].(string), session_id, packet_id )

					body, e := ioutil.ReadAll(response.Body)
					if e != nil {
						log.Error( "could not read response body (" + e.Error() + ")", true )
					}

					defer response.Body.Close()

					key := []byte( c["encryption_key_one"].(string) )

					dec_response, e := encryption.Decrypt(key, body)
					if e != nil {
						log.Error( log.BOLD_BLUE + "RESPONSE" + log.RESET + " " + ip_string + " was unable to decrypt response from interpreter.\npacket_id: " + packet_id + "\nsession_id: " + session_id + "\nrelay_id: " + relay_id + "\nrequest_tag: " + c["sewers_get_tag"].(string) + "\nlength: " + strconv.Itoa( len(body) ) + "\n[" + log.BOLD_RED + "STACK TRACE" + log.RESET + "]\n" + e.Error(), true )

						fmt.Fprintf(res, "")
						return
					}

					log.Info( log.BOLD_BLUE + "RESPONSE" + log.RESET + " fetched by " + ip_string + "\nsession_id: " + session_id + "\nrelay_id: " + relay_id + "\npacket_id: " + packet_id + "\nencrypted response length: " + strconv.Itoa( len(body) ) + "\ndecrypted response length: " + strconv.Itoa( len(dec_response) ), true )

					fmt.Fprintf( res, string(dec_response) )
				}
			} else {
				log.Error(log.BOLD_YELLOW + "REQUEST" + log.RESET + " " + ip_string + " tried to send a malformed packet.\npacket_id: " + packet_id + "\nsession_id: " + session_id + "\nrelay_id: " + relay_id, true)
			}
		} else if strings.HasPrefix(req.URL.Path, "/post") {
			req.ParseForm()

			var (
				body string
				session_id string
				relay_id string
			)

			form := req.Form
			for param, value := range form {
				if param == "body" {
					body = value[0]
				} else if param == "session_id" {
					session_id = value[0]
				} else if param == "relay_id" {
					relay_id = value[0]
				}
			}

			if body != "" && session_id != "" && relay_id != "" {
				var c map[string]interface{}
				if e := json.Unmarshal( []byte( session.Get(relay_id, session_id) ), &c ); e != nil {
					log.Error( e.Error(), true )
				}

				log.Info( log.BOLD_YELLOW + "REQUEST" + log.RESET + " " + log.BOLD + "POST" + log.RESET + " " + ip_string + " sent a packet to " + log.BOLD_YELLOW + session_id + log.RESET + "\ncommand: " + body + "\nrelay_address: " + c["relay_address"].(string) + "\nrequest_tag: " + c["sewers_post_tag"].(string), true )

				encrypt_key_bytes := []byte( c["encryption_key_one"].(string) )
				payload_bytes := []byte(body)

				enc_payload, e := encryption.Encrypt(encrypt_key_bytes, payload_bytes)
				if e != nil {
					log.Error( log.BOLD_YELLOW + "REQUEST" + log.RESET + " " + ip_string + " Could not encrypt payload.\nData: " + body + "\n[" + log.BOLD_RED + "STACK TRACE" + log.RESET + "]\n" + e.Error(), true )
				}
				enc_payload_string := string(enc_payload)

				response := transport.SendHTTPRequest( c["relay_address"].(string), c["sewers_post_tag"].(string), c["user_agent"].(string), session_id, enc_payload_string )

				res.Header().Set("Content-Type", "text/plain")

				if response.StatusCode == 200 {
					fmt.Fprint( res, successBody(response) )
				} else {
					fmt.Fprint( res, errorBody(response) )
				}
			} else {
				log.Error(log.BOLD_YELLOW + "REQUEST" + log.RESET + " " + ip_string + " tried to send a malformed packet.\ncommand: " + body + "\nsession_id: " + session_id + "\nrelay_id: " + relay_id, true)
			}
		} else if req.URL.Path == "/fetchrate" {
			req.ParseForm()

			var (
				body string
				session_id string
				relay_id string
			)

			form := req.Form
			for param, value := range form {
				if param == "body" {
					body = value[0]
				} else if param == "session_id" {
					session_id = value[0]
				} else if param == "relay_id" {
					relay_id = value[0]
				}
			}

			new_fetch_rate := regexp.MustCompile(`^.* ([1-9][0-9]*) ([1-9][0-9]*)$`).ReplaceAllString(body, "$1-$2")

			if regexp.MustCompile(`^[1-9][0-9]*-[1-9][0-9]*$`).FindString(new_fetch_rate) != "" && session_id != "" && relay_id != "" {
				var c map[string]interface{}
				if e := json.Unmarshal( []byte( session.Get(relay_id, session_id) ), &c ); e != nil {
					log.Error( "could not change fetch rate of interpreter " + log.BOLD + relay_id + "/" + session_id + log.RESET +  "(" + e.Error() + ")", true )
				}

				old_fetch_rate := c["fetch_rate"].(string)

				log.Info(log.BOLD_YELLOW + "REQUEST" + log.RESET + " " + log.BOLD + "POST" + log.RESET + " " + ip_string + " tried to change the fetch rate of " + log.BOLD_YELLOW + relay_id + "/" + session_id + log.RESET + " from " + log.BOLD + old_fetch_rate + log.RESET + " to " + log.BOLD + new_fetch_rate + log.RESET, true)

				encrypt_key_bytes := []byte( c["encryption_key_one"].(string) )
				payload_bytes := []byte(body)

				enc_payload, e := encryption.Encrypt(encrypt_key_bytes, payload_bytes)
				if e != nil {
					log.Error( log.BOLD_YELLOW + "REQUEST" + log.RESET + " " + ip_string + " Could not encrypt payload.\nData: " + body + "\n[" + log.BOLD_RED + "STACK TRACE" + log.RESET + "]\n" + e.Error(), true )
				}
				enc_payload_string := string(enc_payload)

				response := transport.SendHTTPRequest( c["relay_address"].(string), c["sewers_post_tag"].(string), c["user_agent"].(string), session_id, enc_payload_string )

				res.Header().Set("Content-Type", "text/plain")

				if response.StatusCode == 200 {
					c["fetch_rate"] = new_fetch_rate

					new_config, e := json.MarshalIndent(c, "", "\t")
					if e != nil {
						log.Error( "invalid JSON data (" + e.Error() + ")", true )
					}

					session.Set( relay_id, session_id, string(new_config) )

					fmt.Fprint( res, successBody(response) )
				} else {
					fmt.Fprint( res, errorBody(response) )
				}
			} else {
				log.Error(log.BOLD_YELLOW + "REQUEST" + log.RESET + " " + ip_string + " tried to send a malformed packet.\ncommand: " + body + "\nsession_id: " + session_id + "\nrelay_id: " + relay_id, true)
			}
		} else if req.URL.Path == "/quit" {
			log.Info(ip_string + " has shut down sewers.", true)

			os.Exit(1)
		} else {
			log.Info(ip_string + " requested " + req.URL.Path, true)
		}

	} else {

		// Received unauthenticated request.
		log.Warn(ip_string + " requested " + req.URL.Path, true)

		res.WriteHeader(http.StatusNotFound)

	}
}

func Start() {
	log.Info( "Server started on " + log.BOLD + "http://0.0.0.0:" + UI_PORT + log.RESET + " by " + log.BOLD + environment.WHOAMI + log.RESET, true )

	http.Handle( "/stream", websocket.Handler(stream) )
	http.HandleFunc("/", serve)
	log.Fatal( http.ListenAndServe(":" + UI_PORT, nil).Error(), true )
}
