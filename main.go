package main

/*
*	
*	Launcher.
*	
*/

import(
	"github.com/yungtravla/sewers/core/ui"
	"github.com/yungtravla/sewers/core/environment"
)

func main() {
	environment.Configure()
	ui.Start()
}
