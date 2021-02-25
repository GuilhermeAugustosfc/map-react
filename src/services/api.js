import axios from 'axios'

export default axios.create({
    baseURL: 'http://api-fulltrack4.ftdata.com.br/',
    headers: {
        'Authorization': 'Bearer f209165c4b191ca2bb67868f4043449d964c8dcd',
        'Content-Type':'application/x-www-form-urlencoded'
    }
})