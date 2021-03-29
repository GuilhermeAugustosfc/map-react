
const SOCKET = {
    socket: null,
    init: function (call) {
        this.socket = new WebSocket('wss://websocket-ssl.ftrack.me:6826');

        this.socket.onopen = (con) => {
            console.log('socket connected');
            this.socket.send(JSON.stringify({ id_indice: 5554 })) // 5554 ppa fazenda // 4911 
        }
        this.socket.onmessage = ({ data }) => {
                data = JSON.parse(data);
                call(data)                
        }
    }
}

export default SOCKET;