import { sendMessage } from '@/utils/socketmanage'
const state = {
  list: [], // 聊天列表
  notifyList: [], // 通知列表
  readNotify: true // 是否已读notify
}
const actions = {
  sendMessage ({ commit }, { msg, first }) {
    // 发送消息
    let message = { msg, timestamp: new Date().getTime() }
    sendMessage(message) // 发送消息
    !first && commit({ type: 'updateMessage', ...message, robot: false }) // 发送给小智同学
  },
  reveiveMessage ({ commit }, message) {
    // 接收小智同学的消息 这里从sockmanage文件中接收
    commit({ type: 'updateMessage', ...message, robot: true })
  },
  reveiveNotify ({ commit }, message) {
    // 接收通知消息 这里从sockmanage文件中接收
    commit({ type: 'updateNotify', ...message })
  }
}
const mutations = {
  updateMessage (state, payload) {
    state.list = [...state.list, { ...payload }]
  },
  updateNotify (state, payload) {
    // 更新当前的通知列表 通知在前
    state.notifyList = [{ ...payload, new: true }, ...state.notifyList]
  },
  updateNotifyState (state, payload) {
    // 更新notify的已读状态
    state.readNotify = payload.read // 是否已点开读取 认为点开即读取完毕
    state.notifyList = state.notifyList.map(item => ({ ...item, new: false })) // 更新所有的通知读取状态
  }
}
const getters = {
  // 返回当前新通知的记录个数
  newNoticyCount (state) {
    return state.notifyList.filter(item => item.new).length
  }
}
export default {
  state, actions, mutations, getters
}
