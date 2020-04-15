import axios from 'axios'
import { Message, Loading } from 'element-ui'
import { compareDesc } from 'date-fns'
import router from '@/router/'
// import store from '@/store'
// import { loadavg } from 'os'

// 未捕获的promise错误
window.addEventListener('unhandledrejection', function(e) {
  e.preventDefault()
  return true
})

// token
const getToken = () => window.localStorage.getItem('Token')
const getTokenExpirationTime = () => window.localStorage.getItem('TokenExpirationTime')
// 提交参数
// ajax相关
axios.defaults.baseURL = window._config.partnerurl

// 请求拦截器
axios.interceptors.request.use(config => {
  config.headers = {
    'Content-Type': 'application/json; charset=utf-8'
  }
  config.data.Token = getToken() || void 0
  return config
})

const jumpLogin = (msg) => {
  if (router.currentRoute.name !== '/login') {
    router.replace({
      path: '/login'
    })
  }
}

export const request = ({
  api,
  para = {}
}) => {
  // 登录验证
  const exTime = getTokenExpirationTime()
  if (router.currentRoute.name !== '/login') {
    if (!getToken() || (exTime && compareDesc(exTime, new Date()) === 1)) {
      jumpLogin()
    }
  }
  // 发送请求
  const ld = Loading.service({
    fullscreen: true,
    text: '努力加载中...',
    background: 'rgba(0,0,0,.6)',
    lock: true
  })

  const promise = new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: api + '?partnerId=' + window._config.partnerId,
      data: para
    }).then(res => {
      ld.close()
      const data = res.data
      if (data.ResponseId === 0) {
        resolve(data.Data)
      } else {
        reject(data)
      }
    }).catch(error => {
      ld.close()
      reject(error)
    })
  })

  return new Promise((resolve, reject) => {
    promise.then(data => resolve(data)).catch(error => {
      reject(error)
      if (error.Message !== '申报支付单失败') {
        Message.error(error.Message)
      }
      if (error.ResponseId === -1) {
        jumpLogin()
      }
    })
  })
}

