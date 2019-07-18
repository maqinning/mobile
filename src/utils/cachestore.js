/***
 * 设置缓存
 * */
export function setStore (key, value) {
  if (!key) {
    console.warn('本地存储的key不能为空')
    return
  }
  if (value) {
    value = typeof value !== 'string' ? JSON.stringify(value) : value
  }
  localStorage.setItem(key, value)
}
/***
 * 读取缓存
 * */
export function getStore (key) {
  if (!key) {
    console.warn('本地存储的key不能为空')
    return
  }
  let data = localStorage.getItem(key)
  if (data) {
    data = JSON.parse(data)
  }
  return data
}
/***
 * 清除缓存
 * */
export function clearStore (key) {
  localStorage.clear(key)
}
