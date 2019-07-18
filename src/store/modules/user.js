import { getUserInfo,
  getUserCollect,
  collectArticle, getUserHistory,
  cancelCollect,
  editUserPhoto,
  getUserProfile,
  editUserProfile,
  getUserFollows,
  getUserFollowers,
  getUserArticles,
  getAnnounce,
  getFigure,
  getPeopleInfo,
  getPeopleArticles
} from '@/actions/user'
import { cancelFollow, followUser, cancelAdmire, admireArticle } from '@/actions/content'
import { Toast } from 'vant'
const state = {
  userInfo: {}, // 我的个人信息
  userProfile: {}, // 我的个人资料
  collect: { page: 1, total: 0, list: [] }, // 收藏
  history: { page: 1, total: 0, list: [] }, // 历史
  follows: { page: 1, total: 0, list: [] }, // 关注列表
  followers: { page: 1, total: 0, list: [] }, // 粉丝列表
  articles: { page: 1, total: 0, list: [] }, // 文章列表
  announce: { page: 1, total: 0, list: [] }, // 公告列表
  figure: {}, // 统计数据
  peopleInfo: {}, // 用户个人信息
  peopleWork: { page: 1, total: 0, list: [] } // 用户的文章列表
}
const actions = {
  // 点赞或者取消点赞文章 列表态
  // canceloradmire 为取消或者点赞 true 或者 false
  // target为操作的文章对象
  // listtype为处理来源 collect history mywork people 因为此方法会同时作用在四个位置 分别是 收藏 历史 作品动态 其他作者动态
  async admireOrCancelList ({ commit }, { canceloradmire, target, listtype }) {
    if (canceloradmire) {
      await admireArticle({ target })
    } else {
      await cancelAdmire(target)
    }
    commit({ type: 'updateArticleListState', canceloradmire, listtype, target }) // 更新列表状态
  },
  async getPeopleArticles ({ commit }, { target, params }) {
    let result = await getPeopleArticles(target, params)
    commit({ type: 'updatePeopleArticles', peopleWork: result.data })
  },
  async getPeopleInfo ({ commit }, target) {
    let result = await getPeopleInfo(target)
    commit({ type: 'updatePeopleInfo', peopleInfo: result.data })
  },
  async getUserInfo ({ commit }) {
    let result = await getUserInfo() // 拉取用户信息
    commit({ type: 'updateUserInfo', userInfo: result.data }) // 更新用户信息
  },
  async getUserProfile ({ commit }) {
    // 获取用户资料
    let result = await getUserProfile() // 拉取用户资料
    commit({ type: 'updateUserProfile', userProfile: result.data }) // 更新用户信息
  },
  async getUserCollect ({ commit }, params) {
    let result = await getUserCollect(params)
    commit({ type: 'updateUserCollect', collect: result.data })
  },
  async collectArticle ({ commit, dispatch }, { target }) {
    await collectArticle({ target }) // 收藏文章
  },
  async cancelCollect ({ commit, dispatch }, { target }) {
    await cancelCollect(target)
  },
  async editUserProfile ({ commit, dispatch }, data) {
    await editUserProfile(data) // 更新用户资料
    dispatch('getUserProfile') // 重新拉取个人资料
    dispatch('getUserInfo') // 重新拉取个人信息  个人资料可能会和个人信息关联
  },
  async editUserPhoto ({ commit, dispatch }, data) {
    await editUserPhoto(data) // 编辑用户头像或者身份证照片
    dispatch('getUserProfile') // 重新拉取个人资料
    dispatch('getUserInfo') // 重新拉取个人信息  个人资料可能会和个人信息关联
  },
  // 获取用户阅读历史
  async getUserHistory ({ commit }, params) {
    let result = await getUserHistory(params)
    commit({ type: 'updateUserHistory', history: result.data })
  },
  async getFollows ({ commit }, params) {
    let result = await getUserFollows(params)
    commit({ type: 'updateUserFollows', follows: result.data })
  },
  async getFollowers ({ commit }, params) {
    let result = await getUserFollowers(params)
    commit({ type: 'updateUserFollowers', followers: result.data })
  },
  // 由于没有分命名空间 所以这里必须和article中的名字分开 否则会出现覆盖的情况
  async updateFollowUser ({ commit }, data) {
    Toast.loading()
    if (data.cancelFollow) {
      // 如果已经取消过了 则需要继续关注
      await followUser({ target: data.id })
    } else {
      // 如果没取消过 则需要取消关注
      await cancelFollow(data.id)
    }
    Toast.clear()
    commit({ type: 'updateFollowsByUserId', id: data.id, follow: !data.cancelFollow })
  },
  // 需要注意的是 这里一个是关注列表 一个是粉丝列表  关注列表本身就是关注状态 而粉丝一开始除了互相关注外 没有关注状态
  async updateFollowerUser ({ commit }, data) {
    Toast.loading()
    if (!data.mutual_follow) {
      // 如果是互相关注 则认为用户关注了此用户
      await followUser({ target: data.id })
    } else {
      // 如果不是互相关注 则认为用户没关注该用户
      await cancelFollow(data.id)
    }
    Toast.clear()
    commit({ type: 'updateFollowersByUserId', id: data.id, follow: !data.mutual_follow })
  },
  async getUserArticles ({ commit }, params) {
    let result = await getUserArticles(params)
    commit({ type: 'updateUserArticles', articles: result.data })
  },
  async getAnnounce ({ commit }, params) {
    let result = await getAnnounce(params)
    commit({ type: 'updateAnnounce', announce: result.data })
  },
  async getFigure ({ commit }, params) {
    let result = await getFigure(params)
    commit({ type: 'updateFigure', figure: result.data
    })
  }
}
const mutations = {
  updatePeopleArticles (state, payload) {
    if (payload.peopleWork.page === 1) {
      state.peopleWork = {
        page: 1,
        total: payload.peopleWork.total_count,
        list: payload.peopleWork.results
      }
    } else {
      state.peopleWork = {
        page: payload.peopleWork.page,
        total: payload.peopleWork.total_count,
        list: state.peopleWork.list.concat(payload.peopleWork.results)
      }
    }
  },
  updatePeopleInfo (state, payload) {
    state.peopleInfo = { ...payload.peopleInfo }
  },
  updateFigure (state, payload) {
    state.figure = { ...payload.figure }
  },
  updateUserInfo (state, payload) {
    state.userInfo = { ...payload.userInfo }
  },
  updateUserProfile (state, payload) {
    state.userProfile = { ...payload.userProfile }
  },
  updateAnnounce (state, payload) {
    if (payload.announce.page === 1) {
      state.announce = {
        page: 1,
        total: payload.announce.total_count,
        list: payload.announce.results
      }
    } else {
      state.follows = {
        page: payload.announce.page,
        total: payload.announce.total_count,
        list: state.announce.list.concat(payload.announce.results)
      }
    }
  },
  updateUserFollows (state, payload) {
    if (payload.follows.page === 1) {
      state.follows = {
        page: 1,
        total: payload.follows.total_count,
        list: payload.follows.results
      }
    } else {
      state.follows = {
        page: payload.follows.page,
        total: payload.follows.total_count,
        list: state.follows.list.concat(payload.follows.results)
      }
    }
  },
  updateUserFollowers (state, payload) {
    if (payload.followers.page === 1) {
      state.followers = {
        page: 1,
        total: payload.followers.total_count,
        list: payload.followers.results
      }
    } else {
      state.followers = {
        page: payload.followers.page,
        total: payload.followers.total_count,
        list: state.followers.list.concat(payload.followers.results)
      }
    }
  },
  updateUserCollect (state, payload) {
    if (payload.collect.page === 1) {
      state.collect = {
        page: 1,
        total: payload.collect.total_count,
        list: payload.collect.results
      }
    } else {
      state.collect = {
        page: payload.collect.page,
        total: payload.collect.total_count,
        list: state.collect.list.concat(payload.collect.results)
      }
    }
  },
  updateUserArticles (state, payload) {
    if (payload.articles.page === 1) {
      state.articles = {
        page: 1,
        total: payload.articles.total_count,
        list: payload.articles.results
      }
    } else {
      state.articles = {
        page: payload.articles.page,
        total: payload.articles.total_count,
        list: state.articles.list.concat(payload.articles.results)
      }
    }
  },
  updateUserHistory (state, payload) {
    if (payload.history.page === 1) {
      state.history = {
        page: 1,
        total: payload.history.total_count,
        list: payload.history.results
      }
    } else {
      state.history = {
        page: payload.history.page,
        total: payload.history.total_count,
        list: state.history.list.concat(payload.history.results)
      }
    }
  },
  // 根据某个userid取消对关注列表中用户的关注
  updateFollowsByUserId (state, payload) {
    let newFollowsList = state.follows.list.map(item => {
      if (item.id === payload.id) {
        return { ...item, cancelFollow: payload.follow }
      }
      return item
    })
    state.follows = { ...state.follows, list: newFollowsList } // 更新
  },
  // 根据某个userid取消对粉丝列表中用户的关注
  updateFollowersByUserId (state, payload) {
    let newFollowersList = state.followers.list.map(item => {
      if (item.id === payload.id) {
        // let mutual_follow = item.mutual_follow && !payload.follow
        return { ...item, 'mutual_follow': payload.follow }
      }
      return item
    })
    state.followers = { ...state.follows, list: newFollowersList } // 更新
  },
  // 更新文章列表的状态  包括收藏 历史 个人动态 及 其他人动态
  updateArticleListState (state, { listtype, target, canceloradmire }) {
    if (listtype === 'mywork') {
      // 作者的文章更新
      let list = state.articles.list.map(item => {
        if (item.art_id === target) {
          return { ...item, 'is_liking': canceloradmire, 'like_count': canceloradmire ? (item.like_count + 1) : (item.like_count - 1) }
        }
        return item
      }) // 更新个人文章数据
      state.articles = { ...state.articles, list }
    } else if (listtype === 'people') {
      // 其他用户的文章
      let list = state.peopleWork.list.map(item => {
        if (item.art_id === target) {
          return { ...item, 'is_liking': canceloradmire, 'like_count': canceloradmire ? (item.like_count + 1) : (item.like_count - 1) }
        }
        return item
      }) // 更新个人文章数据
      state.peopleWork = { ...state.peopleWork, list }
    } else if (listtype === 'collect') {
      // 收藏的文章
      let list = state.collect.list.map(item => {
        if (item.art_id === target) {
          return { ...item, 'is_liking': canceloradmire, 'like_count': canceloradmire ? (item.like_count + 1) : (item.like_count - 1) }
        }
        return item
      }) // 更新个人文章数据
      state.collect = { ...state.collect, list }
    } else if (listtype === 'history') {
      // 历史的文章
      let list = state.history.list.map(item => {
        if (item.art_id === target) {
          return { ...item, 'is_liking': canceloradmire, 'like_count': canceloradmire ? (item.like_count + 1) : (item.like_count - 1) }
        }
        return item
      }) // 更新个人文章数据
      state.history = { ...state.history, list }
    }
  }
}
const getters = {
  collectFinished (state) {
    // 收藏是否已经加载完毕
    return state.collect.total === state.collect.list.length
  },
  historyFinished (state) {
    // 历史是否已经加载完毕
    return state.history.total === state.history.list.length
  },
  workFinished (state) {
    return state.articles.total === state.articles.list.length
  },
  announceFinished (state) {
    return state.announce.total === state.announce.list.length
  },
  followFinished (state) {
    return state.follows.total === state.follows.list.length
  },
  followerFinished (state) {
    return state.followers.total === state.followers.list.length
  },
  peopleFinished (state) {
    return state.peopleWork.total === state.peopleWork.list.length
  }
}
const user = {
  state, actions, mutations, getters
}

export default user
