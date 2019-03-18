/**
 * 日期格式化
 * @param {String} fmt 日期格式
 */
Date.prototype.Format = function(fmt = 'yyyy-MM-dd') {
  //author: meizz
  let o = {
    'M+': this.getMonth() + 1, //月份
    'd+': this.getDate(), //日
    'h+': this.getHours(), //小时
    'm+': this.getMinutes(), //分
    's+': this.getSeconds(), //秒
    'q+': Math.floor((this.getMonth() + 3) / 3), //季度
    S: this.getMilliseconds() //毫秒
  }
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      String(this.getFullYear()).substr(4 - RegExp.$1.length)
    )
  for (let k in o)
    if (new RegExp('(' + k + ')').test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1
          ? o[k]
          : ('00' + o[k]).substr(String(o[k]).length)
      )
  return fmt
}

/**
 * 格式化时间
 * @param {Number|Date} unixTime 日期或时间戳
 * @param {String} pattern 日期格式规则(如:YYYY-MM-dd)
 * @return {*}
 */
exports.formatDate = (unixTime, pattern = 'yyyy-MM-dd') => {
  if (unixTime instanceof Date) {
    return unixTime.Format(pattern)
  }
  if (
    Object.prototype.toString.call(unixTime) === '[object String]' &&
    unixTime
  ) {
    if (unixTime.length === 8) {
      unixTime =
        unixTime.substring(0, 4) +
        '-' +
        unixTime.substring(4, 6) +
        '-' +
        unixTime.substring(6, 8)
    }
  }
  return !unixTime || !unixTime ? '' : new Date(unixTime).Format(pattern)
}
