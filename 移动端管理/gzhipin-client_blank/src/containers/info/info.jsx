import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavBar, InputItem, Grid, TextareaItem, Button, WhiteSpace, Toast } from 'antd-mobile';
import { Redirect } from 'react-router-dom';
import { updateUser } from '../../redux/actions';

class Info extends Component {
  constructor(props) {
    super(props)
    this.avatarList = Array.from(new Array(20).fill('').map((item, index) => ({
      text: `头像${index+1}`,
      icon: require(`./headers/头像${index+1}.png`),
    })))
    this.state = {
      header: '', // 头像名称
      post: '', // 职位
      info: '', // 个人或者职位简介
      company: '', // 公司名称
      salary: '', // 工资
    }
  }
  /**
   * 保存数据状态
   * @param {string} name
   * @param {string} value
   */
  changeHandle = (name, value) => {
    this.setState({[name]: value})
  }
  /**
   * 选择头像
   */
  selectGridItem = (el, index) => {
    this.setState({header: el.icon})
  }
  /**
   * 请求后台，
   * 保存数据
   */
  saveHandle = () => {
    const {state} = this
    const {user, updateUser} = this.props
    updateUser({...user, ...state})
  }

  render() {
    const { user } = this.props
    const { type } = user;
    const flag = Object.keys(user).includes('header') && Array.from(Object.values(Object.keys(user).filter(key=> key !== 'msg'))).every(val => val)
    if(flag) {
      return <Redirect to='/'/>
    }
    return (
      <div className="info-container">
        <NavBar>{type === 'laoban' ? '老板' : '求职者'}信息完善</NavBar>
        <WhiteSpace/>
        <div className="info-grid">
          <Grid data={ this.avatarList } activeStyle={ {background: 'red'} } onClick={(el,index)=> {this.selectGridItem(el,index)}} />
        </div>
        <WhiteSpace />
        {
          type === 'laoban'
          ? <div>
            <InputItem placeholder="请输入招聘的职位" onChange={(val)=> { this.changeHandle('post', val)}}>招聘职位：</InputItem>
            <InputItem placeholder="请输入公司名称" onChange={(val)=> {this.changeHandle('company', val)}}>公司名称：</InputItem>
            <InputItem placeholder="请输入职位薪资" onChange={(val)=> {this.changeHandle('salary', val)}}>职位薪资：</InputItem>
            <TextareaItem title="求职要求:" placeholder="请输入求职要求" onChange={(val)=> {this.changeHandle('info', val)}}>求职要求</TextareaItem>
          </div>
          : <div>
            <InputItem placeholder="请输入求职岗位" onChange={(val)=> {this.changeHandle('post', val)}}>求职岗位：</InputItem>
            <TextareaItem title='个人介绍：' rows={3} placeholder="请输入个人介绍" onChange={(val)=> {this.changeHandle('info', val)}}></TextareaItem>
          </div>
        }
         <WhiteSpace />
        <Button type='primary' onClick={this.saveHandle}>确定</Button>
      </div>
    );
  }
}
export default connect(
  state => ({user: state.user}),
  { updateUser }
)(Info);
