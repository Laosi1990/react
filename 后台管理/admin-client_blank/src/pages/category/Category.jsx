import React, { Component} from 'react';
import { Card, Table, Button, Icon, Modal, Form, Select, Input, message} from 'antd';
import LinkButton from '../../component/link-button/index';
import { getCategoryList , addCategory, deleteCategory} from "../../api/index";
import './index.less';

/**
 * 分类路由
 */
export default class Category extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      categoryList: [],
      selectOptionList: [{name:'一级分类', parentId: '0'}],
      selectDefaultValue: '0',
      parentName: '',
      parentId: '',
      titleList: [{name:'一级分类列表', parentId: '0'}],
      pagination: {
        current: 1,
        pageSize: 10,
        showQuickJumper: true
      },
      loading: false
    }
  }
  // 初始化列表头部
  initTableColumns = () => {
     this.columns = [
      {
        title: '分类名称',
        dataIndex: 'name',
        key: 'name',
      },{
      title: '操作',
      dataIndex: '',
      width: 250,
      key: 'x',
      render: (record) => <div>
            <LinkButton onClick = {() => {this.deleteCategory(record)}}>删除分类</LinkButton>
            <LinkButton onClick = {() => {this.editCategory(record)}}>修改分类</LinkButton>
            <LinkButton onClick = {() => {this.lookAtChildTable(record)}}>查看子分类</LinkButton>
        </div>,
    }];
  }
  // 点击title获取数据
  getCategoryListFromTitle(record) {
    const {parentId, name} = record;
    const {titleList} = this.state;
    const tempList = [...titleList];
    const index = tempList.findIndex(item => item.parentId === parentId  && item.name === name);
    if(index > -1) {
      tempList.splice(index+1)
      this.setState({
        titleList: tempList
      });
    }
    this.getCategoryList(parentId);
  }
  //  获取参数列表
  getCategoryList = async (parentId) => {
   this.setState({loading: true});
   const {status, data}  =  await getCategoryList(parentId);
   this.setState({
    categoryList: status === 0 ? data : [],
    loading: false
   })
   if (status === 0) {
     return data
   }
  }
  initCardTitle = () => {
    const {titleList} = this.state;
    return <div>
      {
        titleList.map(item => <span key={item.name} onClick={() => {this.getCategoryListFromTitle(item)}} key={item.parentId}>{item.name}<i>&gt;</i></span>)
      }
    </div>
  }
  // 打开模态框
  openModal = () => {
    this.setState({
      isVisible: true
    })
  }
  // 关闭模态框
  closeModal = () => {
    this.setState({
      isVisible: false
    })
  }
  // 添加分类
  addCategory = () => {
    this.openModal()
  }
  // 删除分类
  deleteCategory = async (record) => {
    const {_id} = record;
    const {status} = await deleteCategory(_id);
    if(status === 0 ) {
      message.success('删除分类成功！');
      this.getCategoryList('0');
    }
  }
  // 修改分类
  editCategory = (event, record) => {
    this.openModal()
  }
  // 查看子分类
  lookAtChildTable = async(record) => {
    const { _id, name } = record;
    await this.getCategoryList(_id);
    const { titleList } = this.state;
    const tempList = [...titleList];
    const newRecord = {
      name,
      parentId:_id,
    };
    tempList.push(newRecord);
    console.log('newRecord', newRecord)
    this.setState({
      selectOptionList:[{...newRecord}] ,
      titleList: tempList,
      selectDefaultValue:_id
    });
  }
  // 为第一步render准备数据
  componentWillMount() {
    this.initTableColumns();
  }

  // 执行异步请求
  componentDidMount() {
    this.getCategoryList('0');
  }
  render() {
    const {categoryList, isVisible, pagination, loading, selectOptionList, selectDefaultValue} = this.state;
    const title = this.initCardTitle();
    return (
      <div className='category'>
        <CategoryModal
          getCategoryList= {this.getCategoryList}
          selectOptionList= {selectOptionList}
          selectDefaultValue = {selectDefaultValue}
          closeModal={this.closeModal}
          isVisible={isVisible} />
        <Card
          title={ title }
          extra={
            <Button onClick={this.addCategory} type='primary'>
              <Icon type="tool"/>添加</Button>
            } style={{ width: '100%' }}>
          <Table
            rowKey={(record, index) => index}
            bordered
            loading={loading}
            dataSource={categoryList}
            columns={this.columns}
            pagination={pagination}
            >
          </Table>;
        </Card>
      </div>
    );
  }
}

/**
 * 分类信息模态框
 * @returns
 */
class CategoryModal extends Component {
  constructor(props) {
    super(props);
    this.state= {
      selectOptionList: []
    }
  }
  initStateFromProps = () => {
    const {selectOptionList} = this.props;
    this.setState({selectOptionList})
  }
  // 确定表单
  handleOk = async() => {
    const {parentId, categoryName} = await this.$ChildForm.submit()
    if(parentId&&categoryName) {
      // 发送后台分类数据
      const result = await addCategory(parentId, categoryName);
      const {status} = result;
      if(status === 0) {
        message.success('分类添加成功!')
      }else {
        const {msg} = result;
        message.error(msg);
      }
      // 关闭模态框
      this.props.closeModal();
      const {selectDefaultValue} = this.props;
      this.props.getCategoryList(selectDefaultValue);
    }
  }
  handleCancel = () => {
    this.props.closeModal();
  }
  render () {
    const { isVisible, selectOptionList, selectDefaultValue} = this.props;
    return (
      <div>
          <Modal
            title="添加分类"
            visible={isVisible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            <CategoryFormEdit
              selectOptionList = {selectOptionList}
              selectDefaultValue = {selectDefaultValue}
              onRef={(ref)=> {this.$ChildForm=ref}}
              />
          </Modal>
      </div>
    )
  }
}
/**
 * 表单组件
 */
class CategoryForm extends Component{
  state = {
    selectDefaultValue: '0',
    selectOptions: null
  }
  // 提交表单
  submit = () => {
    return new Promise((resolve, reject) => {
      const { validateFields } = this.props.form;
      validateFields((err, values) => {
        if(!err) {
          resolve(values)
        } else {
          resolve(false)
          message.error(err.message)
        }
      })
    })
  }
  componentDidMount() {
    this.props.onRef(this);
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { selectOptionList , selectDefaultValue} = this.props;
    return (
      <Form  name="control-hooks" layout="vertical">
        <Form.Item label="分类名称">
          {getFieldDecorator('categoryName', { rules:[{required: true}]})(<Input placeholder='请输入名称'/>)}
        </Form.Item>
        <Form.Item  label="分类">
          {getFieldDecorator('parentId', {initialValue:selectDefaultValue, rules:[{required: true}]})(
              <Select disabled placeholder="请选择分类">
                {selectOptionList.map((item, index) => <Select.Option key={index} value={item.parentId}>{item.name}</Select.Option>)}
              </Select>
            )}
        </Form.Item>
    </Form>
    )
  }
}
const CategoryFormEdit = Form.create()(CategoryForm);