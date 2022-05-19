import React, { Component } from 'react';
import { Card, Table, Button, Icon, Modal, message} from 'antd';
import LinkButton from '../../component/link-button/index';
import {
  getCategoryList ,
  addCategory,
  deleteCategory,
  updateCategory,
  removeCategoryAll
} from "../../api/index";
import CategoryForm from "./category-form.jsx";
import './index.less';

/**
 * 分类路由
 */
class Categorys extends Component {
  state = {
    loading: false,
    cardTitleList: [{name: '一级分类', pid: '0', id: '' }],
    isModalVisible: false,
    category:{},
    modalStatus: 1, // 默认是添加 2 是修改
  }
  // 获取一级分类列表
  getCategorys = async(pid) => {
    this.setState({loading: true})
    const result = await getCategoryList(pid)
    this.setState({loading: false})
    const {status} = result
    if(status === 0) {
      const {data} = result
      this.setState({categorys: data})
    } else {
      message.error('获取分类列表失败！')
    }
  }
  // 设置当前的this 上category 的值
  setThisCategory = (category) => {
    if(!category) {
      let currentCategory;
      const {cardTitleList} = this.state;
      if(cardTitleList.length === 1) {
        currentCategory = {name: '一级分类', parentId: '0'}
      } else {
        const [{name, pid: parentId}] = [...cardTitleList].slice(-1);
        currentCategory = {name, parentId}
      }
      this.category = currentCategory
    } else {
      this.category = category;
    }
  }
  // 添加操作
  handleAdd =() => {
    this.setState({isModalVisible: true,modalStatus:1});
    this.setThisCategory();
  }
  // 添加分类
  addCategory = async () => {
    const {parentId, categoryName} = this.form.getFieldsValue()
    const {status, msg} = await addCategory(parentId, categoryName)
    if(status === 0) {
      message.success('添加分类成功！')
    }else {
      message.error(msg)
    }
    this.setState({isModalVisible: false});
    this.getCategorys(parentId)
  }
  // 删除分类
  deleteCategory = async (record) => {
    const {_id, parentId} = record
    const {status} =  await deleteCategory(_id)
    let msg;
    status === 0 ? msg = '删除分类成功！': msg ='删除分类失败!'
    this.getCategorys(parentId)
    message.success(msg)
  }
  // 打开模态框
  openModal = () => {
    this.setState({isModalVisible: true});
  }
  // 关闭模态框
  closeModal = () => {
    this.setState({isModalVisible: false});
    this.form.resetFields();
  }
  // 修改
  handleUpdate = (category) => {
    this.openModal();
    this.setState({modalStatus:2})
    this.setThisCategory(category)
  }
  // 修改分类
  updateCategory = async () => {
    const { category } = this
    const {_id, parentId} = category;
    const {categoryName} = this.form.getFieldsValue()
    const {status, msg} = await updateCategory(_id, categoryName)
    this.closeModal()
    if(status === 0) {
      message.success("分类更新成功！")
      this.getCategorys(parentId)
      return
    }
    message.error(msg)
  }
  // 清除分类
  removeCategory = () => {
    Modal.confirm({
      title: '提示！',
      content: '确定清空分类吗',
      onOk: async () => {
       const {status, msg} = await removeCategoryAll();
       status === 0 ? message.success('清除成功！') : message.error(msg)
      }
    })
  }
  // 获取title list 的数据
  // @param {{name: string, pid:string}} record
  getCardTitleList = (record) => {
    debugger
    const {cardTitleList} = this.state
    const {name, pid} = record
    if (pid !== '0') {
      // const index = cardTitleList.findIndex(item => item.name === name && item.pid === pid)
      const index = cardTitleList.findIndex(item => item.pid === pid)
      let tempList
      if(index === -1) {
        tempList = [...cardTitleList, {...record}]
      } else {
        tempList = [...cardTitleList]
        tempList.splice(index+1)
      }
      this.setState({cardTitleList: tempList})
    } else {
      this.setState({cardTitleList:[{name: '一级分类', pid: '0'}]})
    }
    this.getCardTitleVNode(cardTitleList)
  }
  // 跳转至指定的分类
  toThisCategory = (record) => {
    const {pid} = record
    this.getCardTitleList(record);
    this.getCategorys(pid)
  }
  // 获取渲染title的虚拟dom
  getCardTitleVNode = () => {
    const {cardTitleList} = this.state
    return cardTitleList.map(item => <span className='card-title-item' key={item.pid} onClick={ () => {this.toThisCategory(item)}}>{item.name} <i>&gt;</i></span>)
  }
  // 查看子分类
  showSubCategorys = (record) => {
    const {name , _id} = record
    this.getCategorys(_id)
    const newRecord = {name, pid: _id};
    this.getCardTitleList(newRecord)
  }
  // 确定添加
  handleOk = () => {
    const {modalStatus} = this.state
    this.form.validateFields((error, data) => {
      debugger
      if(!error) {
        modalStatus === 1 && this.addCategory()
        modalStatus === 2 && this.updateCategory()
      }
    })
    this.form.resetFields()
  }
  // 取消添加
  handleCancel = () => {
    this.form.resetFields()
    this.setState({isModalVisible: false})
  }
  // 出书化列表表头
  initTableColumns = () => {
    this.columns = [
      {
        title: '分类名称',
        dataIndex: 'name'
      },
      {
        title: '操作',
        width: 300,
        render: (record) =>  // 返回需要显示的标签
            <div>
              <LinkButton onClick = {() => {this.deleteCategory(record)}}>删除分类</LinkButton>
              <LinkButton onClick = {() => {this.handleUpdate(record)}}>修改分类</LinkButton>
              <LinkButton onClick = {() => {this.showSubCategorys(record)}}>查看子分类</LinkButton>
            </div>
      }
    ]
  }
  // 为第一次render()准备数据
  componentWillMount() {
    this.initTableColumns()
  }
  // 获取异步请求
  componentDidMount() {
    this.getCategorys('0')
  }
  render() {
    const {categorys, loading, isModalVisible, modalStatus} = this.state
    const category = this.category || {}
    const cardTitle = this.getCardTitleVNode();
    return (
      <div className='category'>
        <Card
          title= {cardTitle}
          extra={
            <div>
                <Button onClick={this.handleAdd} type='primary'>
                  <Icon type="tool"/>添加
                </Button>
                <LinkButton onClick={this.removeCategory}>清除</LinkButton>
            </div>
          } style={{ width: '100%' }}>
          <Table
            rowKey={(record, index) => index}
            bordered
            loading={loading}
            pagination={{defaultPageSize: 10, showQuickJumper: true}}
            dataSource={categorys}
            columns={this.columns}/>
        </Card>
        <Modal
          title="添加分类"
          visible={isModalVisible}

          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <CategoryForm
            category={category}
            modalStatus={modalStatus}
            toThisCategory={this.toThisCategory}
            setForm={form => {this.form = form }}
          />
        </Modal>
      </div>
    );
  }
}
export default Categorys;