import Taro, {
  PureComponent,
  Config,
  ShareAppMessageObject,
  ShareAppMessageReturn
} from '@tarojs/taro'
import { View, Input, Icon, Text } from '@tarojs/components'
import SwiperCard from '@/components/card/SwiperCard'
import './index.scss'
import { isEmpty, wxCloud } from '@/utils'
import { QueryInfo } from '@/typings'
import { BaseEventOrig } from '@tarojs/components/types/common'

//吐个槽反馈插件（https://tucao.qq.com/dashboard/statistic/dataOverview）
// const Tucao = requirePlugin('tucao').default

export default class Index extends PureComponent {
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

  swiperCard: SwiperCard | null

  constructor() {
    super()
  }

  componentWillMount() {
    this.updateHistory()
    this.getHistory()
  }

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
        this.swiperCard &&
          this.swiperCard.setState({
            current: 0
          })
        complete && complete()
      })
      .catch(error => complete && complete(error))
  }

  /**
   * 查询历史
   * @param e
   */
  getHistory(): void {
    wxCloud(
      {
        name: 'queryHistory'
      },
      false
    ).then(resp =>
      this.setState({
        history: resp.data
      })
    )
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
   * 输入框聚焦时触发
   * @param e 事件
   */
  onInputfocus(): void {
    this.setState({
      showHistory: this.state.history && this.state.history.length > 0,
      cardNumber: ''
    })
  }

  /**
   * 输入框失去焦点时触发
   * @param e 事件
   */
  onInputblur(): void {
    this.setState({
      showHistory: false
    })
  }

  /**
   * 历史搜索
   */
  historySearch(cardNumber: string): void {
    if (!isEmpty(cardNumber)) {
      this.setState(
        {
          cardNumber
        },
        () => {
          this.search()
        }
      )
    }
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
      })
        .then(resp => {
          let cardInfo = resp.data
          let { history } = this.state
          history.push(cardInfo.cardNumber)
          this.setState({
            records: [cardInfo].concat(
              this.state.records.filter(
                record => record.cardNumber !== cardInfo.cardNumber
              )
            ),
            history: [...new Set(history)],
            cardNumber: ''
          })
          this.swiperCard &&
            this.swiperCard.setState({
              current: 0
            })
          this.onInputblur()
        })
        .catch(_error => this.onInputblur())
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

  /**
   * 跳转反馈
   */
  feedback(e: BaseEventOrig<any>): void {
    e.stopPropagation()
    // Taro.navigateTo({
    //   url: Tucao.getUrl({
    //     productId: '57294'
    //   })
    // })
    Taro.navigateToMiniProgram({
      appId: 'wx8abaf00ee8c3202e',
      extraData: {
        id: '57294'
      }
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
            max-length='12'
            onFocus={this.onInputfocus}
            onBlur={this.onInputblur}
          />
          <Icon
            className='icon'
            type='search'
            color='#409EFF'
            size='20'
            onClick={this.search}
          />
        </View>
        <View
          className='history'
          style={
            this.state.showHistory ? 'display: inline-flex' : 'display: none'
          }
        >
          {this.state.history.map(item => (
            <Text
              key={item}
              className='history-item'
              onClick={this.historySearch.bind(this, item)}
            >
              {item}
            </Text>
          ))}
        </View>
        <SwiperCard
          ref={child => {
            this.swiperCard = child
          }}
          records={this.state.records}
          styleObj={{
            marginTop: '60rpx',
            opacity: this.state.showHistory ? 0.7 : 1.0
          }}
          onDelete={this.onCardDelete}
        />
        <View className='content-row-notice'>
          <Text className='noticeTxt'>
            注：本查询结果均来自于官方最近更新的数据，偶有查询失败，请尝试再次查询。
          </Text>
          <Text className='link' onClick={this.feedback}>
            我要吐槽
          </Text>
        </View>
      </View>
    )
  }
}
