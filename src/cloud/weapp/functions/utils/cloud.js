/**
 * 统一初始化cloud，env 环境在这里处理
 */

const cloud = require('wx-server-sdk')

const dbMap = new WeakMap()
const collectMap = new WeakMap()

/**
 * 包装 DataBase
 * @param {Object} db 数据库实例
 */
let convertDb = (db, self) => {
  return {
    ...db,
    collection: collectionName => {
      let collection = collectMap.get(self)
      if (!collection || !collection[collectionName]) {
        collection = collection || {}
        collection[collectionName] = db.collection(collectionName)
        collectMap.set(self, collection)
      }
      return collection[collectionName]
    }
  }
}

/**
 * 云函数调用工具
 */
exports.Cloud = {
  /**
   * 初始化云环境
   * @param {String} env 执行环境ID
   */
  init(env) {
    let self = this,
      db = dbMap.get(self)
    if (!db || (db && db.cloud && !db.cloud.inited)) {
      cloud.init({
        env
        // secretId: 'AKIDsLwIZe5h5QdfBZuxNjy82i5MX7UdCjuT',
        // secretKey: 'SeP9X4M7D4fzwylIthMzSXM4ZFm44vUX'
      })
      dbMap.set(self, convertDb(cloud.database(), self))
    }
    return {
      ...cloud.getWXContext(),
      db: dbMap.get(self)
    }
  }
}
