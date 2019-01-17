
/*
*
*	Sewers UI mediaplayer package
*
*/

	// Parse URL
	const queryLine = window.location.href.replace(/.*\?/g, "");
	const queries = queryLine.split("&");
	const streamType = queries[0],
	      streamID = queries[1],
	      streamFile = queries[2];

	// Define elements
	const container = document.querySelector("html body div.container");

	// Set title
	document.title = streamType.toUpperCase() + " " + streamID;

	// Load media
	if (streamType == "mic") {
		container.append("<audio preload autoplay controls><source src='" + location.protocol + "//" + location.host + "/assets/audio/"+ streamFile + "' type='audio/wav'/>Your browser does not support HTML5 media playback!</audio>");
	} else if (streamType == "mon") {
		container.append("<video preload autoplay controls><source src='" + location.protocol + "//" + location.host + "/assets/video-mon/" + streamFile + "'/>Your browser does not support HTML5 media playback!</video>");
	} else if (streamType == "cam") {
		container.append("<video preload autoplay controls><source src='" + location.protocol + "//" + location.host + "/assets/video-cam/" + streamFile + "'/>Your browser does not support HTML5 media playback!</video>");
	} else {
		container.append("<h1>No stream type specified</h1>");
	}
