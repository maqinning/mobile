import request from '@/utils/request'
import { API_LOGIN, API_SENDCODE } from '@/constants/api'
/*
 **获取短信验证码
 */
export function getMessageCode (params) {
  return request({
    url: API_SENDCODE + params.mobile,
    method: 'get'
  })
}
/*
*用户登录
**/
export function loginUser (data) {
  return request({
    url: API_LOGIN,
    method: 'post',
    data
  })
}
// 更新用户token
export function updateToken (data) {
  return request({
    url: API_LOGIN,
    method: 'put',
    headers: { 'Authorization': data }
  })
}
