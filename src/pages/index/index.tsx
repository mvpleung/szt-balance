import Taro, { Component, Config } from '@tarojs/taro'
import { View, Input, Icon, Text } from '@tarojs/components'
import './index.scss'
import { isEmpty, get, lowBalance } from '../../utils'

interface State {
  cardNumber: string
  cardInfo: any
  history: Array<string>
}

export default class Index extends Component {
  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '首页'
  }

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
   * 更新卡号
   * @param e 事件
   */
  inputChange(e): void {
    this.setState({
      cardNumber: e.target.value
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
      get(`https://api.apijs.cn/shenzhentong/${cardNumber}`).then(resp => {
        let { history } = this.state
        history.push(resp.data.card_number)
        this.setState(
          {
            history: [...new Set(history)]
          },
          () => {
            Taro.setStorage({ key: 'history', data: this.state.history })
          }
        )
        this.setState({
          cardInfo: resp.data
        })
      })
    } else {
      Taro.showToast({
        title: '请输入卡号',
        icon: 'none'
      })
    }
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
        <View className='history'>
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
        {this.state.cardInfo && (
          <View className='content-info'>
            <View className='content-row'>
              <Text>深圳通卡号</Text>
              <Text>{this.state.cardInfo.card_number}</Text>
            </View>
            <View className='content-row'>
              <Text>深圳通余额</Text>
              <Text
                className={
                  lowBalance(this.state.cardInfo.card_balance)
                    ? 'content-red'
                    : ''
                }
              >
                {this.state.cardInfo.card_balance}
              </Text>
            </View>
            <View className='content-row'>
              <Text>更新时间</Text>
              <Text>{this.state.cardInfo.balance_time}</Text>
            </View>
            <View className='content-row'>
              <Text>卡片有效期</Text>
              <Text>{this.state.cardInfo.card_validity}</Text>
            </View>
            <View className='content-row'>
              <Text>查询时间</Text>
              <Text>{this.state.cardInfo.current_time}</Text>
            </View>
          </View>
        )}
      </View>
    )
  }
}
