import  React  from "react";
import PropTypes from "prop-types";
import { Upload, Icon, Modal, message } from 'antd';
import { BASE_IMG_URL } from "../../utils/constans";

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

class MyUpload extends React.Component {
  static propTypes = {
    fileList:PropTypes.array
  }
  constructor(props) {
    super(props);
    const fileList = this.initPropsValue()
    // 初始化状态
    this.state = {
      previewVisible: false, // 是否显示大图预览
      previewImage: '', // 显示大图的地址
      fileList // 展示图片的的列表
    };
  }
  initPropsValue = () => {
   const {fileList} = this.props;
   return fileList && fileList.length > 0
        ? fileList.map((img, index) => ({
          uid: -index,
          name: img,
          status: 'done',
          url: BASE_IMG_URL + img
        }))
        : []
  }
  // 隐藏Modal
  handleCancel = () => this.setState({ previewVisible: false });

  // 显示大图
  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  getImages = () => {
    const { fileList } = this.state
    return fileList.map(file => file.name)
  }
  /**
   * @param {*} file 当前操作的文件
   * @param {} fileList 上传数组
   */
  handleChange =({ file, fileList } )=> {
    if (file.status === "done") {
      const { response } = file
      const {status, data: {name , url}, msg} = response
      if(status === 0) {
        message.success('图片上传成功！')
        const file = fileList[fileList.length - 1]
        file.name = name
        file.url = url
      } else{
        message.error(msg)
      }
    }
    this.setState({fileList})
  }
  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          action="/manage/img/upload" /*上传图片的接口地址 */
          accept="image/*" /* 只接受图片类型 */
          listType="picture-card" /* 上传图片的展示形式 */
          name='image' /* 请求参数的名称 */
          fileList={ fileList } /* 指定所有一上传图图片的列表 */
          onPreview={this.handlePreview} /* 显示指定的file对应的大图 */
          onChange={this.handleChange}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

export default MyUpload