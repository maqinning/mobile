/* eslint-disable camelcase */
import { dislikeArticle, getUserChannels, getArticlesByChannel, getAllChannels, resetUserChannel, reportArticle
} from '@/actions/content'
import { blackUser, cancelBlack } from '@/actions/user'

// vuex中的分类及主页
const cata = {
  state: {
    currentCata: {}, // 当前选择频道
    channels: [], // 用户频道
    articlesData: {}, // 用来存储所有的文章数据 频道id:{ data:数据 }
    allChannels: [] // 所有的频道
  },
  mutations: {
    deleteArticle (state, payload) {
      // 删除文章
      let data = state.articlesData[state.currentCata.id].data.filter(item => item.art_id !== payload.article.art_id)
      state.articlesData = { ...state.articlesData, [state.currentCata.id]: { ...state.articlesData[state.currentCata.id], data } }
    },
    setUserChannels (state, payload) {
      state.channels = payload.channels // 更新频道列表
    },
    updateCurrentCata (state, payload) {
      // 更新当前分类
      state.currentCata = payload
    },
    // 更新文章数据
    updateArticles (state, payload) {
      if (state.articlesData[payload.id]) {
        // 如果存在当前的频道id
        let newData = []
        if (payload.preAppend) {
          newData = state.articlesData[payload.id].data.concat(payload.results) // 如果是刷新数据 需要追加到原有数据的前方
        } else {
          newData = payload.results.concat(state.articlesData[payload.id].data) // 如果是追加数据 需要追加到原有数据的后方
        }
        let currentData = { pre_timestamp: payload.pre_timestamp, data: newData } // 这里需要注意下 更新对象中的某一项 需要用扩展府 展开新对象
        state.articlesData = { ...state.articlesData, [payload.id]: currentData }
      } else {
        let currentData = { pre_timestamp: payload.pre_timestamp, data: payload.results }
        state.articlesData = { ...state.articlesData, [payload.id]: currentData } // 如果是第一次则要将初始化输入放入内部 需要注意是 新对象替换旧对象
      }
    },
    // 更新所有频道
    updateAllChannels (state, payload) {
      state.allChannels = [...payload] // 更新所有列表数据
    },
    // 删除自己频道中的数据
    deleteChannel (state, channel) {
      state.channels = state.channels.filter(item => item.id !== channel.id)
    },
    // 添加到自己的频道中
    addChannel (state, channel) {
      state.channels = [...state.channels, channel]
    }
  },
  actions: {
    async dislikeArticleById ({ commit }, { target, article }) {
      await dislikeArticle({ target })
      commit('deleteArticle', { article })
    },
    async blackUser ({ commit }, { target, article }) {
      await blackUser({ target })
      article && commit('deleteArticle', { article })
    },
    async cancelBlackUser ({ commit }, { target }) {
      await cancelBlack(target) // 取消拉黑
    },
    async reportArticle ({ commit }, { target, type, article }) {
      await reportArticle({ target, type })
      commit('deleteArticle', { article })
    },
    // 拉取最新推荐数据
    async refreshData ({ state, commit }) {
      let channel_id = state.currentCata.id
      let timestamp = new Date().getTime() // 取当前时间戳
      let params = { timestamp, channel_id, with_top: 1 }
      let result = await getArticlesByChannel(params)
      commit('updateArticles', { ...result.data, id: channel_id, preAppend: true })
    },
    async loadMoreData ({ state, commit }) {
      let channel_id = state.currentCata.id
      let timestamp = (state.articlesData[channel_id] && state.articlesData[channel_id].pre_timestamp) || 0 // 取历史时间戳
      if (timestamp !== 0) {
        let params = { timestamp, channel_id, with_top: 1 }
        let result = await getArticlesByChannel(params)
        commit('updateArticles', { ...result.data, id: channel_id, preAppend: false })
      }
    },
    async loadCata ({ commit, dispatch }) {
      let result = await getUserChannels()
      if (result && result.data) {
        commit('setUserChannels', result.data) // 更新用户频道列表
        commit('updateCurrentCata', result.data.channels[0]) // 更新用户当前频道
        dispatch('loadChannel', result.data.channels[0].id) // 请求第一页的数据
      }
    },
    async loadChannel ({ state, commit }, channel_id) {
      // 获取频道列表
      let timestamp = state.articlesData[channel_id] ? state.articlesData[channel_id].pre_timestamp : new Date().getTime() // 取历史时间戳
      let params = { timestamp, channel_id, with_top: 1 }
      if (timestamp !== 0) {
        let result = await getArticlesByChannel(params)
        if (result && result.data) {
          if (result.data.results && result.data.results.length) {
            // 当前更新数据有内容
            commit('updateArticles', { ...result.data, id: channel_id, preAppend: false })
          } else if (result.data.pre_timestamp) {
            // 当前数据没值  但是历史有值的情况下
            let histryParams = { timestamp: result.data.pre_timestamp, channel_id, with_top: 1 }
            let historyResult = await getArticlesByChannel(histryParams)
            if (historyResult.data) {
              // 由于推送当前的
              commit('updateArticles', { ...historyResult.data, id: channel_id, preAppend: false })
            }
          }
        }
      }
    },
    async changeCata ({ state, commit, dispatch }, cata) {
      // 切换频道时
      commit('updateCurrentCata', cata) // 更新频道
      // 如果不存在数据 则需要进行数据加载
      if (!state.articlesData[cata.id]) {
        // 如果不存在此对象
        dispatch('loadChannel', cata.id)
      }
    },
    async getAllCata ({ commit, dispatch }) {
      // 获取所有频道
      let result = await getAllChannels()
      if (result && result.data) {
        commit('updateAllChannels', result.data.channels) // 更新所有频道
      }
    },
    // 新增用户频道
    async addUserChannel ({ commit, dispatch }, channel) {
      commit('addChannel', channel)
      dispatch('sysncChannel') // 同步数据
    },
    // 删除指定的用户频道
    async delUserChannel ({ commit, dispatch }, channel) {
      commit('deleteChannel', channel)
      dispatch('sysncChannel') // 同步数据
    },
    // 同步频道
    async sysncChannel ({ state }) {
      let data = state.channels.map((item, index) => ({ id: item.id, seq: (index + 1) })).slice(1) // 排除第一个推荐频道
      await resetUserChannel({ channels: data }) // 重置
    }
  },
  getters: {
    outChannels (state) {
      // 除去用户频道之外的所有频道  此处是一个嵌套的条件比对 看不懂的话 可写两个for循环
      return state.allChannels.filter(item => !state.channels.some(userItem => userItem.id === item.id))
    }
  }
}
export default cata
