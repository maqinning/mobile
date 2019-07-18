import Router from './router'
import store from '@/store'

Router.beforeEach((to, form, next) => {
  if (to.meta.needLogin && (!store.state.login.userInfo || !store.state.login.userInfo.token)) {
    // 访问页面是需要登录并且当前没有登录的情况下 需要跳转到登录页
    next({ path: 'login' })
    return
  }
  keys[to.name] && (document.title = keys[to.name])
  next()
})
Router.afterEach(() => {

})
const keys = {
  'index': '首页',
  'detail': '文章详情',
  'search': '搜索',
  'searchResult': '搜索结果',
  'video': '视频',
  'user': '用户',
  'personalinfo': '个人信息',
  'ask': '问答',
  'login': '登陆',
  'collect': '收藏/历史',
  'follow': '关注/粉丝',
  'mywork': '作品',
  'robot': '小智同学',
  'message': '消息通知',
  'people': '用户'

}
