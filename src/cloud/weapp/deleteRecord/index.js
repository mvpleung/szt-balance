/**
 * 删除微信openid所属历史记录
 */
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  let { cardNumber } = event
  const { OPENID, APPID } = cloud.getWXContext()

  let { stats: { removed } } = await db
    .collection('szt-balance')
    .where({
      openid: OPENID,
      appid: APPID,
      cardNumber
    })
    .remove()

  if (removed >= 1) {
    return {
      code: 1,
      message: '删除成功'
    }
  }
  return {
    code: 0,
    message: '记录不存在'
  }
}
