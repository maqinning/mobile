import Socket from 'socket.io-client'
import store from '@/store'
import { socketAddress } from '@/constants/localkey'
const messagePool = [] // 消息池
let mySocket = null
let connectSuccess = false
export function init () {
  let usertoken = store.state.login.userInfo ? store.state.login.userInfo.token : null
  if (usertoken) {
    // 用户的token
    mySocket = Socket(socketAddress, {
      'transports': ['polling', 'websocket'],
      'query': {
        'token': usertoken
      }
    }) // 初始化token
    // 初始化socket通讯
    mySocket.on('connect', connect)
    mySocket.on('message', message)
    mySocket.on('disconnect', disconnect)
    mySocket.on('following notify', (data) => store.dispatch('reveiveNotify', { ...data, type: 'follow' }))
    mySocket.on('liking notify', (data) => store.dispatch('reveiveNotify', { ...data, type: 'like' }))
    mySocket.on('comment notify', (data) => store.dispatch('reveiveNotify', { ...data, type: 'comment' }))
  }
}
function connect () {
  console.log('连接成功!')
  connectSuccess = true
  messagePool.map(item => {
    sendMessage(item) && messagePool.shift() // 删除消息
  })
}
function disconnect () {
  mySocket = null // 重置
  connectSuccess = false
  console.log('断开连接!')
}
function message (data) {
  store.dispatch('reveiveMessage', data) // 接收消息
}
export function sendMessage (message) {
  if (connectSuccess) {
    mySocket.send(message, (params) => {
      console.log('发送成功')
    })
  } else {
    messagePool.push(message)
  }
}
