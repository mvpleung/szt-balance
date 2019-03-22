import { Component } from '@tarojs/taro'
import PropTypes from 'prop-types'
import { Swiper, SwiperItem } from '@tarojs/components'
import Card from './Card'
import './SwipperCard.scss'
import { CardInfo } from '@/typings'

export default class Index extends Component {
  static defaultProps = {
    records: [],
    styleObj: {},
    onDelete: null
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

  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    const { records, styleObj, onDelete } = this.props
    return (
      <Swiper
        className='swipper-card-basic'
        indicatorColor='rgba(0, 0, 0, .3)'
        indicatorActiveColor='#808080'
        circular
        indicatorDots={records && records.length > 1}
        style={styleObj}
      >
        {records.map(item => (
          <SwiperItem key={item.cardNumber}>
            <Card cardInfo={item} onDelete={onDelete} />
          </SwiperItem>
        ))}
      </Swiper>
    )
  }
}
