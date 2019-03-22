/**
 * 查询微信openid所属历史记录列表
 */
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const { OPENID, APPID } = cloud.getWXContext()

  let { data } = await db
    .collection('szt-balance')
    .where({
      openid: OPENID,
      appid: APPID
    })
    .get()

  return {
    code: 1,
    data
  }
}
