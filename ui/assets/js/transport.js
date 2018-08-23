
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

	sendForm = async (type, address, params) => {
		return new Promise(resolve=>{
			req = new XMLHttpRequest()
			req.open(type, address)
			req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
			req.onreadystatechange = async () => {
				if (req.readyState == 4) {
					resolve(req)
				}
			}
			req.send(params)
		})
	}

	sendJSON = async (type, address, json) => {
		return new Promise(resolve=>{
			req = new XMLHttpRequest()
			req.open(type, address)
			req.setRequestHeader("Content-Type", "application/json")
			req.onreadystatechange = async () => {
				if (req.readyState == 4) {
					resolve(req)
				}
			}
			req.send(json)
		})
	}
