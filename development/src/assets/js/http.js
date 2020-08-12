import axios from 'axios'
const service = axios.create()

// 添加请求拦截器
service.interceptors.request.use(
    config => {
        // config.headers.Authorization= localStorage.getItem("token") || {}
        // 在发送请求之前做些什么
        // if (getToken()) {
        //   config.data.token = getToken()
        // }
        // config.data = getSign(config.data)
        return config
    },
    error => {
        // 对请求错误做些什么
        return Promise.reject(error)
    }
)

// 添加响应拦截器
service.interceptors.response.use(function(res) {
    // if (res.data.code === 9 || res.data.code === 10) { // 9:未授权 10：错误的token
    //   router.replace('/')
    // }
    // 对响应数据做点什么
    return res
}, function(error) {
    // 对响应错误做点什么
    console.log(error)
    return Promise.reject(error)
})

let request = function(url, data = {}, method = 'post') {
    return new Promise((resolve, reject) => {
        const options = {
            url,
            method,
            headers: {
                'Content-Type': 'application/json'
            }
        }
        if (method.toLowerCase() === 'get') {
            options.params = data
        } else {
            options.data = data
        }
        service(options)
            .then(res => {
                // console.log('返回数据', res)
                resolve(res.data)
            })
            .catch(error => {
                reject(error)
                console.error(error)
            })
    })
}
export default request
