package core

/*
*
*	Handles StdOut and HTML console output.
*
*/

import(
	"fmt"
	"strings"
	"os"
	"time"
	"io/ioutil"
	"net/http"
)

const(
	STD = "\x1b[0m"
	BOLD = "\x1b[1m"
	BOLD_GREY = "\x1b[1;30m"
	BOLD_RED = "\x1b[1;31m"
	BOLD_GREEN = "\x1b[1;32m"
	BOLD_BLUE = "\x1b[1;34m"
	BOLD_YELLOW = "\x1b[1;33m"
	BOLD_BLACK_ON_GREY = "\x1b[1;7;30m"
	HTML_STD = "</span>"
	HTML_BOLD = "<span style=\"font-weight:bold\">"
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

func Log(message string) {
	timestamp := BOLD_GREY + " " + Timestamp() + " " + STD

	fmt.Println(timestamp + message)
}

func LogToConsole(message string) {
	timestamp := BOLD_GREY + " " + Timestamp() + " " + STD

	message = timestamp + message

	fmt.Println(message)

	html_string := strings.Replace(message, " ", "&nbsp;", -1)
	html_string = strings.Replace(html_string, STD,                HTML_STD, -1)
	html_string = strings.Replace(html_string, BOLD,               HTML_BOLD, -1)
	html_string = strings.Replace(html_string, BOLD_GREY,          HTML_BOLD_GREY, -1)
	html_string = strings.Replace(html_string, BOLD_RED,           HTML_BOLD_RED, -1)
	html_string = strings.Replace(html_string, BOLD_GREEN,         HTML_BOLD_GREEN, -1)
	html_string = strings.Replace(html_string, BOLD_BLUE,          HTML_BOLD_BLUE, -1)
	html_string = strings.Replace(html_string, BOLD_YELLOW,        HTML_BOLD_YELLOW, -1)
	html_string = strings.Replace(html_string, BOLD_BLACK_ON_GREY, HTML_BOLD_BLACK_ON_GREY, -1)
	html_string += "\n"

	writefile, e := os.OpenFile(PATH_UI + "/console_log.html", os.O_APPEND|os.O_WRONLY, 0600)
	if e != nil {
		fmt.Println( e.Error() )
	}

	defer writefile.Close()

	if _, e = writefile.WriteString(html_string); e != nil {
		fmt.Println( e.Error() )
	}
}

func ClearConsole(w http.ResponseWriter, r *http.Request, ip string) {
	e := ioutil.WriteFile(PATH_UI + "/console_log.html", []byte(""), 0600)
	if e != nil {
		fmt.Println( e.Error() )
	}

	LogToConsole(ip + " cleared the console log.")
}
