import React, { Component } from 'react';
import { Card, Table, Button,Modal, Icon, message, Form, Select, Input, Radio } from 'antd';
import PropTypes from "prop-types";
import {
  getRoleList
} from "../../api/index";

 class CreateUser extends Component {
   static propTypes = {
     user: PropTypes.object
   }
  state = {
    roleList: []
  }
  getRoleList = async () => {
    const {status, msg, data} = await getRoleList()
    if(status === 0) {
      this.setState({roleList: data})
    } else {
      message.error(msg)
    }
  }
  componentWillMount() {
    const { setCreateUserForm, form } = this.props
    setCreateUserForm(form)
    this.getRoleList()
  }
  render() {
    console.log('CreateUser', this.props)
    const { roleList } = this.state
    const { getFieldDecorator } = this.props.form
    const {
       username,
       password,
       phone,
       email,
       role_id
    } = this.props.user || {}
    return (
      <div>
        <Form>
          <Form.Item label='用户名称'>
            {
              getFieldDecorator('username', {
                initialValue: username,
                rules:[{required: true, message:'请输入用户名称'}]
              })(<Input placeholder='请输入用户名称' />)
            }
          </Form.Item>
          <Form.Item label='密码'>
            {
              getFieldDecorator('password', {
                initialValue: password,
                rules: [{required: true, message:'请输入密码'}]
              })(<Input placeholder='请输入密码' />)
            }
          </Form.Item>
          <Form.Item label='手机号'>
            {
              getFieldDecorator('phone', {
                initialValue: phone,
                rules: [{required: true, message:'请输入手机号'}]
              })(<Input placeholder='请输入手机号' />)
            }
          </Form.Item>
          <Form.Item label='邮箱'>
            {
              getFieldDecorator('email', {
                initialValue: email,
                rules: [{required: true, message:'请输入邮箱'}]
              })(<Input placeholder='请输入邮箱' />)
            }
          </Form.Item>
          <Form.Item label='角色'>
            {
              getFieldDecorator('role_id', {
                initialValue: role_id,
                rules: [{required: true, message:'请选择角色'}]
              })(<Select>
                {
                  roleList.map(role => <Select.Option key={role._id} value={role._id}>{role.name}</Select.Option>)
                }
              </Select>)
            }
          </Form.Item>
        </Form>
      </div>
    );
  }
}
const WrapCreateUser = Form.create({name: 'user'})(CreateUser)
export default WrapCreateUser