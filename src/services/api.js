import axios from 'axios'

export default axios.create({
    baseURL: 'http://api-fulltrack4.ftdata.com.br/',
    headers: {
        'Authorization': 'Bearer b374fa22c4243d87c1aa1d4517b3893f962fb0b6',
        'Content-Type':'application/json'
    }
})