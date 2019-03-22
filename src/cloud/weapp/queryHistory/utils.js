const cloud = require('wx-server-sdk')

let Utils = {
  init() {
    !this.axios &&
      ((this.axios = require('axios')), (this.axios.defaults.timeout = 60000))
    !this.cheerio && (this.cheerio = require('cheerio'))
    !this.moment && (this.moment = require('moment'))
    return {
      axios: this.axios,
      cheerio: this.cheerio,
      moment: this.moment
    }
  }
}

/**
 * 获取余额信息
 * @param cardNumber 卡号
 */
exports.get = async cardNumber => {
  let { axios, cheerio, moment } = Utils.init()
  let result
  try {
    result = await axios.get(
      `http://query.shenzhentong.com:8080/sztnet/qryCard.do?cardno=${cardNumber}`
    )
    let _$ = cheerio.load(result.data)
    //执行 html 查找转换
    let $table = _$('html').find('.tableact')
    if (!$table || $table.length === 0) {
      return {
        code: 0,
        message: '未查询到记录，请重试'
      }
    }

    let $td = $table.find('td:nth-child(even)')

    return {
      code: 1,
      message: '查询成功',
      data: {
        cardNumber: _$($td[0]).html(),
        cardBalance: Number(
          _$($td[1])
            .html()
            .replace('&#x52A;', '')
        ),
        cardValidity: _$($td[2]).html(),
        currentTime: moment()
          .utcOffset(480)
          .format('YYYY-MM-DD HH:mm:ss'),
        updateTime:
          $table
            .find('#cardRealAmt')
            .html()
            .match(
              /[0-9]{4}[-][0-9]{1,2}[-][0-9]{1,2}[ ][0-9]{1,2}[:][0-9]{1,2}[:][0-9]{1,2}/gm
            )[0] || ''
      }
    }
  } catch (error) {
    return {
      code: 0,
      message: error.message || '查询失败，请重试'
    }
  }
}

/**
 * 初始化数据库
 * @param env 环境
 * @param collection 集合名称
 */
exports.initCloud = async (env, collection = 'szt-balance') => {
  let db = cloud._$db
  if (!db || !cloud.inited) {
    cloud.init({
      env
    })
    db = cloud.database()
    try {
      await db.createCollection(collection)
    } catch (error) {}
    cloud._$db = db
  }
  !db._$collection && (db._$collection = db.collection(collection))
  const { OPENID, APPID } = cloud.getWXContext()
  return {
    db,
    collection: db._$collection,
    OPENID,
    APPID
  }
}
