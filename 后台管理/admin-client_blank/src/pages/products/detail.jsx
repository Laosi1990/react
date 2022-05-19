import React, { Component } from 'react';
import { Card, Button, Icon, Cascader, Form } from 'antd';
import {
  getCategoryAll
} from "../../api/index";
const { Item } = Form
class ProductDetail extends Component {
  getCategoryAll = () => {
    const {status, data, msg} = getCategoryAll()
  }
  // 获取card title 结构
  getCardTitleVNode = () => {
    return <div style={{cursor: 'pointer'}} onClick={() => {this.props.history.goBack()}}>
      <Icon type='arrow-left'></Icon>
      <span style={{fontSize: '18px', fontWeight: 700}}>商品详情</span>
    </div>
  }
  render() {
    const cardTitle = this.getCardTitleVNode()
    const { name, desc, price } = this.props.location.state.product
    const formItemLayout = {
      labelCol: {
        span: 2
      },
      wrapperCol: {
        span: 12
      },
    };
    return (
      <div style={{padding: '20px', boxSizing: 'border-box'}}>
        <Card title={cardTitle}>
        <Form {...formItemLayout}>
            <Item label="商品名称">
              {name}
            </Item>
            <Item label="商品描述">
              {desc}
            </Item>
            <Item label="商品价格">
              {price}
            </Item>
            {/* <Item label="商品分类">
              <Cascader
                options={ options }
                loadData={ this.loadData }
              />
            </Item> */}
            {/* <Item label="上传图片">
              <MyUpload fileList = {formData.imgs} ref = {this.myUpload}/>
            </Item>
            <Item label="商品详情" labelCol={{span: 2}} wrapperCol={{span: 20}}>
              <RichTextEdit
                ref ={this.richTextEdit}
                html={formData.detail}/>
            </Item> */}
          </Form>
        </Card>
      </div>
    );
  }
}
export default ProductDetail