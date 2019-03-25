import Taro, { PureComponent } from '@tarojs/taro'
import PropTypes from 'prop-types'
import { View, Text, Image } from '@tarojs/components'
import './Card.scss'
import { CardInfo } from '@/typings'
import { ITouchEvent } from '@tarojs/components/types/common'
import { wxCloud } from '@/utils'

export default class Index extends PureComponent {
  static defaultProps = {
    cardInfo: null,
    onDelete: null
  }

  static propTypes = {
    cardInfo: PropTypes.object.isRequired,
    onDelete: PropTypes.func
  }

  props: {
    cardInfo: CardInfo
    onDelete: Function
  }

  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  /**
   * 展示更多菜单
   * @param e
   */
  showMore(cardNumber: string, _e: ITouchEvent): void {
    Taro.showActionSheet({
      itemList: ['删除卡片']
    })
      .then(res => {
        if (res.tapIndex === 0) {
          Taro.showModal({
            title: '',
            content: '删除后，就无法自动查询余额'
          }).then(res => {
            if (res.confirm) {
              this.deleteCard(cardNumber)
            }
          })
        }
      })
      .catch(_error => {})
  }

  /**
   * 删除卡片
   * @param cardNumber 卡号
   */
  deleteCard(cardNumber: string): void {
    wxCloud({
      name: 'deleteRecord',
      data: {
        cardNumber
      }
    }).then(_res => this.props.onDelete && this.props.onDelete(cardNumber))
  }

  render() {
    if (!this.props.cardInfo) return <View />
    const {
      cardBalance,
      updateTime,
      cardValidity,
      cardNumber
    } = this.props.cardInfo
    return (
      <View className='content-info'>
        <View className='content-datas'>
          <View className='content-row'>
            <Image mode='aspectFit' src={require('@/static/logo_small.png')} />
            <Image
              src={require('@/static/more.png')}
              onClick={this.showMore.bind(this, cardNumber)}
            />
          </View>
          <View className='content-row'>
            <Text className={cardBalance <= 1 ? 'content-red' : ''}>
              {cardBalance}
            </Text>
            <Text>元</Text>
          </View>
          <View className='content-row'>
            <Text>截止到 {updateTime}</Text>
          </View>
          <View className='content-row'>
            <Text>{cardValidity && `有效期：${cardValidity}`}</Text>
            <Text>{cardNumber}</Text>
          </View>
        </View>
      </View>
    )
  }
}
