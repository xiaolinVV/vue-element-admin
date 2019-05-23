import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// 创建 axios 实例 用于发起网络请求
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// 请求拦截器,用于请求前动态操作
service.interceptors.request.use(
  config => {
    // 可以在这里处理一些请求被发送前的操作,如添加统一的 token 头

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      // 配置 token 请求头,key 可根据业务自定义
      config.headers['X-Token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    // 请求失败处理,如打印日志等
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// 请求响应拦截器,对于响应结果做统一处理
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    // 拿到响应数据对象
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    // 对于一些系统异常状态码,这里知己统一处理
    if (res.code !== 20000) {
      Message({
        message: res.message || 'error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(res.message || 'error')
    } else {
      // 没有异常 则直接返回响应结果
      return res
    }
  },
  error => {
    // 这里对响应失败做处理,如打印日志等
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
