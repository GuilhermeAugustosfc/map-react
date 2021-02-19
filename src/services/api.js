import axios from 'axios'

export default axios.create({
    baseURL: 'http://api-fulltrack4.ftdata.com.br/',
    headers: {
        'Authorization': 'Bearer a056e3807f2bcc1e00b725b9652425afcc82a94a',
        'Content-Type':'application/x-www-form-urlencoded'
    }
})