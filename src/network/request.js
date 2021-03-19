import axios from "axios"

let baseUrl = 'http://121.196.100.229:8080'

// export function request(config) {
//     const instance = axios.create({
//         baseURL: 'http://121.196.100.229:8080',
//         timeout: 5000
//     });
//
//     instance.interceptors.request.use(config => {
//         return config
//     },err => {
//
//     })
//
//     return instance(config)
// }

let instance = axios.create({
    headers: {},
    baseURL: baseUrl,
    crossDomain: true,
    withCredentials: false,
})

instance.interceptors.request.use(
  config => {
      const token = sessionStorage.getItem('token')
      if (token) {
          config.headers.token = token
      }
      return config
  },
  err => {
      return Promise.reject(err)
  }
)

export default function (url, data, method = 'GET') {
    return new Promise((resolve, reject) => {
        let promise
        if (method === 'GET') {
            promise = instance.get(baseUrl + url, {
                headers: {
                    'token' : localStorage.getItem('token') || null
                }, params: data
            })
            //promise = axios.get(baseUrl + url, {params: data})
        } else {
            promise = instance.post(baseUrl + url, data)
            //promise = axios.post(baseUrl + url, data)
        }
        promise.then(res => {
            resolve(res.data)
        }).catch(err => {
            reject(err.data)
        })
    })
}

