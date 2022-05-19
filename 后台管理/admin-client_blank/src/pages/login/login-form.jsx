import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Icon, Input, Button, message } from 'antd'
import { loginAsync } from '../../redux/actions'

/**
 * 登录的form表单
 */
 class LoginForm extends Component {
  handleSubmit = e => {
    // 阻止事件的默认行为
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const { username, password } = values
        const { loginAsync } = this.props
        // 调用分发异步action的请求
        await loginAsync(username, password)
      } else {
        message.error('校验失败！')
      }
    });
  };
  validatePwd = (rule, value, callback) => {
    if(!value) {
      callback('请输入密码！')
    }else if(value.length < 4) {
      callback('长度不能小于4位！')
    }else if(value.length > 12){
      callback('长度不能大于12位！')
    }else {
      const pattern = /^[a-zA-Z0-9]+$/;
      if(!pattern.test(value)) {
        callback('请输入正确的密码！')
      }
    }
    callback();
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <Form.Item>
          {
            getFieldDecorator('username', { // 配置对象
              // 声明式验证： 直接使用别人定义好的规则进行验证
              rules: [
                { required: true, message: 'Please input your username!' },
                { min: 4, message: '用户名最少4位!' },
                { max: 12, message: '用户名最多12位!' },
                { pattern: /^[a-zA-Z0-9]+$/, message: '请输入正确的用户名!' },
              ],
            })(
              <Input
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Username"
              />
            )
          }
        </Form.Item>
        <Form.Item>
          {
            getFieldDecorator('password', {
              rules: [{required: true, validator: this.validatePwd, trigger: 'change'}],
            })(
                <Input
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type="password"
                  placeholder="Password"
                />
            )
          }
        </Form.Item>
        <Form.Item>
          <Button type="primary" block htmlType="submit" className="login-form-button">
            登录
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

const WrapLoginForm = Form.create({ name: 'login' })(LoginForm)

export default connect(
  state => ({user: state.user}),
  { loginAsync }
)(WrapLoginForm);