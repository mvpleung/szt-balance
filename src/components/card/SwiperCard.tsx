import { PureComponent } from '@tarojs/taro'
import PropTypes from 'prop-types'
import { Swiper, SwiperItem, View, Text } from '@tarojs/components'
import Card from './Card'
import './SwiperCard.scss'
import { CardInfo } from '@/typings'
import { ITouchEvent } from '@tarojs/components/types/common'

export default class Index extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      current: 0
    }
  }
  static defaultProps = {
    records: [],
    styleObj: {},
    onDelete: null,
    current: 0
  }

  static propTypes = {
    records: PropTypes.array.isRequired,
    styleObj: PropTypes.object,
    onDelete: PropTypes.func
  }

  props: {
    records: Array<CardInfo>
    styleObj: object
    onDelete: Function
  }

  state: {
    current: number
  }

  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  /**
   * 监听 Swiper 滑动
   * @param e 滑动事件
   */
  onSwiperChange = (e: ITouchEvent): void => {
    this.setState({
      current: e.detail.current
    })
  }

  /**
   * 监听 SwiperItem 删除事件
   * @param cardNumber 卡号
   */
  onSwiperItemDelete = (cardNumber: string): void => {
    const { records, onDelete } = this.props
    let length = records.length
    this.setState({
      current: length > 1 ? length - 2 : 0 //因为删除卡片，这里的数据集合应该减 1，但是需要回调到最上层做集合数据操作，所以这里减 2，模拟集合操作
    })
    onDelete && onDelete(cardNumber)
  }

  render() {
    const { records, styleObj } = this.props
    return records && records.length > 0 ? (
      <Swiper
        className='swiper-card-basic'
        indicatorColor='rgba(0, 0, 0, .3)'
        indicatorActiveColor='#808080'
        circular
        current={this.state.current}
        onChange={this.onSwiperChange}
        indicatorDots={records && records.length > 1}
        style={styleObj}
      >
        {records.map(item => (
          <SwiperItem key={item.cardNumber}>
            <Card cardInfo={item} onDelete={this.onSwiperItemDelete} />
          </SwiperItem>
        ))}
      </Swiper>
    ) : (
      <View className='swiper-empty-notice'>
        <Text>快来查询深圳通余额吧~</Text>
      </View>
    )
  }
}
