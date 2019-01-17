
/* 
*	
*	Sewers UI HTTP package
*	
*/

	app.http.Request = async (method, url, headers, body) => {
		return new Promise(async(resolve, reject)=>{
			let req = new XMLHttpRequest();

			try {
				req.open(method, url);

				try {
					for (let i = 0; i < headers.length; i++) {
						const header_name = headers[i][0],
						      header_value = headers[i][1];

						req.setRequestHeader(header_name, header_value);
					}
				} catch(err) {
					console.error(err);
				}

				req.onreadystatechange = async () => {
					if (req.readyState == 4) {
						resolve(req);
					}
				}
			} catch(err) {
				reject(err);
			}

			req.send(body);
		});
	}
