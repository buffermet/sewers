package log

/*

  Handles StdOut and HTML console output.

*/

import (
  "fmt"
  "io/ioutil"
  "os"
  "strings"
  "time"

  "github.com/buffermet/sewers/core/environment"
)

const (
	BLACK_ON_YELLOW    = "\x1b[30;43m"
	BOLD               = "\x1b[1m"
	BOLD_BLACK_ON_GREY = "\x1b[1;7;30m"
	BOLD_BLUE          = "\x1b[1;34m"
	BOLD_GREEN         = "\x1b[1;32m"
	BOLD_GREY          = "\x1b[1;30m"
	BOLD_RED           = "\x1b[1;31m"
	BOLD_YELLOW        = "\x1b[1;33m"
	ON_GREEN           = "\x1b[30;42m"
	ON_YELLOW          = "\x1b[30;43m"
	RESET              = "\x1b[0m"
	WHITE_ON_RED       = "\x1b[1;41m"
	HTML_BLACK_ON_YELLOW    = "<span style=\"background-color:yellow;color:#000\">"
	HTML_BOLD               = "<span style=\"font-weight:bold\">"
	HTML_BOLD_BLACK_ON_GREY = "<span style=\"background-color:#444;color:#000\">"
	HTML_BOLD_BLUE          = "<span style=\"font-weight:bold;color:#008eff\">"
	HTML_BOLD_GREEN         = "<span style=\"font-weight:bold;color:#81d330\">"
	HTML_BOLD_GREY          = "<span style=\"font-weight:bold;color:#444\">"
	HTML_BOLD_RED           = "<span style=\"font-weight:bold;color:red\">"
	HTML_BOLD_YELLOW        = "<span style=\"font-weight:bold;color:yellow\">"
	HTML_ON_GREEN           = "<span style=\"background-color:green;color:#000\">"
	HTML_ON_YELLOW          = "<span style=\"background-color:yellow;color:#000\">"
	HTML_RESET              = "</span>"
	HTML_WHITE_ON_RED       = "<span style=\"font-weight:bold;background-color:red;color:#FFF\">"
)

func Timestamp() string {
	return string(time.Now().Format("02-01-2006 15:04:05"))
}

func Info(message string) {
	timestamp := BOLD_GREY + Timestamp() + RESET + " "
	fmt.Println(timestamp + message)
	logToConsole(timestamp + message)
}

func Warn(message string) {
	timestamp := BOLD_GREY + Timestamp() + RESET + " "
	fmt.Println(timestamp + BLACK_ON_YELLOW + "WARNING" + RESET + " " + message)
	logToConsole(timestamp + BLACK_ON_YELLOW + "WARNING" + RESET + " " + message)
}

func Error(message string) {
	timestamp := BOLD_GREY + Timestamp() + RESET + " "
	fmt.Println(timestamp + BOLD_RED + "ERROR" + RESET + " " + message)
	logToConsole(timestamp + BOLD_RED + "ERROR" + RESET + " " + message)
}

func Fatal(message string) {
	fmt.Println(WHITE_ON_RED + "!!!" + RESET + " " + message)
	logToConsole(WHITE_ON_RED + "!!!" + RESET + " " + message)
	os.Exit(1)
}

func Raw(message string) {
	fmt.Println(message)
	logToConsole(message)
}

func logToConsole(message string) {
	html_string := strings.Replace(message, " ", "&nbsp;", -1)
	html_string = strings.Replace(html_string, RESET, HTML_RESET, -1)
	html_string = strings.Replace(html_string, BOLD, HTML_BOLD, -1)
	html_string = strings.Replace(html_string, ON_GREEN, HTML_ON_GREEN, -1)
	html_string = strings.Replace(html_string, ON_YELLOW, HTML_ON_YELLOW, -1)
	html_string = strings.Replace(html_string, WHITE_ON_RED, HTML_WHITE_ON_RED, -1)
	html_string = strings.Replace(html_string, BLACK_ON_YELLOW, HTML_BLACK_ON_YELLOW, -1)
	html_string = strings.Replace(html_string, BOLD_GREY, HTML_BOLD_GREY, -1)
	html_string = strings.Replace(html_string, BOLD_RED, HTML_BOLD_RED, -1)
	html_string = strings.Replace(html_string, BOLD_GREEN, HTML_BOLD_GREEN, -1)
	html_string = strings.Replace(html_string, BOLD_BLUE, HTML_BOLD_BLUE, -1)
	html_string = strings.Replace(html_string, BOLD_YELLOW, HTML_BOLD_YELLOW, -1)
	html_string = strings.Replace(html_string, BOLD_BLACK_ON_GREY, HTML_BOLD_BLACK_ON_GREY, -1)
	html_string += "\n"

	logfile, err := os.OpenFile(
		environment.PATH_UI + "/console_log.html",
		os.O_APPEND | os.O_WRONLY,
		0600)
	if err != nil {
		fmt.Println(err.Error())
	}

	defer logfile.Close()

	if _, err = logfile.WriteString(html_string); err != nil {
		fmt.Println(err.Error())
	}
}

func ClearConsole(ip string) {
	err := ioutil.WriteFile(
		environment.PATH_UI + "/console_log.html",
		[]byte(""),
		0600)
	if err != nil {
		fmt.Println(err.Error())
	}
	Info(ip + " cleared the console log")
}
