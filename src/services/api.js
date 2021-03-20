import axios from 'axios'

export default axios.create({
    baseURL: 'http://api-fulltrack4.ftdata.com.br/',
    headers: {
        'Authorization': 'Bearer 7a5990c21107b4b2aa1b87f625d6e0487110d372',
        'Content-Type':'application/json'
    }
})