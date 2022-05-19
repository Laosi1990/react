import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Modal } from 'antd';
import formatDate from '../../../src/utils/dateUtils'
import LinkButton from '../link-button/index'
import { getWeather } from '../../api/index'
import { logout } from '../../redux/actions'

import './index.less'

 class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTime: formatDate(Date.now()),
      dayPictureUrl: '',
      weather: '',
    }
  }
  /**
   * 获取天气信息
   */
  getWeatherInfo = async () => {
   const {dayPictureUrl, weather} = getWeather('大连');
   this.setState({
    dayPictureUrl,
    weather
   })
  }
  /**
   * 获取当前时间
   */
  getCurrentTime = () => {
    this.timer = setInterval(() => {
      this.setState({
        currentTime: formatDate(Date.now())
      })
    }, 1000);
  }
  /**
   * 更具当前path获取名称
   */
  getTitleForPath = (list) => {
    const { pathname } = this.props.location;
    let title;
      list.forEach(element => {
        if(element.key === pathname) {
          title = element.title;
        }else if(element.children) {
         const menuItem = element.children.find(item => pathname.includes(item.key));
         if (menuItem) title = menuItem.title
        }
      });
      return title;
  }
  /**
   * 是否退出登录
   */
  confirmLogout = () => {
    Modal.confirm({
      title: '提示！',
      content: '确定退出登录？',
      onOk:()=> {
        const { logout } = this.props
        logout()
      },
      onCancel:()=> {
        console.log('取消退出登录！')
      }
    })
  }
  // 第一次render之后执行一次。
  // 一般执行异步操作 ajax 请求，启动定时器
  componentDidMount(){
    this.getCurrentTime()
    this.getWeatherInfo()
  }
  // 当前组件卸载之前调用
  componentWillUnmount() {
     clearInterval(this.timer);
  }
  render() {
    // const currentPageName = this.getTitleForPath(menuList);
    // const currentPageName = this.props.headTitle
    const {user , headTitle}  = this.props
    const {dayPictureUrl, weather, currentTime} = this.state;
    return (
      <div className='header'>
        <div className='header-welcome'>
          <div>欢迎,{user.username}, <LinkButton onClick={this.confirmLogout}>退出</LinkButton></div>
        </div>
        <div className='header-info'>
          <div className="path">{headTitle}</div>
          <div className="date">
            <span>{currentTime}</span>
            <img src={dayPictureUrl} alt="" />
            <span>{weather}</span>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({headTitle: state.headTitle, user: state.user}),
  { logout }
)(withRouter(Header));
