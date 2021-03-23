import axios from 'axios'

export default axios.create({
    baseURL: 'http://api-fulltrack4.ftdata.com.br/',
    headers: {
        'Authorization': 'Bearer 68485d259d99e2f769bfdd8616b9c2dcd4275f4c',
        'Content-Type':'application/json'
    }
})