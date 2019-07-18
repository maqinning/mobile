import { getUserSearchHistory,
  deleteSearchHistory,
  searchSuggestion,
  getSearchResult } from '@/actions/user'
const state = {
  searchHistory: [],
  options: [],
  searchResult: { page: 1, list: [] }, // 搜索结果存储包含关键字
  keyWord: null
}
const actions = {
  async  getUserSearchHistory ({ commit }) {
    let result = await getUserSearchHistory() // 获取搜索历史
    commit({ type: 'updateSearchHistory', searchHistory: result.data.keywords })
  },
  async deleteSearchHistory ({ commit, dispatch }) {
    await deleteSearchHistory() // 删除搜索历史
    dispatch('getUserSearchHistory') // 重新拉取历史
  },
  async searchSuggestion ({ commit }, params) {
    if (!params.q) {
      commit({ type: 'updateOptions', options: [] })
    } else {
      let result = await searchSuggestion(params)
      commit({ type: 'updateOptions', options: result.data.options })
    }
  },
  async getSearchResult ({ commit, state }, data) {
    let params = { ...data, q: state.keyWord }
    let result = await getSearchResult(params)
    commit({ type: 'updateSearchResult', searchResult: result.data })
  }
}
const mutations = {
  updateSearchHistory (state, payload) {
    state.searchHistory = payload.searchHistory // 更新用户搜索历史
  },
  updateOptions (state, payload) {
    state.options = payload.options // 更新
  },
  updateKeyWord (state, payload) {
    // 更新查询关键字
    state.keyWord = payload.keyWord
  },
  updateSearchResult (state, payload) {
    if (payload.searchResult.page === 1) {
      state.searchResult = {
        page: 1,
        total: payload.searchResult.total_count,
        list: payload.searchResult.results
      }
    } else {
      state.searchResult = {
        page: payload.searchResult.page,
        total: payload.searchResult.total_count,
        list: state.searchResult.list.concat(payload.searchResult.results)
      }
    }
  }
}
const getters = {
  searchFinished (state) {
    return state.searchResult.page === state.searchResult.total
  }
}
export default {
  state, actions, mutations, getters
}
