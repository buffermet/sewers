package main

import(
	"github.com/buffermet/sewers/core/ui"
	"github.com/buffermet/sewers/core/environment"
)

func main() {
	environment.Configure()
	ui.Start()
}
