package main

import (
  "ioutil"
  "net/http"
  "runtime"
  "time"
)

const (
  obf_const_Port               = "8008"
  obf_const_InterpreterGetTag  = "obf_tag_interpreter_get_tag"
  obf_const_InterpreterPostTag = "obf_tag_interpreter_post_tag"
  obf_const_SewersGetTag       = "obf_tag_sewers_get_tag"
  obf_const_SewersPostTag      = "obf_tag_sewers_get_tag"
)

func main() {
  obf_var_server := &http.Server {
    Addr:              ":" + obf_const_Port,
    ReadTimeout:       5 * time.Second,
    ReadHeaderTimeout: 5 * time.Second,
    WriteTimeout:      5 * time.Second,
  }
  obf_var_server.ListenAndServe()
}
