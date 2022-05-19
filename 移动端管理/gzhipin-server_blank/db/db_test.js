/**
 * 数据库的操作
 */

// 引入mongoose
const mongoose = require('mongoose')
const md5 = require('blueimp-md5')

// 连接数据库
mongoose.connect('mongodb://localhost:27017/zhipin_test')

// 连接对象
const conn = mongoose.connection

// 绑定完成监听
conn.on('connected', () => {
  console.log('数据库连接成功， yeah!')
})


// 得到特定集合的Modal
// 定义Schema(表述文档的结构)
const userSchema = mongoose.Schema({
  username: {type: String, required: true},
  password: {type: String, required: true},
  type: {type: String, required: true}
})
// 定义Modal(与集合对应，可以操作集合)
const UserModal = mongoose.model('user', userSchema) // 确定集合的名称是users


// save()
function  testSave() {
  // 创建 UserModal 实例
  const userModal = new UserModal({
    username: 'Bose',
    password: md5('123'),
    type: 'laoban'
  })
  //  保存数据
  userModal.save((error, user) => {
    console.log('save()', error, user)
  })
}

// testSave()
// 通过Model的find()/findOne() 查询多个或者一个数据
function testFind() {
  UserModal.find((error, users) => {
    console.log('find()', error, users)
  })
  UserModal.findOne({_id: '61db9523f22c731780b0914d'}, (error, user) => {
    console.log('findOne()', error, user)
  })
}
// testFind()

// 更新
function  testUpdate() {
  UserModal.findByIdAndUpdate({_id: '61db9523f22c731780b0914d'}, {username: 'Jack'}, (error, user) => {
    console.log('findByIdAndUpdate()', error, user)
  })
}
// testUpdate()

// remove()
function  testDelete(params) {
  UserModal.remove({_id: '61db9523f22c731780b0914d'}, (error, user) => {
    console.log('testDelete()', error, user)
  })
}

testDelete()



