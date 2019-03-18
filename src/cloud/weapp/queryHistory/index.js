// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database({
  env: 'szt-balance-ac8d11'
})

// 云函数入口函数
exports.main = async (event, context) => {
  const { OPENID, APPID } = cloud.getWXContext()

  let history = await db
    .collection('szt-cardno')
    .where({
      openid: OPENID,
      appid: APPID
    })
    .get()
  return {
    code: 1,
    data: history.data.map(item => item.cardNumber)
  }
}
