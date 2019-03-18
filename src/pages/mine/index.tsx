import Taro, { Component } from '@tarojs/taro'
import './index.scss'
import { View, Image, Text, Icon } from '@tarojs/components'

interface State {
  cardNumber: string
  userInfo: any
}

export default class Nav extends Component {
  state: State

  constructor() {
    super()
    this.setState({
      history: Taro.getStorageSync('history') || []
    })
  }

  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}
  /**
   * 获取用户信息
   */
  getUserDatas(): void {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.state.userInfo = res.userInfo
              console.log(999, res)
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              // if (this.userInfoReadyCallback) {
              //   this.userInfoReadyCallback(res)
              // }
            }
          })
        } else {
          console.log(88888, res)
        }
      }
    })
  }
  // App({
  //   onLaunch(): void{
  //     // 展示本地存储能力
  //     var logs = wx.getStorageSync('logs') || []
  //     logs.unshift(Date.now())
  //     wx.setStorageSync('logs', logs)

  //     // 登录
  //     wx.login({
  //       success: res => {
  //         // 发送 res.code 到后台换取 openId, sessionKey, unionId
  //       }
  //     })
  //     // 获取用户信息
  //     wx.getSetting({
  //       success: res => {
  //         if (res.authSetting['scope.userInfo']) {
  //           // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
  //           wx.getUserInfo({
  //             success: res => {
  //               // 可以将 res 发送给后台解码出 unionId
  //               this.globalData.userInfo = res.userInfo

  //               // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
  //               // 所以此处加入 callback 以防止这种情况
  //               if (this.userInfoReadyCallback) {
  //                 this.userInfoReadyCallback(res)
  //               }
  //             }
  //           })
  //         }
  //       }
  //     })
  //   },
  //   globalData: {
  //     userInfo: null
  //   }
  // })

  render() {
    return (
      <View className='mine viewBox'>
        <Image
          style='width: 300px;height: 100px;background: #fff;'
          src='{{userInfo.avatarUrl}}'
          mode='scaleToFill'
        />
        <Text>"userInfo.nickName"</Text>
        <Icon
          className='icon'
          type='search'
          color='#409EFF'
          size='20'
          onClick={this.getUserDatas}
        />
      </View>
    )
  }
}
