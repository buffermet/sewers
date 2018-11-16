
/* Sync/async HTTP transport */

	const sendRequest = async (method, address, body) => {
		return new Promise(resolve=>{
			let req = new XMLHttpRequest()
			req.open(method, address)
			req.onreadystatechange = async () => {
				if (req.readyState == 4) {
					setTimeout(hideNetworkIndicator, 200)
					resolve(req)
				}
			}
			showNetworkIndicator()
			req.send(body)
		})
	}

	const sendForm = async (method, address, body) => {
		return new Promise(resolve=>{
			let req = new XMLHttpRequest()
			req.open(method, address)
			req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
			req.onreadystatechange = async () => {
				if (req.readyState == 4) {
					setTimeout(hideNetworkIndicator, 200)
					resolve(req)
				}
			}
			showNetworkIndicator()
			req.send(body)
		})
	}

	const sendJSON = async (method, address, body) => {
		return new Promise(resolve=>{
			let req = new XMLHttpRequest()
			req.open(method, address)
			req.setRequestHeader("Content-Type", "application/json")
			req.onreadystatechange = async () => {
				if (req.readyState == 4) {
					setTimeout(hideNetworkIndicator, 200)
					resolve(req)
				}
			}
			showNetworkIndicator()
			req.send( JSON.stringify(body) )
		})
	}
