
const SOCKET = {
    socket: null,
    init: function (call) {
        this.socket = new WebSocket(process.env.REACT_APP_URL_SOCKET);

        this.socket.onopen = (con) => {
            console.log('socket connected');
            this.socket.send(JSON.stringify({ id_indice: 4911 })) // 5554 ppa fazenda // 4911 
        }
        this.socket.onmessage = ({ data }) => {
            data = JSON.parse(data);
            call(data)
        }
    }
}

export default SOCKET;