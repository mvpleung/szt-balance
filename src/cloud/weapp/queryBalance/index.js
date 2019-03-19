/**
 * 查询公交卡余额
 */
const cloud = require('wx-server-sdk')
const { get } = require('./utils')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  let { cardNumber } = event
  const { OPENID, APPID } = cloud.getWXContext()

  cardNumber = String(cardNumber)

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

  let result = await get(cardNumber)

  let collection = db.collection('szt-balance')
  let { total } = await collection
    .where({
      openid: OPENID,
      appid: APPID,
      cardNumber
    })
    .count()

  //数据库没有数据，插入获取到的数据
  if (total <= 0) {
    //仅当接口返回数据时再插入
    result.code === 1 &&
      (await collection.add({
        data: {
          openid: OPENID,
          appid: APPID,
          ...result.data
        }
      }))
  } else {
    //接口返回数据时，更新数据库数据
    result.code === 1 &&
      (await collection
        .where({
          openid: OPENID,
          appid: APPID,
          cardNumber
        })
        .update({
          data: {
            ...result.data
          }
        }))
    //接口没有返回数据时，查询数据库记录
    result.code === 0 &&
      (result = {
        code: 1,
        data: await collection
          .where({
            openid: OPENID,
            appid: APPID,
            cardNumber
          })
          .get().data
      })
  }
  result.code === 1 &&
    (!result.data || !result.data.cardNumber) &&
    (result = {
      code: 0,
      message: '未查询到记录，请重试'
    })
  return result
}
