import React, { Component } from 'react';
import { Card, Table, Button,Modal, Icon,Tree, message, Form, Select, Input, Radio } from 'antd';
import LinkButton from ".././../component/link-button";
import menuList from "../../config/menu-config";
import memoryUtils from "../../../src/utils/memoryUtils";
import {
  addRole,
  getRoleList,
  roleUpdate,
  deleteRole
} from "../../api/index";

/**
 * 角色路由
 */
export default class Role extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isSetRoleModalVisible: false,
      isCreateRoleModalVisible: false,
      loading: false,
      roleList: [],
      roleName: '',
      role:{}
    }
    this.setRoleFormRef = React.createRef()
  }
  // 打开设置权限的模态框
  openSetRoleModal = () => {
    const {roleName} = this.state
    if(!roleName) {
      message.error('请先选择角色！')
      return
    }
    this.setState({isSetRoleModalVisible: true})
  }
  // 关闭设置权限的模态框
  closeSetRoleModal = () => {
    this.setState({isSetRoleModalVisible: false})
  }
  // 打开新建角色的模态框
  openCreateRoleModal = () => {
    this.setState({isCreateRoleModalVisible: true})
  }
  // 关闭新建角色的模态框
  closeCreateRoleModal = () => {
    this.setState({isCreateRoleModalVisible: false})
  }
  // 确定设置
  setRoleOk = () => {
    this.roleUpdate()
    this.closeSetRoleModal()
  }
  // 修改权限
  roleUpdate = async () => {
    const { getCheckedKeys } = this.setRoleFormRef.current
    const { role } = this.state
    const auth_name = memoryUtils.user.username
    const menus = getCheckedKeys()
    const {status, msg, data} =  await roleUpdate({...role, auth_name, menus})
    if(status === 0) {
      message.info('修改权限成功！')
      this.getRoleList()
    } else {
      message.error(msg)
    }
  }
  // 取消设置
  setRoleCancel = () => { this.closeSetRoleModal() }
  // 校验creat form
  handleCreateValidate = () => {
    const { validateFields } = this.createForm
    return new Promise((resolve, reject) => {
      validateFields((error, data) => {
        if(!error) {
          resolve(data)
        } else {
          message.info('校验失败！')
        }
      })
    })
  }
  // 确定创建
  createRoleOk = async () => {
    const result = await this.handleCreateValidate()
    const {name} = result;
    this.addRole(name)
    this.closeCreateRoleModal()
  }
  // 取消创建
  createRoleCancel = () => { this.closeCreateRoleModal() }
  // 添加角色
  addRole = async (roleName) => {
    const {status, msg, data}  = await addRole(roleName)
    if(status === 0) {
      message.info('添加角色成功')
      this.getRoleList()
    }else {
      message.error(msg)
    }
  }
  deleteRole = (record) => {
    Modal.confirm({
      title:"提醒！",
      content: '确定删除',
      onOk: async () => {
        const {_id} = record
        debugger
        const {status, msg} = await deleteRole(_id)
        if(status === 0) {
          message.success('删除成功!')
          this.getRoleList()
        } else {
          message.error(msg)
        }
      }
    })
  }
  // 获取角色列表
  getRoleList = async() => {
    this.setState({loading:true})
    const {status, msg, data} = await getRoleList()
    this.setState({loading: false})
    if(status === 0) {
      message.info('获取列表成功！')
      this.setState({roleList: data})
    } else {
      message.error(msg)
    }
  }
  componentDidMount() {
    this.getRoleList()
  }
  render() {
    console.log('role-props', this.props)
    const {
      isSetRoleModalVisible,
      isCreateRoleModalVisible,
      loading,
      roleList,
      roleName
    } = this.state
    const columns = [
      {
        title: '角色名称',
        dataIndex: 'name',
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
      },
      {
        title: '授权时间',
        dataIndex: 'auth_time',
      },
      {
        title: '授权人',
        dataIndex: 'auth_name',
      },
      {
        title: '操作',
        render: record => <LinkButton onClick={() => {this.deleteRole(record)}}>删除</LinkButton>
      }
    ];
    const rowSelection = {
      type: 'radio',
      onChange: (selectedRowKeys, selectedRows) => {
        const [ role ] = selectedRows
        const { name } = role
        this.setState({
          role,
          roleName:name
        })
      },
      getCheckboxProps: (record) => ({
        // disabled: record.name === 'Disabled User', // Column configuration not to be checked
        // name: record.name,
      }),
    };
    const title = <div>
        <Button type='primary' onClick={this.openCreateRoleModal} style={{margin: '0 10px'}}>创建角色</Button>
        <Button type='primary' onClick={this.openSetRoleModal}>设置角色权限</Button>
      </div>
    const WrapCreateRoleForm = Form.create({name: 'create'})(CreateRoleForm)
    return (
      <div style={{padding: '20px', boxSizing: 'border-box'}}>
        <Card
          title={title}
        >
          <Table
            bordered
            loading = {loading}
            rowKey={(record, index) => index}
            rowSelection={{
              ...rowSelection,
            }}
            columns={columns}
            dataSource={roleList}
          ></Table>
        </Card>
        <Modal
          title="设置角色权限"
          visible={ isSetRoleModalVisible }
          onOk={ this.setRoleOk }
          onCancel={ this.setRoleCancel }>
          <SetRoleForm ref = {this.setRoleFormRef} roleName={roleName}/>
        </Modal>
        <Modal
          title="创建角色"
          visible={ isCreateRoleModalVisible }
          onOk={ this.createRoleOk }
          onCancel={ this.createRoleCancel }>
            <WrapCreateRoleForm setCreateForm = {form => {this.createForm = form}}/>
        </Modal>
      </div>
    );
  }
}


/**
 * 创建角色Form表单
 */
 class CreateRoleForm extends Component {
  // 提价数据
  handleSubmit = async() => {
    const result = await this.handleValidate()
    return result
  }

  componentWillMount() {
    const { form, setCreateForm } = this.props
    setCreateForm(form)
  }

  render() {
    console.log('create-props', this.props)
    const { getFieldDecorator } = this.props.form
    return (
      <Form onSubmit={ this.handleSubmit }>
        <Form.Item label='角色名称'>
          {
            getFieldDecorator('name', {rules: [{required: true, message: '请输入角色名称'}]})(<Input placeholder='请输入角色名称'/>)
          }
        </Form.Item>
      </Form>)
    }
}

/**
 * 设置角色的form表单
 */
class SetRoleForm extends Component {
  state = {
    checkedKeys: []
  }
  setRoleTreeCheck = (checkedKeys, info) => {
    this.setState({checkedKeys})
    console.log('onCheck', checkedKeys, info);
  }
  getCheckedKeys = () => {
    const { checkedKeys } = this.state
    return checkedKeys
  }
  render() {
    console.log('set-props', this.props)
    const { roleName } = this.props;
    return (
      <Form>
        <Form.Item label='角色名称'>
          <Input value={roleName} readOnly/>
        </Form.Item>
        <Form.Item>
          <Tree
            checkable
            onCheck={ this.setRoleTreeCheck }
            treeData={menuList}/>
        </Form.Item>
      </Form>)
    }
}
