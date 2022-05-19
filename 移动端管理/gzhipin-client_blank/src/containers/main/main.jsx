import React, { Component } from 'react'
import {HashRouter as Router, Route, Switch ,Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { NavBar, TabBar } from 'antd-mobile'
import { setTitle} from '../../redux/actions'
import BottomNav from '../../components/bottom-nav/index'
import Chat from '../../containers/chat/chat'
import Message from '../../containers/message/message'
import List from '../../containers/list/list'
import Personal from '../../containers/personal/personal'

import './main.less'


class Main extends Component {
  render() {
    const { user } = this.props
    const { type } = user
    if(!user || !user._id) {
      return <Redirect to='/register'/>
    }
    return (
      <div className='main-box'>
        <NavBar>{type === '老板' ? '老板' : '求职者'} 列表</NavBar>
        <div className='main-container'>
        <Router>
          <Switch>
            <Route path='/chat' component={Chat}/>
            <Route path='/message' component={Message}/>
            <Route path='/personal' component={Personal}/>
            <Route path='/' component={List}/>
          </Switch>
        </Router>
        </div>
        <BottomNav/>
      </div>
    );
  }
}

export default connect(
  state => ({user: state.user, title: state.title}),
  { setTitle }
)(Main)