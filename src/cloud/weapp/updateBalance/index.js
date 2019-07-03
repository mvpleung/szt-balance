/**
 * 定时器，自动更新数据库账号余额
 */
const { getSzt, Cloud } = require('./utils/index')

const env = 'szt-balance-ac8d11' //dev 环境
// const env = 'szt-prod-994210' //prod 环境
const cloud = Cloud.init(env)
const collection = cloud.db.collection('szt-balance')

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    let { data: list } = await collection.get()

    //数据存在数据时，自动调用
    if (list.length > 0) {
      let result = []
      //async await 的问题
      //这里抛弃 forEach 的写法，原因是 forEach 里的操作将会是并发执行，所以改成 for 为 继发执行
      for (let { _id, cardNumber } of list) {
        let {
          code,
          data: { cardBalance, cardValidity, currentTime, updateTime } = {}
        } = await getSzt(cardNumber)
        if (code === 1) {
          let {
            stats: { updated }
          } = await collection.doc(_id).update({
            data: {
              cardBalance,
              cardValidity,
              currentTime,
              updateTime
            }
          })
          result.push({
            _id,
            cardNumber,
            updated
          })
        }
      }
      return { env, result }
    }
    return false
  } catch (error) {
    console.error(error)
  }
}
