import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import WrapLoginForm from './login-form'
import logo from '../../assets/images/logo.png'
import './login.less'

/**
 * 登录的路由组件
 */
class Login extends Component{
  render() {
    const { history , user} = this.props;
    if(user && user._id){
      return <Redirect to='/home'/>
    }
    const { errorMsg } = this.props.user
    return (
      <div className='login'>
        <header className='login-header'>
          <img src= {logo} alt="" />
          <div>React项目：后端管理</div>
        </header>
        <section className='login-container'>
          <div className='login-container-form'>
            <div className='title'>用户登录</div>
            <div className='content'>
              <WrapLoginForm history = { history }></WrapLoginForm>
            </div>
            <div style={{textAlign: 'center', color: 'red'}}>{errorMsg}</div>
          </div>
        </section>
      </div>
    );
  }
}

export default  connect(
  state => ({user: state.user}),
  {}
)(Login)

/**
 * 高阶函数
 *    一类特别的函数：
 *        1.接收函数类型的参数
 *        2.函数的返回值是函数
 *    常见
 *        1.定时器
 *        2.Promise
 *        3.数组很多相关的的方法  filter map reduce find findIndex
 *        4.fn.bind()
 *        5 Form.create()  form.getFieldDecorator
 * 高阶组件
 *    1. 本质是一个函数
 *    2. 接受一个组件（包装组件），返回一个新的组件(被包装组件)，包装组件会向被包装组件传入特定的属性
 *    3. 作用： 扩展组件的功能
 */
