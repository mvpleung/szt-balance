/**
 * 统一初始化cloud，env 环境在这里处理
 */

const cloud = require('wx-server-sdk')

/**
 * 初始化数据库
 * @param env 环境
 * @param collection 集合名称
 */
exports.initCloud = async (env, collection = 'szt-balance') => {
  let db = this._$db
  if (!db || !cloud.inited) {
    cloud.init({
      env
    })
    db = cloud.database()
    try {
      await db.createCollection(collection)
    } catch (error) {}
    this._$db = db
  }
  ;(!this._$collection || this._$collName !== collection) &&
    (this._$collection = db.collection(collection))
  this._$collName = collection
  return {
    db,
    collection: this._$collection,
    ...cloud.getWXContext()
  }
}
