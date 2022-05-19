import React, { Component } from 'react';
import PropTypes from "prop-types";
import {Form, Select, Input, message} from 'antd';
import {getCategoryAll} from "../../api/index";
const Item = Form.Item
const Option = Select.Option

class CategoryForm extends Component {
  state = {
    selectOptionList: []
  }
  static propTypes = {
    category: PropTypes.object.isRequired,
    setForm: PropTypes.func.isRequired,
    modalStatus: PropTypes.number.isRequired,
    toThisCategory: PropTypes.func.isRequired
  }
  // 获取初始化分类数据
  getInitCategory = () => {
    const {modalStatus, category} = this.props
    const {parentId} = category;
    if (modalStatus === 1) {
      return {
        name: '',
        parentId
      }
    } else {
      return category
    }
  }
  // 初始化所有的分类结果
  getCategoryAll = async () => {
    const {status, data, msg} = await getCategoryAll();
    if(status === 0) {
      this.setState({selectOptionList: data})
    } else {
      message.error(msg);
    }
  }
  // 选择
  changeHandle = (value) => {
    // const { toThisCategory } = this.props
    // toThisCategory({pid: value})
  }
  componentWillMount() {
    const {form} = this.props
    this.props.setForm(form)
  }
  componentDidMount() {
    this.getCategoryAll()
  }
  render() {
    const { parentId, name } = this.getInitCategory()
    const { modalStatus } = this.props
    const { selectOptionList } = this.state
    const { getFieldDecorator } = this.props.form
    return (
      <Form>
        <Item label="分类类型">
          {
            getFieldDecorator('parentId', {initialValue: parentId})(
              <Select disabled = {modalStatus === 2} onChange={this.changeHandle}>
                <Option value='0' key = '0'>一级分类</Option>
                {
                  selectOptionList.map(opt => <Option value={opt._id} key={opt._id}>{opt.name}</Option>)
                }
              </Select>
            )
          }
        </Item>
        <Item label="分类名称">
          {
            getFieldDecorator('categoryName',{initialValue: name, rules: [
             {required: true, message: '分类名称必须输入！'}
            ]})(
              <Input placeholder='请输入分类名称'/>
            )
          }
        </Item>
      </Form>
    );
  }
}
export default Form.create({})(CategoryForm)