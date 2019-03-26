// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require('axios')
const { formatDate } = require('../utils')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const { cardNumber } = event

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

  const result = await axios.post(
    'http://query.shenzhentong.com:8080/sztnet/qryCard.do',
    { cardno: cardNumber },
    {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }
  )
  let matchResult = String(result.data).match(
    new RegExp('(?<=<td bgcolor="#FFFFFF">).*?(?=</td>)', 'gm')
  )
  if (!matchResult) {
    return {
      code: 0,
      message: '查询失败，请重试'
    }
  }

  return {
    code: 1,
    message: '查询成功',
    data: {
      cardNumber: matchResult[0],
      cardBalance: Number(matchResult[1].slice(0, -1)),
      cardValidity: matchResult[2],
      currentTime: formatDate(Date.now()),
      updateTime:
        result.match(
          /[0-9]{4}[-][0-9]{1,2}[-][0-9]{1,2}[ ][0-9]{1,2}[:][0-9]{1,2}[:][0-9]{1,2}/gm
        )[0] || ''
    }
  }
}
