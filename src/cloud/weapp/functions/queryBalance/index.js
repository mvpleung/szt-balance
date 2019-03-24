/**
 * 查询公交卡余额
 */
const { getSzt } = require('../utils')

// 云函数入口函数
exports.main = async ({ cardNumber, collection, OPENID, APPID }, context) => {
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

  let result = await getSzt(cardNumber)

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
    if (result.code === 0) {
      let {
        data: [item]
      } = await collection
        .where({
          openid: OPENID,
          appid: APPID,
          cardNumber
        })
        .get()
      item &&
        item.cardNumber &&
        (result = {
          code: 1,
          data: item
        })
    }
  }
  return result
}
