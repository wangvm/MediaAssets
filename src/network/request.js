import axios from "axios"
// import { Message } from 'element-ui'
// import { getUserToken } from "../config/storage"
import { message } from '../assets/js/message'

let baseUrl = 'http://10.1.252.45:8080/mam'
// let baseUrl = 'http://192.168.3.206:8080'

let instance = axios.create({
  headers: {},
  baseURL: baseUrl,
  crossDomain: true,
  withCredentials: false,
})
let messageList = [];

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
      res.data.code === 200 ?
        message.success(res.data.message)
        : message.error(res.data.message)
      resolve(res.data)
    }).catch(err => {
      reject(err.data)
    })
  })
}

