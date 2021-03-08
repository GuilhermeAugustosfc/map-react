import axios from 'axios'

export default axios.create({
    baseURL: 'http://api-fulltrack4.ftdata.com.br/',
    headers: {
        'Authorization': 'Bearer 4a99ff2d243e40b54316e850183e33cc3e8f2e86',
        'Content-Type':'application/json'
    }
})