const axios = require('axios')
const cheerio = require('cheerio')

axios.defaults.timeout = 60000

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

/**
 * 获取余额信息
 * @param cardNumber 卡号
 */
exports.get = async cardNumber => {
  let result
  try {
    result = await axios.get(
      `http://query.shenzhentong.com:8080/sztnet/qryCard.do?cardno=${cardNumber}`
    )
    let _$ = cheerio.load(result.data)
    //执行 html 查找转换
    let $table = _$('html').find('.tableact')
    if (!$table || $table.length === 0) {
      return {
        code: 0,
        message: '未查询到记录，请重试'
      }
    }

    let $td = $table.find('td:nth-child(even)')

    return {
      code: 1,
      message: '查询成功',
      data: {
        cardNumber: _$($td[0]).html(),
        cardBalance: Number(
          _$($td[1])
            .html()
            .replace('&#x52A;', '')
        ),
        cardValidity: _$($td[2]).html(),
        currentTime: exports.formatDate(Date.now()),
        updateTime:
          $table
            .find('#cardRealAmt')
            .html()
            .match(
              /[0-9]{4}[-][0-9]{1,2}[-][0-9]{1,2}[ ][0-9]{1,2}[:][0-9]{1,2}[:][0-9]{1,2}/gm
            )[0] || ''
      }
    }
  } catch (error) {
    return {
      code: 0,
      message: error.message || '查询失败，请重试'
    }
  }
}
