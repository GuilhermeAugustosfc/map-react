
const SOCKET = {
    socket: null,
    init: function (call) {
        this.socket = new WebSocket('wss://websocket-ssl.ftrack.me:6826');

        this.socket.onopen = (con) => {
            this.socket.send(JSON.stringify({ id_indice: 5554 }))
        }
        this.socket.onmessage = ({ data }) => {
            try {
                data = JSON.parse(data);
                call(data)                
            } catch (error) {
                return
            }
        }
    }
}

export default SOCKET;