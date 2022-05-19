import React, { Component } from 'react'
import { connect } from 'react-redux'
import {BrowserRouter as Router, Switch, Route, Redirect, Link } from 'react-router-dom'
import HeaderNav from "../../component/header"
import LeftNav from "../../component/left-nav"
import Home from "../home/home"
import User from "../user/user"
import Categorys from "../category/categorys"
import Bar from "../charts/bar"
import Pie from "../charts/pie"
import Line from "../charts/line"
import Products from "../products/products"
import Role from "../role/role"
import { Layout } from 'antd'
const { Header, Footer, Sider, Content } = Layout;
/**
 * 后台管理的路由组件
 */
class Admin extends Component {

  render() {
    const { user } = this.props
    // 如果内存中没有user
    if(!user || !user._id) {
      return <Redirect to='/login'/>
    }
    return (
      <Router>
        <Layout style={{'min-height': '100%'}}>
          <Sider>
            <LeftNav/>
          </Sider>
          <Layout>
            <Header style={{background: '#f0f2f5', lineHeight: 1, padding: 0}}><HeaderNav/></Header>
            <Content style={{background: '#fff'}}>
                <Switch>
                  <Route path='/home' component={Home}/>
                  <Route path='/user' component={User}/>
                  <Route path='/products' component={Products}/>
                  <Route path='/categorys' component={Categorys}/>
                  <Route path='/role' component={Role}/>
                  <Route path='/bar' component={Bar}/>
                  <Route path='/line' component={Line}/>
                  <Route path='/pie' component={Pie}/>
                  <Redirect to='/home'/>
                </Switch>
            </Content>
            <Footer style={{textAlign: 'center'}}>Footer</Footer>
          </Layout>
        </Layout>
      </Router>
    );
  }
}

export default connect(
  state =>  ({user: state.user}),
  { }
)(Admin)