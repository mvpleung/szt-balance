import Taro, {
  Component,
  Config,
  ShareAppMessageObject,
  ShareAppMessageReturn
} from '@tarojs/taro'
import { View, Input, Icon, Text } from '@tarojs/components'
import SwipperCard from '@/components/card/SwipperCard'
import './index.scss'
import { isEmpty, wxCloud } from '@/utils'
import { QueryInfo } from '@/typings'
import { BaseEventOrig } from '@tarojs/components/types/common'

export default class Index extends Component {
  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '查询深圳通余额',
    enablePullDownRefresh: true
  }

  state: QueryInfo

  constructor() {
    super()
    this.updateHistory()
  }

  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  onShareAppMessage(_object: ShareAppMessageObject): ShareAppMessageReturn {
    return {
      title: '深圳通余额查询',
      path: '/pages/index/index'
    }
  }

  /**
   * 更新历史
   * @param e
   */
  updateHistory(complete?: Function, isPullDown?: boolean): void {
    wxCloud(
      {
        name: 'queryRecords'
      },
      !isPullDown
    )
      .then(resp => {
        this.setState({
          records: resp.data
        })
        complete && complete()
      })
      .catch(error => complete && complete(error))
  }

  /**
   * 更新卡号
   * @param e 事件
   */
  inputChange(e: BaseEventOrig<any>): void {
    this.setState({
      cardNumber: e.detail.value
    })
  }

  /**
   * 查询卡号信息
   */
  search(): void {
    let { cardNumber } = this.state
    if (!isEmpty(cardNumber)) {
      wxCloud({
        name: 'queryBalance',
        data: {
          cardNumber
        }
      }).then(resp => {
        let cardInfo = resp.data
        this.setState({
          records: [cardInfo].concat(
            this.state.records.filter(
              record => record.cardNumber !== cardInfo.cardNumber
            )
          )
        })
      })
    } else {
      Taro.showToast({
        title: '请输入卡号',
        icon: 'none'
      })
    }
  }

  /**
   * 监听用户下拉刷新
   */
  onPullDownRefresh(): void {
    this.updateHistory(() => Taro.stopPullDownRefresh(), true)
  }

  /**
   * 卡片删除成功回调
   * @param cardNumber 卡号
   */
  onCardDelete(cardNumber: string): void {
    let records = this.state.records
    this.setState({
      records: records.filter(record => record.cardNumber != cardNumber)
    })
  }

  render() {
    return (
      <View className='index'>
        <View className='content-input'>
          <Input
            type='number'
            value={this.state.cardNumber}
            onInput={this.inputChange}
            placeholder='输入深圳通卡号(括号前面的数字)'
            confirm-type='search'
          />
          <Icon
            className='icon'
            type='search'
            color='#409EFF'
            size='20'
            onClick={this.search}
          />
        </View>
        <SwipperCard
          records={this.state.records}
          styleObj={{ marginTop: '60rpx' }}
          onDelete={this.onCardDelete}
        />
        <View className='content-row-notice'>
          <Text className='noticeTxt'>
            注：本查询结果均来自于官方最近更新的数据，偶有查询失败，请尝试再次查询
          </Text>
        </View>
      </View>
    )
  }
}
