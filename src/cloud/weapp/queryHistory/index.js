// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const { OPENID, APPID } = cloud.getWXContext()

  // let history = await db
  //   .collection('szt-cardno')
  //   .where({
  //     openid: OPENID,
  //     appid: APPID
  //   })
  //   .get()
  // return {
  //   code: 1,
  //   data: [...new Set(history.data.map(item => item.cardNumber))]
  // }

  let history = await db
    .collection('szt-balance')
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
