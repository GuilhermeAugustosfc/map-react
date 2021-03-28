import axios from 'axios'

export default axios.create({
    baseURL: 'http://api-fulltrack4.ftdata.com.br/',
    headers: {
        'Authorization': 'Bearer 159d02e68abb4292d7ea7a4197ea1339405670c8',
        'Content-Type':'application/json'
    }
})