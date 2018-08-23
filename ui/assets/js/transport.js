
/* Sync/async HTTP transport */

	const sendRequest = async (type, address, body) => {
		return new Promise(resolve=>{
			let req = new XMLHttpRequest()
			req.open(type, address)
			req.onreadystatechange = async () => {
				if (req.readyState == 4) {
					resolve(req)
				}
			}
			req.send(body)
		})
	}

	const sendForm = async (type, address, params) => {
		return new Promise(resolve=>{
			let req = new XMLHttpRequest()
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

	const sendJSON = async (type, address, json) => {
		return new Promise(resolve=>{
			let req = new XMLHttpRequest()
			req.open(type, address)
			req.setRequestHeader("Content-Type", "application/json")
			req.onreadystatechange = async () => {
				if (req.readyState == 4) {
					resolve(req)
				}
			}
			req.send( JSON.stringify(json) )
		})
	}
