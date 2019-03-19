import Taro, { Component } from '@tarojs/taro'
import './index.scss'
import { View, Image, Text, Icon, Button } from '@tarojs/components'

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

  componentWillMount() {
    this.getUserDatas()
  }

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}
  /**
   * 获取用户信息
   */
  getUserDatas(): void {
    // 展示本地存储能力
    var _this = this
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.record']) {
          wx.authorize({
            scope: 'scope.record',
            success() {
              // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
              // wx.startRecord()
              console.log('授权完成')
            }
          })
        } else {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              _this.setState({
                userInfo: res.userInfo
              })
              console.log('成功获取用户信息', res)
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              // if (this.userInfoReadyCallback) {
              //   this.userInfoReadyCallback(res)
              // }
            }
          })
        }
      }
    })
  }

  render() {
    return (
      <View className='mine viewBox'>
        <View className='picMine'>
          <Image
            src={this.state.userInfo.avatarUrl}
            mode='scaleToFill'
            open-data='getUserInfo'
          />
        </View>

        <Text>{this.state.userInfo.nickName}</Text>
      </View>
    )
  }
}
