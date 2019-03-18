// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require('axios')
const cheerio = require('cheerio')
const { formatDate } = require('./utils')

cloud.init()

const db = cloud.database({
  env: 'szt-balance-ac8d11'
})

axios.defaults.timeout = 60000

// 云函数入口函数
exports.main = async (event, context) => {
  let { cardNumber } = event
  const { OPENID, APPID } = cloud.getWXContext()

  cardNumber = String(cardNumber)

  if (!cardNumber) {
    return {
      code: 0,
      message: '卡号不能为空'
    }
  }
  if (cardNumber.length != 9 && cardNumber.length != 12) {
    return {
      code: 0,
      message: '卡号长度必须为9位或者12位！'
    }
  }

  let result
  try {
    result = await axios.post(
      'http://query.shenzhentong.com:8080/sztnet/qryCard.do',
      { cardno: cardNumber }
    )
    let _$ = cheerio.load(result)
    //执行 html 查找转换
    let $table = _$('html').find('.tableact')
    if (!$table || $table.length === 0) {
      return {
        code: 0,
        message: '未查询到记录，请重试'
      }
    }

    let $td = $table.find('td:nth-child(even)')

    result = {
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
        currentTime: formatDate(Date.now()),
        updateTime:
          $table
            .find('#cardRealAmt')
            .html()
            .match(
              /[0-9]{4}[-][0-9]{1,2}[-][0-9]{1,2}[ ][0-9]{1,2}[:][0-9]{1,2}[:][0-9]{1,2}/gm
            )[0] || ''
      }
    }

    //获取成功，存入数据库，用于历史显示
    db.collection('szt-cardno').add({
      data: {
        openid: OPENID,
        appid: APPID,
        cardNumber
      }
    })

    return result
  } catch (error) {
    return {
      code: 0,
      message: error.message || '查询失败，请重试'
    }
  }
}
