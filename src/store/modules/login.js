import { loginUser, getMessageCode, updateToken } from '@/actions/login'
import Router from '@/router'
import { Toast } from 'vant'
import { setStore, getStore } from '@/utils/cachestore' // 存储对象
import { userKey } from '@/constants/localkey'
const User = {
  // namespaced: true, // 用于在全局引用此文件里的方法时标识这一个的文件名
  state: {
    userInfo: getStore(userKey), // 初始化信息
    sendCode: false,
    lastSeconds: 60 // 剩余发送时间
  },
  mutations: {
    secondsCut (state) {
      // 倒计时
      state.lastSeconds-- // 对当前秒数倒计时
    },
    loginSuccess (state, userInfo) {
      state.userInfo = userInfo // 设置用户信息
      setStore(userKey, userInfo) // 同步到缓存中去
    },
    sendCodeSuccess (state) {
      state.sendCode = true // 修改发送状态
      Toast.success('发送验证码成功')
    },
    reloadCodeSuccess (state) {
      state.sendCode = false
      state.lastSeconds = 60 // 恢复发送状态
    }
  },
  actions: {
    async sendCode ({ commit }, data) {
      let result = await getMessageCode(data)
      if (result && result.message === 'OK') {
        commit('sendCodeSuccess') // 发送消息成功
      }
    },
    async loginUser ({ commit }, data) {
      let result = await loginUser(data)
      if (result && result.data) {
        commit('loginSuccess', result.data) // 设置信息
        Router.replace({ path: '/' })// 登录到主页
      }
    },
    // 更新用户的token
    async updateToken ({ commit, state }, config) {
      // 如果config有内容 则说明是请求时发现token过期了
      // 读取缓存中的刷新token
      let result = await updateToken('Bearer' + ' ' + state.userInfo['refresh_token']) // 调用token接口
      if (result && result.data) {
        commit('loginSuccess', { ...state.userInfo, ...result.data }) // 更新数据
        window.location.reload() // 先采用暴力方法 重新加载 后续再考虑方案
      }
    }
  },
  getters: {
    userToken (state) {
      return state.userInfo && state.userInfo.token ? state.userInfo.token : null // 获取用户的token
    },
    refreshToken (state) {
      return state.userInfo && state.userInfo.token ? state.userInfo.token : null // 获取用户的刷新token
    },
    codeMessage (state) {
      return state.userInfo && state.sendCode ? state.lastSeconds + '秒' : '发送验证码' // 登录页用于发送验证码的内容
    }
  }
}
export default User
