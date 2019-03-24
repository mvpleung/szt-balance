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

/**
 * 微信云函数调用
 * @param param 云函数参数 { name, data}
 * @param showLoading 是否显示 loading，默认为 true
 * @param independent 是否为独立函数（非 functions 集合云函数）,默认为 false
 */
export const wxCloud = (
  param: RQ<ICloud.CallFunctionParam>,
  showLoading: boolean = true,
  independent: boolean = false
): Promise<ApiResult> => {
  showLoading &&
    Taro.showLoading({
      title: '请求中...',
      mask: true
    })
  if (!param.data) {
    param.data = independent
      ? { env: process.env.CLOUE_ENV }
      : { call: param.name, env: process.env.CLOUE_ENV, data: {} }
  } else {
    param.data = independent
      ? {
          ...param.data,
          env: process.env.CLOUE_ENV
        }
      : {
          call: param.name,
          env: process.env.CLOUE_ENV,
          data: { ...param.data }
        }
  }
  !independent && (param.name = 'functions')
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      ...param,
      ...callback(resolve, reject)
    })
  })
}
