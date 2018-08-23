
/* Sync/async HTTP transport */

	sendRequest = async (type, address, body) => {
		return new Promise(resolve=>{
			req = new XMLHttpRequest()
			req.open(type, address)
			req.onreadystatechange = async () => {
				if (req.readyState == 4) {
					resolve(req)
				}
			}
			req.send(body)
		})
	}
