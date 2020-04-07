package main

import(
	"github.com/buffermet/sewers/core/environment"
  "github.com/buffermet/sewers/core/ui"
)

func main() {
  environment.Init()
	ui.Start()
}
