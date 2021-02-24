import axios from "axios"

let baseUrl = ''

export default function (url, data, method = 'GET') {
    return new Promise((resolve, reject) => {
        let promise
        if (method === 'GET') {
            promise = axios.get(baseUrl + url, {params: data})
        } else {
            promise = axios.post(baseUrl + url, data)
        }
        promise.then(res => {
            resolve(res.data)
        }).catch(err => {
            reject(err.data)
        })
    })
}

