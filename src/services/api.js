import axios from 'axios'

export default axios.create({
    baseURL: 'http://api-fulltrack4.ftdata.com.br/',
    headers: {
        'Authorization': 'Bearer 0fd5529b311ca5bbb960cb718625eec4dc257f4a',
        'Content-Type':'application/json'
    }
})