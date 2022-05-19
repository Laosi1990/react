import React, { Component } from 'react';
import { Card, Table, Button,Modal, Icon, message, Form, Select, Input, Radio } from 'antd';
import WrapCreateUser from './create-user';
import LinkButton from "../../component/link-button";
import {
  addUser,
  getUserList,
  updateUser,
  deleteUser
} from "../../api/index";
export default class User extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isCreateUserModalVisible: false,
      userList: [],
      total: 0,
      roleList: [],
      user: null
    }
  }
  // 打开模态框
  openCreateUserModal = () => {
    this.setState({isCreateUserModalVisible: true})
  }
  // 关闭模态框
  closeCreateUserModal = () => {
    const { resetFields } = this.createUserForm
    resetFields()
    this.setState({isCreateUserModalVisible: false, user: null})
  }
  // 创建用户
  createUserModalOk = async () => {
    const { user } = this.state
    const result = await this.validateFieldsForm()
    if(!result) return
    !user
    ? this.addUser()
    : this.updateUser()
    this.closeCreateUserModal()
  }
  // 创建用户
  addUser = async () => {
    const { getFieldsValue } =  this.createUserForm
    const result = getFieldsValue()
    const {status, msg, data} = await addUser(result)
    if(status === 0) {
      message.info('添加用户成功！')
      this.getUserList()
    } else {
      message.error(msg)
    }
  }
  // 获取用户列表
  getUserList = async () => {
    const {status, msg, data} = await getUserList()
    if(status === 0) {
      const {total, users, roles} = data
      this.setState({userList: users, total, roleList:roles})
      message.success('获取用户列表成功！')
    } else {
      message.error(msg)
    }
  }
  // 校验用户表单
  validateFieldsForm = () => {
    const { validateFields } = this.createUserForm
    return new Promise((resolve, reject) => {
      validateFields((error, data)=> {
        if(!error) {
          resolve(data)
        } else {
          message.error('校验失败！')
        }
      })
    })
  }
  // 取消创建用户
  createUserModalCancel = () => {
    this.closeCreateUserModal()
  }
  // 修改用户
  editUser =  (record) => {
    this.setState({user: record})
    this.openCreateUserModal()
  }
  // 修改更新用户
  updateUser = async () => {
    const { user } = this.state
    const { getFieldsValue } =  this.createUserForm
    const result = getFieldsValue()
    const {status, msg, data} = await updateUser({...user, ...result})
    if(status === 0) {
      message.info('修改用户成功')
      this.getUserList()
    } else {
      message.error(msg)
    }
  }
  // 删除用户
  deleteUser = async (_id) => {
    const {status, msg, data} = await deleteUser(_id)
    if(status === 0) {
      message.success('删除用户成功！')
      this.getUserList()
    } else {
      message.error(msg)
    }
  }
  componentDidMount() {
    this.getUserList()
  }
  render() {
    const {
      isCreateUserModalVisible,
      userList,
      user
    } = this.state
    const cardTitle = <div><Button type='primary' onClick={ this.openCreateUserModal }>创建用户</Button></div>
    const columns = [
      {
        title: '用户名',
        dataIndex: 'username',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
      },
      {
        title: '电话',
        dataIndex: 'phone',
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
      },
      {
        title: '所属角色',
        dataIndex: 'role_id',
        render: (_id) => {
          const { roleList } = this.state
          const [{name}]= roleList.filter(role => role._id === _id)
          return  <span>{name}</span>
        }
      },
      {
        title: '操作',
        render: (record) => {
          const {_id} = record
          return <div>
            <LinkButton onClick = { () => { this.editUser(record) }}>修改</LinkButton>
            <LinkButton onClick = { () => { this.deleteUser(_id) }}>删除</LinkButton>
          </div>
        }
      },
    ];
    return (
      <div style={{padding: '20px'}}>
        <Card title={cardTitle}>
          <Table bordered columns={columns} dataSource={userList}/>
        </Card>
        <Modal
          title="创建用户"
          visible={isCreateUserModalVisible}
          onOk={ this.createUserModalOk }
          onCancel={ this.createUserModalCancel }>
          <WrapCreateUser
            user = {user}
            setCreateUserForm = { form => { this.createUserForm = form }}
          />
        </Modal>
      </div>
    );
  }
}