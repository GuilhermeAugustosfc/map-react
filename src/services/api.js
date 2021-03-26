import axios from 'axios'

export default axios.create({
    baseURL: 'http://api-fulltrack4.ftdata.com.br/',
    headers: {
        'Authorization': 'Bearer c9eaa1bc77cbd07d372808d24646d6d53d1e1b0d',
        'Content-Type':'application/json'
    }
})