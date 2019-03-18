import Taro, { Component } from '@tarojs/taro';
import { View, Icon, Text, Navigator } from '@tarojs/components';
import './index.scss';
// import { isEmpty, get, lowBalance } from '../../utils';

interface State {
  cardNumber: string;
  cardInfo: any;
  history: Array<string>;
}

export default class Nav extends Component {
  state: State;

  constructor() {
    super();
    this.setState({
      history: Taro.getStorageSync('history') || []
    });
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
    });
  }

  render() {
    return (
      <View className='invoice viewBox'>
        <Text>正在开发中，敬请关注！</Text>
      </View>
    );
  }
}
