import request from '@/utils/request'
import { API_USER,
  API_USERS,
  API_COLLECT,
  API_HISTORY,
  API_USERPHOTO,
  API_USERPROFILE,
  API_FOLLOWS,
  API_FOLLOWERS,
  API_USERARTICLES,
  API_ANNOUNCEMENT,
  API_FIGURE,
  API_SEARCHHISTORY,
  API_SUGGESTION,
  API_SEARCH,
  API_BLACKLIST
} from '@/constants/api'
// 获取个人用户的资料

export function getPeopleArticles (target, params) {
  return request({
    url: API_USERS + '/' + target + '/articles',
    method: 'get',
    params
  })
}
export function getPeopleInfo (target) {
  return request({
    url: API_USERS + '/' + target,
    method: 'get'
  })
}
export function getUserInfo () {
  return request({
    url: API_USER,
    method: 'get'
  })
}
// 获取用户收藏的接口
export function getUserCollect (params) {
  return request({
    url: API_COLLECT,
    method: 'get',
    params
  })
}
// 收藏文章
export function collectArticle (data) {
  return request({
    url: API_COLLECT,
    method: 'post',
    data
  })
}
// 取消收藏
export function cancelCollect (target) {
  return request({
    url: API_COLLECT + '/' + target,
    method: 'delete'
  })
}
// 获取用用户阅读历史
export function getUserHistory (params) {
  return request({
    url: API_HISTORY,
    method: 'get',
    params
  })
}
export function editUserPhoto (data) {
  return request({
    url: API_USERPHOTO,
    method: 'patch',
    headers: { 'Content-Type': 'multipart/form-data' },
    data
  })
}
// 获取用户资料
export function getUserProfile () {
  return request({
    url: API_USERPROFILE,
    method: 'get'
  })
}
// 编辑用户资料

export function editUserProfile (data) {
  return request({
    url: API_USERPROFILE,
    method: 'patch',
    data
  })
}
// 获取用户关注列表
export function getUserFollows (params) {
  return request({
    url: API_FOLLOWS,
    method: 'get',
    params
  })
}
// 获取用户粉丝列表
export function getUserFollowers (params) {
  return request({
    url: API_FOLLOWERS,
    method: 'get',
    params
  })
}
// 获取用户文章列表
export function getUserArticles (params) {
  return request({
    url: API_USERARTICLES,
    method: 'get',
    params
  })
}
// 获取系统公告
export function getAnnounce (params) {
  return request({
    url: API_ANNOUNCEMENT,
    method: 'get',
    params
  })
}
// 获取统计数据
export function getFigure (params) {
  return request({
    url: API_FIGURE,
    method: 'get',
    params
  })
}
// 获取用户搜索历史
export function getUserSearchHistory () {
  return request({
    url: API_SEARCHHISTORY,
    method: 'get'
  })
}
// 删除搜索历史
export function deleteSearchHistory () {
  return request({
    url: API_SEARCHHISTORY,
    method: 'delete'
  })
}
// 搜索建议
export function searchSuggestion (params) {
  return request({
    url: API_SUGGESTION,
    method: 'get',
    params
  })
}
// 搜索
export function getSearchResult (params) {
  return request({
    url: API_SEARCH,
    method: 'get',
    params
  })
}
// 拉黑用户
export function blackUser (data) {
  return request({
    url: API_BLACKLIST,
    method: 'post',
    data
  })
}
export function cancelBlack (target) {
  return request({
    url: API_BLACKLIST + '/' + target,
    method: 'delete'
  })
}
