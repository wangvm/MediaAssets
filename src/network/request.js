import axios from "axios"

let baseUrl = 'http://121.196.100.229:8080'

let instance = axios.create({
	headers: {},
	baseURL: baseUrl,
	crossDomain: true,
	withCredentials: false,
})
//http request拦截器
instance.interceptors.request.use(
	config => {
		const token = sessionStorage.getItem('userToken')
		//debugger
		if (token) {//判断是否存在token，如果存在则每个http header都加上token
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
					'token': localStorage.getItem('token') || null
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

