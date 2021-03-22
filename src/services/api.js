import axios from 'axios'

export default axios.create({
    baseURL: 'http://api-fulltrack4.ftdata.com.br/',
    headers: {
        'Authorization': 'Bearer c3e45ab044bf931139acbd526bb5de0b20422829',
        'Content-Type':'application/json'
    }
})