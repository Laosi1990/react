import React, { Component } from 'react';
import {
  Card,
  Table,
  Button,
  Icon,
  Modal,
  message,
  Select,
  Input
} from 'antd';
import LinkButton from '../../component/link-button/index';
import {
  getProducts,
  searchProducts,
  deleteProduct,
  updateProductStatus
} from "../../api/index";
import { PAGE_SIZE } from '../../utils/constans';
const Option = Select.Option;
class ProductHome extends Component {
  state = {
    loading: false,
    products: [],
    pageNum: 1,
    pageSize: 10,
    total: 0,
    searchType: 'productName',
    searchValue: '',
  }
  // 获取商品详情列表
  getProducts = async (pageNum, pageSize) => {
    this.setState({loading: true})
    const {status, data, msg} = await getProducts(pageNum, PAGE_SIZE)
    this.setState({loading: false})
    if (status === 0) {
      message.info('获取商品详情列表成功！')
      const {total, list} = data
      this.setState({
        total,
        products: list
      })
    } else {
      message.error(msg)
    }
  }
  // 根据条件搜索
  searchProducts = async (pageNum) => {
    this.setState({loading: true})
    const {searchType, searchValue} = this.state
    const params = {
      pageNum,
      pageSize: PAGE_SIZE,
      [searchType]: searchValue
    }
    const {status, data, msg} = await searchProducts({...params})
    this.setState({loading: false})
    if (status === 0) {
      message.info('获取商品详情列表成功！')
      const {total, list} = data
      this.setState({
        total,
        products: list
      })
    } else {
      message.error(msg)
    }
  }
  // 修改商品状态
  changeStatus = async (_id, state) => {
    state === 0 ? state = 1 : state = 0
    const {status, msg} = await updateProductStatus(_id, state)
    if(status === 0) {
      message.success('修改成功！')
      this.searchProducts(1)
    } else {
      message.error(msg)
    }
  }
  // 添加商品
  addHandler = () => {
    this.props.history.push({
     pathname :'/products/addupdate',
     state: { type: 1 }
    })
  }
  // 修改商品
  editHandler = (record) => {
      this.props.history.push({
        pathname :'/products/addupdate',
        state: { type: 2,product: record}
       })
  }
  // 删除商品
  deleteHandler = async (record) => {
    Modal.confirm({
      title: '提示！',
      content: '确定删除商品吗',
      onOk: async () => {
       const productId = record._id
       const {status, msg} = await deleteProduct(productId)
       status === 0 ? message.success('删除成功！') : message.error(msg)
       this.searchProducts(1)
      }
    })
  }
  // 查看详情
  detailHandler = (record) => {
    this.props.history.push({
      pathname: '/products/detail',
      state: {product: record}
    })
  }
  // 选择下拉框
  selectOnChange = value => {
    debugger
    this.setState({
      searchType: value
    })
  }
  // 输入框发生变化
  inputOnInput = event => {
    this.setState({
      searchValue: event.target.value
    })
  }
  // 获取card title
  cardTitleVNode = () => {
    const {searchType, searchValue} = this.state
    return <span style={{display:'inline-block', width: '200px'}}>
      <Select
        defaultValue='productName'
        onChange={value => this.setState({searchType: value})}
        value={ searchType }
        style={{width: '150px'}} placeholder='请选择'>
        <Option value='productName'>按名称搜索</Option>
        <Option value='productDesc'>按描述搜索</Option>
      </Select>
      <Input
        onChange={e => this.setState({searchValue: e.target.value})}
        value={searchValue} placeholder='关键字'/>
      <Button type='primary' onClick={() => {this.searchProducts(1)}}>搜索</Button>
    </span>
  }
  // 获取card 拓展
  cardExtraVNode = () => {
    return <Button onClick={this.addHandler} type='primary'>
        <Icon type="plus"/>添加商品
      </Button>
  }
  // 设置表格数据
  tableColumns = () => {
    return [
      {
        title: '商品名称',
        dataIndex: 'name',
        width: 100
      },
      {
        title: '商品描述',
        dataIndex: 'desc'
      },
      {
        title: '价格',
        dataIndex: 'price',
        render: (price) => <span>￥{price}</span>
      },
      {
        title: '状态',
        dataIndex: 'status',
        render: (status, record) => {
          debugger
          const {_id} = record
          return status
            ? (
                <span>
                  <Button type='primary' onClick={() => {this.changeStatus(_id, status)}}>下架</Button>
                  <span>在售</span>
                </span>
              )
            : (
                <span>
                  <Button type='primary' onClick={() => {this.changeStatus(_id, status)}}>上架</Button>
                  <span>已下架</span>
                </span>
              )
        }
      },
      {
        title: '操作',
        render: (record) => {
          return <span>
              <LinkButton onClick = {() => {this.detailHandler(record)}}>详情</LinkButton>
              <LinkButton onClick = {() => {this.editHandler(record)}}>修改</LinkButton>
              <LinkButton onClick = {() => {this.deleteHandler(record)}}>删除</LinkButton>
            </span>
        }
      }
    ]
  }
  componentWillMount() {
    this.cardTitle = this.cardTitleVNode()
    this.cardExtra = this.cardExtraVNode()
    this.columns = this.tableColumns()
  }
  componentDidMount() {
    this.searchProducts(1);
  }
  render() {
    const {cardTitle, cardExtra, columns}  = this
    const {loading, products, total} = this.state
    return (
      <div className='product-home'>
        <Card
         title= { cardTitle }
         extra= { cardExtra }
         style= {{ width: '100%' }}>
          <Table
            rowKey={(record, index) => index}
            bordered
            loading={loading}
            pagination={{
              total,
              defaultCurrent: 1,
              defaultPageSize: PAGE_SIZE,
              showQuickJumper: true,
              onChange:this.searchProducts
            }}
            dataSource={products}
            columns={columns}
          />
        </Card>
      </div>
    );
  }
}

export default ProductHome