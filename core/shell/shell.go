package shell

import (
  "os/exec"
)

func Output(string command) ([]byte, error) {
  var err error
  var b []byte
  if runtime.GOOS == "android" {
    b, err = exec.Command().Output()
  } else if runtime.GOOS == "windows" {
    b, err = exec.Command().Output()
  } else {
    b, err = exec.Command().Output()
  }
}