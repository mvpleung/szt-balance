/// <reference path="./lib.wa.es6.d.ts" />
/// <reference path="./wx/index.d.ts" />
import { Config } from '@tarojs/taro'

export = Szt
export as namespace Szt

declare namespace Szt {
  /**
   * API返回值
   */
  interface ApiResult {
    code: number
    message: string
    data?: any
  }

  /**
   *  小程序配置信息
   */
  interface WeAppConfig extends Config {
    /**
     * 小程序云能力兼容配置
     */
    cloud: boolean
  }

  /**
   * 深圳通查询信息
   */
  interface QueryInfo {
    /**
     * 深圳通卡号
     */
    cardNumber: string
    /**
     * 深圳通卡片信息
     */
    cardInfo: CardInfo
    /**
     * 查询历史
     */
    history: Array<string>
  }

  /**
   * 深圳通卡片信息
   */
  interface CardInfo {
    /**
     * 卡号
     */
    cardNumber: string
    /**
     * 余额
     */
    cardBalance: number
    /**
     * 余额更新时间
     */
    updateTime: string
    /**
     * 卡片有效期
     */
    cardValidity: string
    /**
     * 查询时间
     */
    currentTime: string
  }
}
