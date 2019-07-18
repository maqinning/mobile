import request from '@/utils/request'
import { API_DISLIKING,
  API_LIKEING,
  API_FOLLOW,
  API_USERCHANNELS,
  API_ARTICLES,
  API_CHANNELS,
  API_ARTICLE,
  API_COMMENTS,
  API_COMMENTLIKE,
  API_REPORT_ARTICLE } from '@/constants/api'
// 获取用户频道列表
export function getUserChannels () {
  return request({
    url: API_USERCHANNELS,
    method: 'get'
  })
}
// 根据频道获取文章列表
export function getArticlesByChannel (params) {
  return request({
    url: API_ARTICLES,
    method: 'get',
    params
  })
}
// 获取所有的频道
export function getAllChannels () {
  return request({
    url: API_CHANNELS,
    method: 'get'
  })
}
// 新增用户频道 单个增加
export function resetUserChannel (data) {
  return request({
    url: API_USERCHANNELS,
    method: 'put',
    data
  })
}
// 获取文章详情
export function getArticleInfo (artid, trace) {
  return request({
    url: API_ARTICLE + '/' + artid,
    method: 'get',
    headers: { 'Trace': trace }
  })
}
// 获取评论或者评论回复
export function getComments (params) {
  return request({
    url: API_COMMENTS,
    method: 'get',
    params
  })
}
// 添加评论
export function setComments (data) {
  return request({
    url: API_COMMENTS,
    method: 'post',
    data
  })
}
//  关注用户
export function followUser (data) {
  return request({
    url: API_FOLLOW,
    method: 'post',
    data
  })
}
// 取消关注用户
export function cancelFollow (userid) {
  return request({
    url: API_FOLLOW + '/' + userid,
    method: 'delete'
  })
}
// 点赞某个文章
export function admireArticle (data) {
  return request({
    url: API_LIKEING,
    method: 'post',
    data
  })
}
// 取消点赞某个文章
export function cancelAdmire (target) {
  return request({
    url: API_LIKEING + '/' + target,
    method: 'delete'
  })
}
//  不喜欢某篇文章
export function dislikeArticle (data) {
  return request({
    url: API_DISLIKING,
    method: 'post',
    data
  })
}
// 取消不喜欢谋篇文章
export function cancelDislike (target) {
  return request({
    url: API_DISLIKING + '/' + target,
    method: 'delete'
  })
}
// 点赞评论
export function likeComment (data) {
  return request({
    url: API_COMMENTLIKE,
    method: 'post',
    data
  })
}
export function dislikeComment (target) {
  return request({
    url: API_COMMENTLIKE + '/' + target,
    method: 'delete'
  })
}
export function reportArticle (data) {
  return request({
    method: 'post',
    url: API_REPORT_ARTICLE,
    data
  })
}
