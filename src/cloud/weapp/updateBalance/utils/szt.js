/**
 * 解析深圳通官网 JSP 页面获取余额信息
 */

const axios = require('axios')
const cheerio = require('cheerio')
const moment = require('moment')

/**
 * 获取深圳通余额
 * @param cardNumber 深圳通卡号
 */
exports.getSzt = async cardNumber => {
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
        currentTime: moment()
          .utcOffset(480)
          .format('YYYY-MM-DD HH:mm:ss'),
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
