import Vue from 'vue'
import Vuex from 'vuex'
import login from './modules/login' // 登录
import user from './modules/user' // 用户
import index from './modules/cata' // 主页
import article from './modules/article' // 文章
import chat from './modules/chat' // 聊天内容
import search from './modules/search' // 聊天内容

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    login,
    index,
    article,
    chat,
    search
  }
})
