/**
 * 包含n个操作数据库集合数据的model模块
 */

const mongoose = require('mongoose')

// 连接数据库
mongoose.connect('mongodb://localhost:27017/zhipin_test')

// 获取连接对象
const conn = mongoose.connection

// 绑定完成监听
conn.on('connected', () => {
  console.log('db connect success!')
})

// 创建user的文档结构
const userSchema = mongoose.Schema({
  username: {type: String, required: true}, // 用户名称
  password: {type: String, required: true}, // 密码
  type: {type: String, required: true}, // 用户类型
  header: {type: String}, // 头像名称
  post: {type: String}, // 职位
  info: {type: String}, // 个人或者职位简介
  company: {type: String}, // 公司名称
  salary: {type: String}, // 工资
})

const UserModel= mongoose.model('user', userSchema)

module.exports = {
  UserModel
}
