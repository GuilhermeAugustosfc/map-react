import axios from 'axios'

export default axios.create({
    baseURL: 'http://api-fulltrack4.ftdata.com.br/',
    headers: {
        'Authorization': 'Bearer 7fe50562c336ef6e6d4620cd325d0319b9ffa500',
        'Content-Type':'application/json'
    }
})