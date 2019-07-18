import axios from 'axios'
import BigInt from 'json-bigint'
import { Toast } from 'vant'
import { getStore, setStore } from '@/utils/cachestore'
import { userKey, userUUIDKey } from '@/constants/localkey'
import store from '@/store'
import BigNumber from 'bignumber.js'
const apiUrl = process.env.NODE_ENV === 'production' ? 'http://ttapi.research.itcast.cn' : '/api'
const service = axios.create({
  baseURL: apiUrl, // api 的 base_url
  timeout: 10000, // request timeout
  transformResponse (data) {
    if (data) {
      let result = BigInt.parse(data)
      return result
    } // 由于后端的数据库对id进行了变更 所以这里必须采用json-bigint插件来进行处理 保证数据正确
  }
})
service.interceptors.request.use(
  config => {
    config.params && dealBigInt(config.params) // 处理get参数中的bignumber类型
    config.data && dealBigInt(config.data) // 处理post参数中的bignumber类型
    config.headers['Content-Type'] || (config.headers['Content-Type'] = 'application/json')
    let token = getToken()
    if (!token) {
      config.headers['Authorization'] || (config.headers['Authorization'] = 'Annoy ' + getUUID()) // 没有token就加上uuid
    } else {
      config.headers['Authorization'] || (config.headers['Authorization'] = getToken()) // 所有的请求默认加上token参数
    }
    return config
  },
  error => {
    Promise.reject(error)
  }
)
service.interceptors.response.use(
  response => {
    return response.data ? response.data : null
  },
  /**
   * 监控拦截 如果出现 异常 则直接终止请求链
   */
  error => {
    let code = error.response ? error.response.status : ''
    let message = ''
    if (code === 401 && getRefreshToken()) {
      // 401情况下 且存在刷新token的情况下
      store.dispatch('updateToken') // 刷新token
      return new Promise(function () { }) // 终止当前的promise链
    }
    switch (code) {
      case 400:
        message = '请求参数错误'
        break
      case 401:
        message = 'token过期或未传'
        break
      case 403:
        message = '操作失败'
        break
      case 404:
        message = '接口不存在'
        break
      case 409:
        message = '该文章已经被举报过'
        break
      case 429:
        message = '发送次数过多'
        break
      case 500:
        message = '服务器异常'
        break
      case 507:
        message = '服务器数据库异常'
        break
      default:
        message = '处理异常'
    }
    Toast.fail(message)
    return new Promise(function () { }) // 终止当前的promise链
  }

)
/***
 * 获取token作为请求参数 后期这里要考虑token实效性 可计算时间 进行自动更新 再进行请求
 * *****/
function getToken () {
  let userInfo = getStore(userKey)
  if (userInfo && userInfo.token) {
    return 'Bearer' + ' ' + userInfo.token
  }
}
/****
 * 当用户还未登录的时候 是没有token的这个时候接口要传annoykey参数 可以理解为唯一标识 这里我们模拟一个
 * ******/
function getUUID () {
  let uuid
  let result = getStore(userUUIDKey) // 为什么uuid要存储 因为推荐系统是根据用户的标记来进行推荐的 所以要有一个较为持久的缓存key
  if (!result || !result.uuid) {
    // 如果没有就生成一个 存储起来
    uuid = guid()
    setStore(userUUIDKey, { uuid })
  } else {
    uuid = result.uuid
  }
  return uuid
}
// 用于生成uuid
function S4 () {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
}
function guid () {
  return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4())
}
// 获取用于刷新的refreshtoken
function getRefreshToken () {
  let userInfo = getStore(userKey)
  if (userInfo) {
    return userInfo.refresh_token
  }
}
// 处理bignumber类型的参数
function dealBigInt (data) {
  for (var item in data) {
    if (data[item] && data[item].constructor === BigNumber) {
      data[item] = BigInt.stringify(data[item])
    }
  }
}
export default service
