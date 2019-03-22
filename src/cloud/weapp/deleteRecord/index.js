/**
 * 删除微信openid所属历史记录
 */
const { initCloud } = require('./utils')

// 云函数入口函数
exports.main = async ({ cardNumber, env }, context) => {
  let { collection, OPENID, APPID } = await initCloud(env)

  if (!cardNumber) {
    return {
      code: 0,
      message: '卡号不能为空'
    }
  }

  let {
    stats: { removed }
  } = await collection
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
