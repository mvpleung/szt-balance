/**
 * 查询公交卡余额
 */
const { getSzt } = require('../utils')

/**
 * 存入历史记录
 * @param {string} cardNumber 深圳通卡号
 * @param {string} openid 微信用户ID
 * @param {string} appid  应用ID
 */
let saveHistory = async (db, cardNumber, openid, appid) => {
  let _collection = db.collection('szt-history')
  let { total } = await _collection
    .where({
      openid,
      appid,
      cardNumber
    })
    .count()
  if (total > 0) {
    await _collection
      .where({
        openid,
        appid,
        cardNumber
      })
      .update({
        data: {
          updateTime: db.serverDate()
        }
      })
  } else {
    await _collection.add({
      data: {
        openid,
        appid,
        cardNumber,
        createTime: db.serverDate(),
        updateTime: db.serverDate()
      }
    })
  }
}

// 云函数入口函数
exports.main = async (
  { db, cardNumber, collection, OPENID, APPID },
  context
) => {
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

  //如果查询到就存入历史表
  if (result.code === 1) {
    await saveHistory(db, cardNumber, OPENID, APPID)
  }

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
