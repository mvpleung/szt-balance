import Taro, {
  Component,
  Config,
  ShareAppMessageObject,
  ShareAppMessageReturn
} from '@tarojs/taro'
import { View, Input, Icon, Text } from '@tarojs/components'
import './index.scss'
import { isEmpty, wxCloud } from '../../utils'
import { QueryInfo } from 'src/typings'

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

  state: QueryInfo

  constructor() {
    super()
    // this.setState({
    //   history: Taro.getStorageSync('history') || []
    // })
    wxCloud({
      name: 'queryHistory'
    }).then(resp =>
      this.setState({
        history: resp.data
      })
    )
  }

  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  onShareAppMessage(object: ShareAppMessageObject): ShareAppMessageReturn {
    return {
      title: '深圳通余额查询',
      path: '/index/index'
    }
  }

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
      wxCloud({
        name: 'queryBalance',
        data: {
          cardNumber
        }
      }).then(resp => {
        // let { history } = this.state
        // history.push(resp.data.cardNumber)
        // this.setState(
        //   {
        //     history: [...new Set(history)]
        //   },
        //   () => {
        //     Taro.setStorage({ key: 'history', data: this.state.history })
        //   }
        // )
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
              <Text>{this.state.cardInfo.cardNumber}</Text>
            </View>
            <View className='content-row'>
              <Text>深圳通余额</Text>
              <Text
                className={
                  this.state.cardInfo.cardBalance <= 1 ? 'content-red' : ''
                }
              >
                {this.state.cardInfo.cardBalance}元
              </Text>
            </View>
            <View className='content-row'>
              <Text>更新时间</Text>
              <Text>{this.state.cardInfo.updateTime}</Text>
            </View>
            <View className='content-row'>
              <Text>卡片有效期</Text>
              <Text>{this.state.cardInfo.cardValidity}</Text>
            </View>
            <View className='content-row'>
              <Text>查询时间</Text>
              <Text>{this.state.cardInfo.currentTime}</Text>
            </View>
          </View>
        )}
      </View>
    )
  }
}
