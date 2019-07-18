// 节流函数
export default function throttle (fn, context, param = [], delay = 500, mustApplyTime = 1000) {
  fn.timer && clearTimeout(fn.timer)
  fn._cur = Date.now()
  fn._start = fn._start || fn._cur
  if (fn._cur - fn._start > mustApplyTime) {
    fn.apply(context, param)
    fn._start = fn._cur
  } else {
    fn.timer = setTimeout(function () {
      fn.apply(context, param)
    }, delay)
  }
}
