package core

/*
*
*	Handles StdOut and HTML console output.
*
*/

import(
	"os"
	"fmt"
	"time"
	"strings"
	"io/ioutil"

	environment "github.com/yungtravla/sewers/core/environment"
)

const(
	RESET = "\x1b[0m"
	BOLD = "\x1b[1m"
	ON_GREEN = "\x1b[30;42m"
	ON_YELLOW = "\x1b[30;43m"
	WHITE_ON_RED = "\x1b[1;41m"
	BOLD_GREY = "\x1b[1;30m"
	BOLD_RED = "\x1b[1;31m"
	BOLD_GREEN = "\x1b[1;32m"
	BOLD_BLUE = "\x1b[1;34m"
	BOLD_YELLOW = "\x1b[1;33m"
	BOLD_BLACK_ON_GREY = "\x1b[1;7;30m"
	HTML_STD = "</span>"
	HTML_BOLD = "<span style=\"font-weight:bold\">"
	HTML_ON_GREEN = "<span style=\"background-color:green;color:#000;text-shadow:none;\">"
	HTML_ON_YELLOW = "<span style=\"background-color:yellow;color:#000;text-shadow:none;\">"
	HTML_WHITE_ON_RED = "<span style=\"font-weight:bold;background-color:red;color:#FFF;text-shadow:none;\">"
	HTML_BOLD_GREY = "<span style=\"font-weight:bold;color:#444;\">"
	HTML_BOLD_RED = "<span style=\"font-weight:bold;color:#F00;\">"
	HTML_BOLD_GREEN = "<span style=\"font-weight:bold;color:#81D330;\">"
	HTML_BOLD_BLUE = "<span style=\"font-weight:bold;color:rgb(0,142,255);\">"
	HTML_BOLD_YELLOW = "<span style=\"font-weight:bold;color:orange;\">"
	HTML_BOLD_BLACK_ON_GREY = "<span style=\"background-color:#444;color:#000;text-shadow:none;\">"
)

func Timestamp() string {
	return string( time.Now().Format("02-01-2006 15:04:05") )
}

func Info(message string, log_to_console bool) {
	timestamp := " " + BOLD_GREY + Timestamp() + RESET + " "

	fmt.Println(timestamp + message)

	if log_to_console {
		logToConsole(timestamp + message)
	}
}

func Warn(message string, log_to_console bool) {
	timestamp := " " + BOLD_GREY + Timestamp() + RESET + " "

	fmt.Println(timestamp + ON_YELLOW + "WARNING" + RESET + " " + message)

	if log_to_console {
		logToConsole(timestamp + ON_YELLOW + "WARNING" + RESET + " " + message)
	}
}

func Error(message string, log_to_console bool) {
	timestamp := " " + BOLD_GREY + Timestamp() + RESET + " "

	fmt.Println(timestamp + WHITE_ON_RED + "ERROR" + RESET + " " + message)

	if log_to_console {
		logToConsole(timestamp + WHITE_ON_RED + "ERROR" + RESET + " " + message)
	}
}

func Fatal(message string, log_to_console bool) {
	fmt.Println(WHITE_ON_RED + "!!!" + RESET + " " + message)

	if log_to_console {
		logToConsole(WHITE_ON_RED + "!!!" + RESET + " " + message)
	}

	os.Exit(1)
}

func Raw(message string, log_to_console bool) {
	fmt.Println(message)

	if log_to_console {
		logToConsole(message)
	}
}

func logToConsole(message string) {
	html_string := strings.Replace(message, " ", "&nbsp;", -1)
	html_string = strings.Replace(html_string, RESET,              HTML_STD, -1)
	html_string = strings.Replace(html_string, BOLD,               HTML_BOLD, -1)
	html_string = strings.Replace(html_string, ON_GREEN,           HTML_ON_GREEN, -1)
	html_string = strings.Replace(html_string, ON_YELLOW,          HTML_ON_YELLOW, -1)
	html_string = strings.Replace(html_string, WHITE_ON_RED,       HTML_WHITE_ON_RED, -1)
	html_string = strings.Replace(html_string, BOLD_GREY,          HTML_BOLD_GREY, -1)
	html_string = strings.Replace(html_string, BOLD_RED,           HTML_BOLD_RED, -1)
	html_string = strings.Replace(html_string, BOLD_GREEN,         HTML_BOLD_GREEN, -1)
	html_string = strings.Replace(html_string, BOLD_BLUE,          HTML_BOLD_BLUE, -1)
	html_string = strings.Replace(html_string, BOLD_YELLOW,        HTML_BOLD_YELLOW, -1)
	html_string = strings.Replace(html_string, BOLD_BLACK_ON_GREY, HTML_BOLD_BLACK_ON_GREY, -1)
	html_string += "\n"

	logfile, e := os.OpenFile(environment.PATH_UI + "/console_log.html", os.O_APPEND|os.O_WRONLY, 0600)
	if e != nil {
		fmt.Println( e.Error() )
	}

	defer logfile.Close()

	if _, e = logfile.WriteString(html_string); e != nil {
		fmt.Println( e.Error() )
	}
}

func ClearConsole(ip string) {
	e := ioutil.WriteFile(environment.PATH_UI + "/console_log.html", []byte(""), 0600)
	if e != nil {
		fmt.Println( e.Error() )
	}

	Info(ip + " cleared the console log.", true)
}
