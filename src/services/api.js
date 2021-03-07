import axios from 'axios'

export default axios.create({
    baseURL: 'http://api-fulltrack4.ftdata.com.br/',
    headers: {
        'Authorization': 'Bearer 782be88bb03708960419ec9ea5bca481c0d4125d',
        'Content-Type':'application/x-www-form-urlencoded'
    }
})