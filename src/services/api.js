import axios from 'axios'

export default axios.create({
    baseURL: 'http://api-fulltrack4.ftdata.com.br/',
    headers: {
        'Authorization': 'Bearer 0dab6adc4e736375c9d4d455cfb28472dfc625d4',
        'Content-Type':'application/x-www-form-urlencoded'
    }
})