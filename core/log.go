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
	"net/http"
	"io/ioutil"
)

const(
	RESET = "\x1b[0m"
	BOLD = "\x1b[1m"
	ON_GREEN = "\x1b[30;42m"
	ON_YELLOW = "\x1b[30;43m"
	RED_ON_YELLOW = "\x1b[91;43m"
	BOLD_GREY = "\x1b[1;30m"
	BOLD_RED = "\x1b[1;31m"
	BOLD_GREEN = "\x1b[1;32m"
	BOLD_BLUE = "\x1b[1;34m"
	BOLD_YELLOW = "\x1b[1;33m"
	BOLD_BLACK_ON_GREY = "\x1b[1;7;30m"
	HTML_STD = "</span>"
	HTML_BOLD = "<span style=\"font-weight:bold\">"
	HTML_ON_GREEN = "<span style=\"background-color:green;color:#000;\">"
	HTML_ON_YELLOW = "<span style=\"background-color:yellow;color:#000;\">"
	HTML_RED_ON_YELLOW = "<span style=\"background-color:yellow;color:#F00;\">"
	HTML_BOLD_GREY = "<span style=\"font-weight:bold;color:#444\">"
	HTML_BOLD_RED = "<span style=\"font-weight:bold;color:#F00\">"
	HTML_BOLD_GREEN = "<span style=\"font-weight:bold;color:#81d330\">"
	HTML_BOLD_BLUE = "<span style=\"font-weight:bold;color:rgb(0,142,255)\">"
	HTML_BOLD_YELLOW = "<span style=\"font-weight:bold;color:orange\">"
	HTML_BOLD_BLACK_ON_GREY = "<span style=\"font-weight:normal;color:#000;background-color:#444\">"
)

func Timestamp() string {
	return string( time.Now().Format("02-01-2006 15:04:05") )
}

func Info(message string, log_to_console bool) {
	timestamp := " " + BOLD_GREY + Timestamp() + RESET + " "

	fmt.Println(timestamp + ON_GREEN + "INF" + RESET + " " + message)

	if log_to_console {
		logToConsole(timestamp + ON_GREEN + "INF" + RESET + " " + message)
	}
}

func Warn(message string, log_to_console bool) {
	timestamp := " " + BOLD_GREY + Timestamp() + RESET + " "

	fmt.Println(timestamp + RED_ON_YELLOW + "WAR" + RESET + " " + message)

	if log_to_console {
		logToConsole(timestamp + RED_ON_YELLOW + "WAR" + RESET + " " + message)
	}
}

func Error(message string, log_to_console bool) {
	timestamp := " " + BOLD_GREY + Timestamp() + RESET + " "

	fmt.Println(timestamp + RED_ON_YELLOW + "WAR" + RESET + " " + message)

	if log_to_console {
		logToConsole(timestamp + RED_ON_YELLOW + "WAR" + RESET + " " + message)
	}
}

func Time(message string, log_to_console bool) {
	timestamp := " " + BOLD_GREY + Timestamp() + RESET + " "

	fmt.Println(timestamp + message)

	if log_to_console {
		logToConsole(timestamp + message)
	}
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
	html_string = strings.Replace(html_string, BOLD_GREY,          HTML_BOLD_GREY, -1)
	html_string = strings.Replace(html_string, BOLD_RED,           HTML_BOLD_RED, -1)
	html_string = strings.Replace(html_string, BOLD_GREEN,         HTML_BOLD_GREEN, -1)
	html_string = strings.Replace(html_string, BOLD_BLUE,          HTML_BOLD_BLUE, -1)
	html_string = strings.Replace(html_string, BOLD_YELLOW,        HTML_BOLD_YELLOW, -1)
	html_string = strings.Replace(html_string, BOLD_BLACK_ON_GREY, HTML_BOLD_BLACK_ON_GREY, -1)

	logfile, e := os.OpenFile(PATH_UI + "/console_log.html", os.O_APPEND|os.O_WRONLY, 0600)
	if e != nil {
		fmt.Println( e.Error() )
	}

	defer logfile.Close()

	if _, e = logfile.WriteString(html_string); e != nil {
		fmt.Println( e.Error() )
	}
}

func ClearConsole(ip string) {
	e := ioutil.WriteFile(PATH_UI + "/console_log.html", []byte(""), 0600)
	if e != nil {
		fmt.Println( e.Error() )
	}

	LogToConsole(ip + " cleared the console log.")
}
