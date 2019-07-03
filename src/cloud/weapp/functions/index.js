// 云函数统一入口，此处用于函数分发
const { Cloud } = require('./utils/index')

let functions = {}

// 云函数入口函数
exports.main = async ({ call, env, data }, context) => {
  try {
    !functions[call] && (functions[call] = require(`./${call}`).main)
    if (!functions[call]) {
      return {
        code: 0,
        message: `云函数[${call}]不存在`
      }
    }
    const cloud = Cloud.init(env)
    return await functions[call]({ ...cloud, ...data }, context)
  } catch (error) {
    return {
      code: 0,
      message: error.message
    }
  }
}
