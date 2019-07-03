/**
 * 查询微信openid所属历史记录列表
 */

// 云函数入口函数
exports.main = async ({ db, OPENID, APPID }, context) => {
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
