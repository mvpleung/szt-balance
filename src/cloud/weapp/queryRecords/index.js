/**
 * 查询微信openid所属历史记录列表
 */
const { initCloud } = require('./utils')

// 云函数入口函数
exports.main = async ({ env }, context) => {
  let { collection, OPENID, APPID } = await initCloud(env)

  let { data } = await collection
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
