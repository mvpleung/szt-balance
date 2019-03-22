import Taro from '@tarojs/taro'
import { ApiResult } from 'src/typings'

const callback = (resolve, reject) => {
  return {
    success: res => {
      let data = res.data || res.result
      if (!data.code || data.code === 0) {
        Taro.showToast({
          title: data.message || '请求失败',
          duration: 3000,
          icon: 'none'
        })
        reject(data.message)
        return
      }
      resolve(data)
    },
    fail: err => {
      Taro.showToast({
        title: err.message || '请求失败',
        duration: 3000,
        icon: 'none'
      })
      reject(err)
    },
    complete: () => {
      Taro.hideLoading()
    }
  }
}

/**
 * Get 请求
 * @param url 请求地址
 * @param params 请求参数
 * @param config 其他配置
 */
export const get = (
  url: string,
  params?: any,
  config: any = {}
): Promise<ApiResult> => {
  Taro.showLoading({
    title: '请求中...',
    mask: true
  })
  config.url = url
  config.data = params
  return new Promise((resolve, reject) => {
    Taro.request({
      ...config,
      ...callback(resolve, reject)
    })
  })
}

export const wxCloud = (
  param: RQ<ICloud.CallFunctionParam>,
  showLoading: boolean = true
): Promise<ApiResult> => {
  showLoading &&
    Taro.showLoading({
      title: '请求中...',
      mask: true
    })
  if (!param.data) {
    param.data = { env: process.env.CLOUE_ENV }
  } else {
    param.data.env = process.env.CLOUE_ENV
  }
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      ...param,
      ...callback(resolve, reject)
    })
  })
}
