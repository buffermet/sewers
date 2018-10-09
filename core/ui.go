package core

/*
*	
*	UI server.
*	
*/

import(
	"log"
	"fmt"
	"strings"
	"strconv"
	"net/http"
	"io/ioutil"
	"os"
)

var(
	UI_PORT = "8042"
)

func serve(res http.ResponseWriter, req *http.Request) {
	// Authenticate
	var allow_connections bool
	var ip_string string

	if strings.HasPrefix(req.RemoteAddr, "127.0.0.1:") {
		allow_connections = true
		ip_string = BOLD_GREEN + req.RemoteAddr + STD
	} else {
		allow_connections = false
		ip_string = BOLD_RED + req.RemoteAddr + STD
	}

	// Serve
	if allow_connections {

		if strings.Contains(req.URL.Path, "..") {
			LogToConsole(ip_string + " tried to access a level up /..")
		}
		if req.URL.Path == "/" {
			LogToConsole(ip_string + " requested " + req.URL.Path)

			http.ServeFile(res, req, PATH_UI + "/index.html")
		} else if strings.HasPrefix(req.URL.Path, "/terminal") {
			LogToConsole(ip_string + " requested " + req.URL.Path)

			// session_id := strings.Replace(req.URL.Path, "/terminal/", "", 1)
			// session_id = strings.Split(session_id, "/")[0]

			http.ServeFile(res, req, PATH_UI + "/terminal.html")
		} else if strings.HasSuffix(req.URL.Path, ".html") || 
		          strings.HasSuffix(req.URL.Path, ".css") || 
		          strings.HasSuffix(req.URL.Path, ".js") || 
		          strings.HasSuffix(req.URL.Path, ".svg") || 
		          strings.HasSuffix(req.URL.Path, ".png") || 
		          strings.HasSuffix(req.URL.Path, ".jpg") || 
		          strings.HasSuffix(req.URL.Path, ".ttf") || 
		          strings.HasSuffix(req.URL.Path, ".mp3") {
			res.Header().Set("Cache-Control", "no-cache, no-store, must-revalidate")
			res.Header().Set("Pragma", "no-cache")
			res.Header().Set("Expires", "0")

			http.ServeFile(res, req, PATH_UI + "" + req.URL.Path)
		} else if req.URL.Path == "/get_relays" {
			relays := GetRelays()

			fmt.Fprintf(res, relays)
		} else if strings.HasPrefix(req.URL.Path, "/relay/") {
			LogToConsole(ip_string + " requested " + req.URL.Path)

			relay := strings.Replace(req.URL.Path, "/relay/", "", 1)
			body := GetRelaySessions(relay)

			fmt.Fprintf(res, body)
		} else if strings.HasPrefix(req.URL.Path, "/session/") {
			LogToConsole(ip_string + " requested " + req.URL.Path)

			parts := strings.Replace(req.URL.Path, "/session/", "", 1)
			relay := strings.Split(parts, "/")[0]
			session := strings.Split(parts, "/")[1]

			body := GetSession(relay, session)

			fmt.Fprintf(res, body)
		} else if req.URL.Path == "/console_log" {
			res.Header().Set("Content-Type", "text/plain")
			res.Header().Set("Cache-Control", "no-cache, no-store, must-revalidate")
			res.Header().Set("Pragma", "no-cache")
			res.Header().Set("Expires", "0")

			http.ServeFile(res, req, PATH_UI + "/console_log.html")
		} else if req.URL.Path == "/clear_console_log" {
			ClearConsole(res, req, ip_string)

			fmt.Fprintf(res, "OK")
		} else if strings.HasPrefix(req.URL.Path, "/config") {
			path := strings.Replace(req.URL.Path, "/", "", 1)
			split_path := strings.Split(path, "/")

			json_path := ""

			if len(split_path) > 2 {
				// Configure session
				json_path = PATH_RELAYS + "/" + split_path[1] + "/sessions/" + split_path[2] + ".json"
			} else if len(split_path) == 2 {
				if split_path[1] != "sewers" {
					// Configure relay
					json_path = PATH_RELAYS + "/" + split_path[1] + "/" + split_path[1] + ".json"
				} else {
					// Configure sewers
					json_path = "./config.json"
				}
			}

			req.ParseForm()

			if len(req.Form) > 0 {
				Configure(json_path, req.Form)
			} else {
				body, e := ioutil.ReadFile(json_path)
				if e != nil {
					LogToConsole( BOLD_RED + "ERROR" + STD + " Unable to retrieve " + BOLD + json_path + STD + "\n[" + BOLD_RED + "STACK TRACE" + STD + "]\n" + e.Error() )
				}

				fmt.Fprintf( res, string(body) )
			}
		} else if req.URL.Path == "/host" {
			fmt.Fprintf( res, WhoAmI() )
		} else if req.URL.Path == "/useragent" {
			fmt.Fprintf(res, USER_AGENT)
		} else if strings.HasPrefix(req.URL.Path, "/get") {
			req.ParseForm()

			var(
				packet_id string
				session_id string
				relay_address string
				encryption_key_one string
				// encryption_key_two string
				request_tag string
			)

			f := req.Form
			for param, value := range f {
				if param == "packet_id" {
					packet_id = value[0]
				} else if param == "session_id" {
					session_id = value[0]
				} else if param == "relay_address" {
					relay_address = value[0]
				} else if param == "encryption_key_one" {
					encryption_key_one = value[0]
				// } else if param == "encryption_key_two" {
				// 	encryption_key_two = value[0]
				} else if param == "request_tag" {
					request_tag = value[0]
				}
			}

			response := ""

			if session_id != "" && relay_address != "" && encryption_key_one != "" && request_tag != "" {
				if packet_id == "" {
					LogToConsole(BOLD_YELLOW + "REQUEST" + STD + " " + BOLD + "GET" + STD + " " + ip_string + " tried to fetch packet list from " + BOLD_YELLOW + session_id + STD +" at " + BOLD + relay_address + STD)

					response = SendHTTPRequest(relay_address, request_tag, session_id, "nil")

					fmt.Fprintf(res, response)
					return
				} else {
					LogToConsole(BOLD_YELLOW + "REQUEST" + STD + " " + ip_string + " tried to fetch packet " + BOLD_YELLOW + packet_id + STD + " from " + BOLD_YELLOW + session_id + STD + " at " + BOLD + relay_address + STD)

					enc_response := SendHTTPRequest(relay_address, request_tag, session_id, packet_id)
					enc_response_bytes := []byte(enc_response)
					key := []byte(encryption_key_one)

					dec_response, e := Decrypt(key, enc_response_bytes)
					if e != nil {
						LogToConsole( BOLD_BLUE + "RESPONSE" + STD + " " + BOLD_RED + "ERROR" + STD + " " + ip_string + " was unable to decrypt response from interpreter.\npacket_id : " + packet_id + "\nsession_id : " + session_id + "\nrelay_address : " + relay_address + "\nrequest_tag : " + request_tag + "\nlength : " + strconv.Itoa( len(enc_response) ) + "\n[" + BOLD_RED + "STACK TRACE" + STD + "]\n" + e.Error() )
						fmt.Fprintf(res, "")
						return
					}

					LogToConsole(BOLD_BLUE + "RESPONSE" + STD + " fetched by " + ip_string + "\nsession_id : " + session_id + "\nrelay_address : " + relay_address + "\npacket_id : " + packet_id + "\nencrypted response length : " + strconv.Itoa( len(enc_response) ) + "\ndecrypted response length : " + strconv.Itoa( len(dec_response) ) )

					// DEBUG
					// fmt.Println( enc_response + "\n---------------\n" + string(dec_response) )

					fmt.Fprintf( res, string(dec_response) )
					return
				}
			}

			// Error if not returned.
			LogToConsole(BOLD_YELLOW + "REQUEST" + STD + " " + BOLD_RED + "ERROR" + STD + " " + ip_string + " tried to send a malformed packet.\npacket_id : " + packet_id + "\nsession_id : " + session_id + "\nrelay_address : " + relay_address + "\nrequest_tag : " + request_tag)
		} else if strings.HasPrefix(req.URL.Path, "/post") {
			req.ParseForm()

			var(
				body string
				session_id string
				relay_address string
				encryption_key_one string
				// encryption_key_two string
				request_tag string
			)

			f := req.Form
			for param, value := range f {
				if param == "body" {
					body = value[0]
				} else if param == "session_id" {
					session_id = value[0]
				} else if param == "relay_address" {
					relay_address = value[0]
				} else if param == "encryption_key_one" {
					encryption_key_one = value[0]
				// } else if param == "encryption_key_two" {
				// 	encryption_key_two = value[0]
				} else if param == "request_tag" {
					request_tag = value[0]
				}
			}

			if body != "" && session_id != "" && relay_address != "" && encryption_key_one != "" && request_tag != "" {
				LogToConsole(BOLD_YELLOW + "REQUEST" + STD + " " + BOLD + "POST" + STD + " " + ip_string + " sent a packet to " + BOLD_YELLOW + session_id + STD + "\ncommand : " + body + "\nrelay_address : " + relay_address + "\nrequest_tag : " + request_tag)

				encrypt_key_bytes := []byte(encryption_key_one)
				payload_bytes := []byte(body)

				enc_payload, e := Encrypt(encrypt_key_bytes, payload_bytes)
				if e != nil {
					LogToConsole( BOLD_YELLOW + "REQUEST" + STD + " " + BOLD_RED + "ERROR" + STD + " " + ip_string + " Could not encrypt payload.\nData: " + body + "\n[" + BOLD_RED + "STACK TRACE" + STD + "]\n" + e.Error() )
				}
				enc_payload_string := string(enc_payload)

				SendHTTPRequest(relay_address, request_tag, session_id, enc_payload_string)

				fmt.Fprintf(res, "OK")
				return
			}

			// Error if not returned.
			LogToConsole(BOLD_YELLOW + "REQUEST" + STD + " " + BOLD_RED + "ERROR" + STD + " " + ip_string + " tried to send a malformed packet.\ncommand: " + body + "\nsession_id: " + session_id + "\nrelay_address: " + relay_address + "\nrequest_tag: " + request_tag)
		} else if req.URL.Path == "/quit" {
			LogToConsole(ip_string + " has shut down sewers.")

			os.Exit(1)
		} else {
			LogToConsole(ip_string + " requested " + req.URL.Path)
		}

	} else {

		// Received unauthenticated request.
		LogToConsole(ip_string + " requested " + req.URL.Path)

		res.WriteHeader(http.StatusNotFound)

	}
}

func Start() {
	LogToConsole( "Server started on " + BOLD + "http://0.0.0.0:" + UI_PORT + STD + " by " + BOLD + WhoAmI() + STD )

	http.HandleFunc("/", serve)
	log.Fatal( http.ListenAndServe(":" + UI_PORT, nil) )
}
