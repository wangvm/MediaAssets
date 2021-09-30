import axios from "axios"
import { Message } from 'element-ui'
import { getUserToken } from "../config/storage"

let baseUrl = 'http://121.196.100.229:8080/mam'
// let baseUrl = 'http://192.168.3.206:8080'

let instance = axios.create({
  headers: {},
  baseURL: baseUrl,
  crossDomain: true,
  withCredentials: false,
})

// axios.defaults.withCredentials = true
//http request拦截器
instance.interceptors.request.use(
  config => {
    // const token = getUserToken()
    //debugger
    // if (token) {//判断是否存在token，如果存在则每个http header都加上token
    //   config.headers.token = token
    // }
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
        params: data
      })
    } else {
      promise = instance.post(baseUrl + url, data)
    }
    promise.then(res => {
      console.log(res);
      // if (res.data.code !== 200) {
      //   Message.error(res.data.message)
      // }
      res.data.code === 200 ?
        Message.success(res.data.message)
        : Message.error(res.data.message)
      resolve(res.data)
    }).catch(err => {
      Message.error(err.data.message)
      reject(err.data)
    })
  })
}

