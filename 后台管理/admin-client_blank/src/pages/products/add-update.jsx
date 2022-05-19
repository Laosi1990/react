import React, { Component } from 'react';
import MyUpload  from '../../component/upload/index'
import RichTextEdit  from '../../component/rich-text-edit/index'
import { Card, Button, Icon, message, Cascader, Form, Select, Input } from 'antd';
import {
  getCategoryList,
  addProduct,
  updateProduct,
  getProduct
} from "../../api/index";
const {Item} = Form;
const { Option } = Select;
const { TextArea } = Input;

class ProductAddUpdate extends Component {
  constructor(props) {
    super(props);
    this.myUpload = React.createRef()
    this.richTextEdit = React.createRef()
    const {product} = this.props.location.state
    this.state = {
      options: [], // Cascader 初始化数据
      formData: product && {...product} || {}, // form 表单的数据
    }
  }
  // 获取商品详情
  getProductDetail = async () => {
    if(this.type === 1) return
    const {status, data:[formData], msg} = await getProduct(this._id)
    if(status === 0) {
      message.success('获取商品详情成功！')
      this.setState({formData})
    } else {
      message.error(msg)
    }
  }
  // 初始化options的值
  initOptions = async () => {
    const options = await this.getCascadeOptions('0')
    this.setState({options})
  }
  // 获取最终数据
  getTargetCaOptions = list => {
    return list.map((item) => {
      return {
        label: item.name,
        value: item._id,
        isLeaf: false
      }
    })
  }
  // 初始化级联数据
  getCascadeOptions = async pid => {
    const result = await getCategoryList(pid)
    const {status, data, msg} = result
    if(status === 0) {
     return this.getTargetCaOptions(data)
    } else {
      message.error(msg)
    }
  }
  // 加载下一级级联数据
  loadData = async selectedOptions => {
    // 得到选择的option选项
    const targetOption = selectedOptions[selectedOptions.length - 1]
    // 显示loading
    targetOption.loading = true;
    const { value } = targetOption;
    const result = await this.getCascadeOptions(value);
    targetOption.loading = false;
    targetOption.children = result;
    // 更新options的状态
    this.setState({
      options: [...this.state.options]
    })
  }
  cascadeOnChange = (value) => {
    debugger
  }
  // 获取提交表单的参数
  getSubmitParams = () => {
    const { getFieldsValue } = this.props.form
    const { getImages } = this.myUpload.current
    const { getHtmlValue } = this.richTextEdit.current
    const fields = getFieldsValue()
    const {ids} = fields
    const [pCategoryId, categoryId] = [...ids].slice(-2)
    const imgs = getImages()
    const detail = getHtmlValue()
    return {
      ...fields,
      pCategoryId,
      categoryId,
      imgs,
      detail,
    }
  }
  // 提交表单
  submitHandler = async () => {
    debugger
    const result = await this.validateHandler()
    if(result) {
      const params = this.getSubmitParams()
      const { type, product } = this.props.location.state
      if(type === 2) {
        const {_id} = product
        const {status, msg} = await updateProduct({_id, ...params})
        if(status === 0) {
          message.success('商品修改成功！')
          this.props.history.go(-1)
        } else {
          message.error(msg)
        }
      } else {
        const {status, msg} = await addProduct(params)
        if(status === 0) {
          message.success('商品添加成功！')
          this.props.history.go(-1)
        } else {
          message.error(msg)
        }
      }
    }
  }
  // validateFields
  validateHandler = () => {
    const { validateFields } = this.props.form
    return new Promise((resolve, reject) => {
      validateFields((error, data) => {
        if(!error) {
          resolve(data)
        } else {
          message.error('校验失败')
        }
      })
    })
  }
  // 初始化card-title
  initCarTitleVNode = () => {
    const {type} = this.props.history
    return <div onClick={() => {this.props.history.go(-1)}}>
      <Icon type='arrow-left'></Icon>
      {
        type
           ?  <span style={{fontSize: '18px', fontWeight: 700}}>添加商品</span>
           :  <span style={{fontSize: '18px', fontWeight: 700}}>修改商品</span>
      }
    </div>
  }
  componentWillMount () {
    // this.getRouterParams()
    // this.getProductDetail()
    this.cardTitle = this.initCarTitleVNode()
  }
  componentDidMount() {
    this.initOptions()
  }
  render() {
    const { cardTitle } = this
    const { options, formData } = this.state
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: {
        span: 2
      },
      wrapperCol: {
        span: 12
      },
    };
    return (
      <div style={{padding: '20px'}}>
        <Card title={cardTitle}>
          <Form {...formItemLayout}>
            <Item label="商品名称">
              {
                getFieldDecorator('name', {
                  initialValue: formData.name,
                  rules: [{required: true, trigger: 'blur', message:'请输入商品名称'}]
                })(<Input placeholder='请输入商品名称'/>)
              }
            </Item>
            <Item label="商品描述">
              {
                getFieldDecorator('desc', {
                  initialValue: formData.desc,
                  rules: [{required: true, trigger: 'blur',message:'请输入商品描述'}]
                })(<TextArea type="text" placeholder='请输入商品描述' autoSize={{minRows: 2}}/>)
              }
            </Item>
            <Item label="商品价格">
              {
                getFieldDecorator('price', {
                  initialValue: formData.price,
                  rules: [{required: true,message:'请输入商品价格'}]
                })(<Input prefix="￥" type="number" suffix="元" placeholder="请输入商品价格" placeholder='商品价格' />)
              }
            </Item>
            <Item label="商品分类">
              {
                getFieldDecorator('ids', {
                  initialValue: [formData.pCategoryId, formData.categoryId],
                  rules: []
                })(<Cascader
                    options={ options }  /*需要显示的列表向*/
                    loadData={this.loadData} /* 点击列表项显示下一级列表 */
                    placeholder="请选择商品分类"
                  />)
              }
            </Item>
            <Item label="上传图片">
              <MyUpload fileList = {formData.imgs} ref = {this.myUpload}/>
            </Item>
            <Item label="商品详情" labelCol={{span: 2}} wrapperCol={{span: 20}}>
              <RichTextEdit
                ref ={this.richTextEdit}
                html={formData.detail}/>
            </Item>
            <Item><Button type='primary' onClick={this.submitHandler}>提交</Button></Item>
          </Form>
        </Card>
      </div>
    );
  }
}
export default Form.create({})(ProductAddUpdate)