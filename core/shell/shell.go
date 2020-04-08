package shell

import (
  "os/exec"
  "runtime"
)

func Output(command string) ([]byte, error) {
  var err error
  var b []byte
  if runtime.GOOS == "android" {
    b, err = exec.Command("/system/bin/sh", "-c", command).Output()
  } else if runtime.GOOS == "windows" {
    b, err = exec.Command("cmd", "/C", command).Output()
  } else {
    b, err = exec.Command("/usr/bin/env", "sh", "-c", command).Output()
  }
  return b, err
}