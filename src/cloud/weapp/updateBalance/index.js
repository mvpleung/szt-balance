/**
 * 定时器，自动更新数据库账号余额
 */
const { get, initCloud } = require('./utils')

// 云函数入口函数
exports.main = async ({ env }, context) => {
  let { collection } = await initCloud(env)
  let { data: list } = await collection.get()

  //数据存在数据时，自动调用
  if (list.length > 0) {
    //async await 的问题
    //这里抛弃 forEach 的写法，原因是 forEach 里的操作将会是并发执行，所以改成 for 为 继发执行
    for (let { _id, cardNumber } of list) {
      let {
        code,
        data: { cardBalance, cardValidity, currentTime, updateTime } = {}
      } = await get(cardNumber)
      code === 1 &&
        (await collection.doc(_id).update({
          data: {
            cardBalance,
            cardValidity,
            currentTime,
            updateTime
          }
        }))
    }
    return true
  }
  return false
}
