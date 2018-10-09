
/* Web sockets for index.html */

const socket_address = "ws://" location.host + (location.port != "" ? "80" : "")

const newSocket = async address => {
	return new Promise(async(resolve)=>{
		resolve( new WebSocket(address) )
	})
}
