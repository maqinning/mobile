var timeago = require('timeago.js') // 采用import的方式有些问题
const currentTime = new Date().getTime() // 记录当前时间
// 获取时间的字符串类型
export function getFullDate (date) {
  if (date.constructor === Date) {
    var year = date.getFullYear()
    var month = (date.getMonth() + 1).toString()
    var day = (date.getDate()).toString()
    if (month.length === 1) {
      month = '0' + month
    }
    if (day.length === 1) {
      day = '0' + day
    }
    var dateTime = year + '-' + month + '-' + day
    return dateTime
  }
  return date
}
// 将日期变成中文描述性格式
export function formatDate (date) {
  date = date ? new Date(date.replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')) : new Date()
  return timeago.format(date, 'zh_CN')
}
// 获取阅读时间
export function getReadTime () {
  let time = new Date().getTime() - currentTime
  return parseInt(time / 1000 / 60) + '分钟'
}
