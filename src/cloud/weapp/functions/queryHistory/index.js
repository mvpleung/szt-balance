/**
 * 查询账号历史查询记录
 */

// 云函数入口函数
exports.main = async ({ collection, OPENID, APPID }, context) => {
  // let history = await collection
  //   .where({
  //     openid: OPENID,
  //     appid: APPID
  //   })
  //   .get()
  // return {
  //   code: 1,
  //   data: [...new Set(history.data.map(item => item.cardNumber))]
  // }

  let history = await collection
    .where({
      openid: OPENID,
      appid: APPID
    })
    .get()

  return {
    code: 1,
    data: [...new Set(history.data.map(item => item.cardNumber))]
  }
}
