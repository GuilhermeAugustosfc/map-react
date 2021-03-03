import axios from 'axios'

export default axios.create({
    baseURL: 'http://api-fulltrack4.ftdata.com.br/',
    headers: {
        'Authorization': 'Bearer 5933879292e007a86b454cf5992373fc8fce9a2b',
        'Content-Type':'application/x-www-form-urlencoded'
    }
})