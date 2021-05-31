import axios from 'axios'
import LocalStorage from './storage'
const REQUEST = {
    axios: null,
    configAxios: async function (url) {
        let token = LocalStorage.getStorage().token; // TOKEN AGRO INDICE 5554 PPA
        if (url.includes('fulltrack4')) {

            if (localStorage.getItem('token-fulltrack4')) {
                token = JSON.parse(localStorage.getItem('token-fulltrack4')).access_token;
            } else {
                token = await this.getTokenFulltrackApi();
            }
        }

        this.axios = axios.create({
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
    },
    post: async function (url, dados, callback) {
        await this.configAxios(url);
        this.axios.post(url, dados).then((response) => {
            if (response.status === 401) {
                localStorage.removeItem('token-fulltrack4');
                this.post(url, dados, callback);
            } else {
                callback(response);
            }
        }).catch((error) => {
            if (typeof error.request == 'object') {   
                if (error.request.status === 401) {
                    localStorage.removeItem('token-fulltrack4');
                    this.post(url, dados, callback);
                } else if(error.request.status === 500){
                    var a = JSON.parse(error.request.response);
                    console.log(a);
                    callback(JSON.parse(error.request.response))
                }
            }
        })
    },
    get: function (url, dados, callback) {
        this.configAxios(url);
        this.axios.get(url, dados).then((response) => {
            if (response.status === 401) {
                this.get(url, dados, callback);
            } else {
                callback(response.data);
            }
        })
    },
    put: function (url, dados, callback) {
        this.configAxios(url);
        this.axios.put(url, dados).then((response) => {
            if (response.status === 401) {
                this.put(url, dados, callback);
            } else {
                callback(response.data);
            }
        })
    },
    delete: function (url, dados, callback) {
        this.configAxios(url);
        this.axios.delete(url, dados).then((response) => {
            if (response.status === 401) {
                this.delete(url, dados, callback);
            } else {
                callback(response.data);
            }
        })
    },
    getTokenFulltrackApi: async function () {

        let response = await axios.post('http://api-fulltrack4.ftdata.com.br/token', {
            grant_type: process.env.REACT_APP_GRANT_TYPE,
            client_id: process.env.REACT_APP_CLIENT_ID,
            client_secret: process.env.REACT_APP_CLIENT_SECRET,
            user_id: process.env.REACT_APP_USER_ID
        })

        localStorage.setItem('token-fulltrack4', JSON.stringify(response.data))

        return response.data.access_token;
    }
}

export default REQUEST;
