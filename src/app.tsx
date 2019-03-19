import Taro, { Component } from '@tarojs/taro'
import Index from './pages/index'

import './app.scss'
import { WeAppConfig } from './typings'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {
  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: WeAppConfig = {
    pages: [
      'pages/index/index'
      // 'pages/history/index',
      // 'pages/invoice/index',
      // 'pages/mine/index'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    },
    cloud: true
    // tabBar: {
    //   list: [
    //     {
    //       pagePath: 'pages/index/index',
    //       text: '查询',
    //       iconPath: 'static/search.png',
    //       selectedIconPath: 'static/search_red.png'
    //     },
    //     {
    //       pagePath: 'pages/history/index',
    //       text: '历史',
    //       iconPath: 'static/history.png',
    //       selectedIconPath: 'static/history_red.png'
    //     },
    //     {
    //       pagePath: 'pages/invoice/index',
    //       text: '发票',
    //       iconPath: 'static/card.png',
    //       selectedIconPath: 'static/card_red.png'
    //     },

    //     {
    //       pagePath: 'pages/mine/index',
    //       text: '我的',
    //       iconPath: 'static/my.png',
    //       selectedIconPath: 'static/my_red.png'
    //     }
    //   ]
    // }
  }

  componentDidMount() {
    wx.cloud.init({
      env: process.env.CLOUE_ENV,
      traceUser: true
    })

    const updateManager = wx.getUpdateManager()
    updateManager.onUpdateReady(() => {
      Taro.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
  }

  componentDidShow() {}

  componentDidHide() {}

  componentDidCatchError() {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return <Index />
  }
}

Taro.render(<App />, document.getElementById('app'))
