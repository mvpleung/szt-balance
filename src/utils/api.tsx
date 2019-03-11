import Taro from '@tarojs/taro'

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
): Promise<any> => {
  Taro.showLoading({
    title: '请求中...',
    mask: true
  })
  config.url = url
  config.data = params
  return new Promise((resolve, reject) => {
    Taro.request({
      ...config,
      success: res => {
        let { data } = res
        if (!!data.code || data.code !== 0) {
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
    })
  })
}
