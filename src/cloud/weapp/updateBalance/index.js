/**
 * 定时器，自动更新数据库账号余额
 */
const cloud = require('wx-server-sdk')
const { get } = require('./utils')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  let collection = db.collection('szt-balance')
  let { data: list } = await collection.get()

  //数据存在数据时，自动调用
  if (list.length > 0) {
    list.forEach(async item => {
      let {
        code,
        data: { cardBalance, cardValidity, currentTime, updateTime }
      } = await get(item.cardNumber)
      code === 1 &&
        (await collection.doc(item._id).update({
          data: {
            cardBalance,
            cardValidity,
            currentTime,
            updateTime
          }
        }))
    })
  }

  return true
}
