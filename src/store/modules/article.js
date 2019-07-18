import {
  getArticleInfo,
  getComments,
  setComments,
  cancelFollow,
  followUser,
  admireArticle,
  cancelAdmire,
  dislikeArticle,
  cancelDislike,
  likeComment,
  dislikeComment
} from '@/actions/content'
import { admireType, articleType } from '@/constants/consttype'
import { Toast } from 'vant'
const state = {
  articleInfo: {},
  lastId: null,
  endId: null,
  showPopReply: false, // 显示展开评论
  comments: [], // 用来存储文章评论
  commentsTotal: 0,
  currentReplies: { comid: null, data: [], lastId: null, endId: null } // 用来存储当前的回复列表详情及其他内容 结构 data:[],last_id,end_id,comid 为当前的评论id
}
const actions = {

  async getArticleById ({ commit }, { artid, trace }) {
    Toast.loading('加载中')
    let result = await getArticleInfo(artid, trace) // 拉取文章
    Toast.clear()
    if (result && result.data) {
      commit('setArticle', result.data) // 更新状态
    }
  },
  // 获取文章评论或者回复 source为源id type确定是文章还是评论  a 文章 c评论
  async getComments ({ commit }, { source, type, offset }) {
    // 这里需要注意 由于获取评论和回复都是公用一个接口 offset 相当于有两个 一个是文章评论的 一个是评论回复的
    let result = await getComments({ source, type, offset }) // 获取评论或者评论回复
    if (type === articleType.ARTICLE) {
      commit('updateArticleComment', { ...result.data, first: Boolean(!offset) })
    } else {
      commit('updateReplies', { ...result.data, source, first: Boolean(!offset) }) // 更新文章评论或者回复
    }
  },
  async followUser ({ commit }, target) {
    await followUser({ target }) // 关注用户
    commit('follow') // 提交关注命令
  },
  async cancelFollow ({ commit }, target) {
    await cancelFollow(target) // 取消关注
    commit('cancel') // 提交取消命令
  },
  async admireOrCancel ({ commit, state }) {
    let target = state.articleInfo.art_id // 从状态中获取文章的id
    if (state.articleInfo.attitude === admireType.ADMIRE) {
      // 如果目前是点赞状态 则取消点赞状态
      await cancelAdmire(target)
      commit('cancelAdmire') // 取消点赞状态
    } else {
      await admireArticle({ target })
      commit('admireArticle') // 点赞状态
    }
  },

  async dislikeOrCancel ({ commit, state }) {
    let target = state.articleInfo.art_id // 从状态中获取文章的id
    if (state.articleInfo.attitude === admireType.DISLIKE) {
      // 如果目前是不喜欢状态 则取消不喜欢
      await cancelDislike(target)
      commit('cancelDislike') // 取消点赞状态
    } else {
      await dislikeArticle({ target })
      commit('dislikeArticle') // 点赞状态
    }
  },
  async setComments ({ commit, state, dispatch }, { content, target }) {
    // 对文章或者回复评论
    let artId = state.articleInfo.art_id // 从状态中获取文章的id
    let type = target ? articleType.COMMENT : articleType.ARTICLE
    target = target || artId // 如果不存在目标 则就是对文章评论
    // 由于评论和文章评论调用的是一个接口
    let data = type === articleType.COMMENT ? { content, target, 'art_id': artId } : { content, target }
    await setComments(data) // 评论
    Toast.success('评论成功')
    await dispatch('getComments', { 'source': target, type })
    // 由于新增评论 所以需要重新拉取评论内容 只拉取首屏内容
    // 如果artId有值 则说明是对评论的回复 需要拉取回复内容
    // 如果target有值 则需要对上层的回复组件的数量+1 因为外层的数据没有更新
    commit('addReplyCount', { target })
    return true
  },
  // 点赞或者取消点赞评论
  async likeOrdislikeComment ({ commit }, { target, islike }) {
    islike ? await dislikeComment(target) : await likeComment({ target })
  },
  // 展开回复
  async showReplies ({ commit, dispatch }, source) {
    commit('showPopReplies') // 显示弹层数据
    await dispatch('getComments', { type: articleType.COMMENT, source }) // 调用自身的action 请求数据
  }
}
const mutations = {
  showPopReplies (state) {
    state.showPopReply = true // 显示弹层
  },
  hidePopReplies (state) {
    state.showPopReply = false
    state.currentReplies = { data: [], lastId: null, endId: null } // 关闭弹层后 清空当前回复的数据
  },
  cancelAdmire (state) {
    // 取消点赞
    state.articleInfo = { ...state.articleInfo, attitude: admireType.NOFEEL }
  },
  // 点赞
  admireArticle (state) {
    state.articleInfo = { ...state.articleInfo, attitude: admireType.ADMIRE }
  },
  // 不喜欢文章
  dislikeArticle (state) {
    state.articleInfo = { ...state.articleInfo, attitude: admireType.DISLIKE }
  },
  // 取消不喜欢
  cancelDislike (state) {
    state.articleInfo = { ...state.articleInfo, attitude: admireType.NOFEEL }
  },
  setArticle (state, payload) {
    state.articleInfo = { ...payload } // 设置文章详情
  },
  follow (state) {
    // 关注用户
    state.articleInfo = { ...state.articleInfo, 'is_followed': true }
  },
  cancel (state) {
    // 取消关注
    state.articleInfo = { ...state.articleInfo, 'is_followed': false }
  },
  updateArticleComment (state, payload) {
    // 更新文章的评论
    if (payload.first) {
      state.comments = [...payload.results] // 如果重置 则不可追加
    } else {
      state.comments = [...state.comments, ...payload.results] // 如果重置 则不可追加
    }
    state.commentsTotal = payload.total_count // 回复的总数
    state.lastId = payload.last_id // 本次返回结果的最后一个评论id
    state.endId = payload.end_id // 所有评论的最后一个id
  },
  updateReplies (state, payload) {
    // 更新评论的回复
    let { source } = payload // 找到是哪一个评论的id
    // 对当前回复的内容进行更新
    state.currentReplies = {
      ...state.currentReplies,
      comid: source,
      data: payload.first ? [...payload.results] : [...state.currentReplies.data, ...payload.results],
      lastId: payload.last_id,
      endId: payload.end_id,
      total: payload.total_count
    }
  },
  // 增加回复记录数
  addReplyCount (state, payload) {
    // 要更新前一页的回复记录数 这个函数是在提交回复之后调用的
    state.comments = state.comments.map(item => {
      if (item.com_id === payload.target) {
        item['reply_count'] += 1
      }
      return item
    })
  }
}
const getters = {
  currentFinished (state) {
    return state.currentReplies.lastId === state.currentReplies.endId
  },
  replyFinished (state) {
    return state.lastId === state.endId
  },
  admireSelect (state) {
    // 赞赏的状态
    return state.articleInfo.attitude === admireType.ADMIRE
  },
  dislikeSelect (state) {
    return state.articleInfo.attitude === admireType.DISLIKE
  },
  // 展开回复的列表
  commentReplies (state) {
    return state.currentReplies.data ? state.currentReplies.data : []
  },
  // 展开回复加载下一屏
  repliesLoadMore (state) {
    return state.currentReplies.lastId && state.currentReplies.endId && state.currentReplies.lastId !== state.currentReplies.endId
  },
  // 评论加载下一屏
  commentsLoadMore (state) {
    return state.lastId && state.endId && state.lastId !== state.endId
  },
  // 返回当前回复的ID
  currentReplyId (state) {
    return state.currentReplies.comid
  }
}
const article = {
  state,
  actions,
  mutations,
  getters
}
export default article
