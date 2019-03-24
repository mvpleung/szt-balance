// 云函数统一入口，此处用于函数分发
const { initCloud } = require('./utils/index')

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
    return functions[call]({ ...(await initCloud(env)), ...data }, context)
  } catch (error) {
    return {
      code: 0,
      message: error.message
    }
  }
}
