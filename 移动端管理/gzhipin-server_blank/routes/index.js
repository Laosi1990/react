const express = require('express')
const md5 = require('blueimp-md5')
const router = express.Router()
const models = require('../db/models')
const { UserModel } = models
const filter = {password : 0, __v: 0}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// 注册路由
router.post('/register',  (req, res) => {
  const { username, password, type } = req.body
  console.log('req', username, password, type)
  UserModel.findOne({ username }, (error, user) => {
    console.log('user', user)
    if (!error ) {
      if(user) { // 用户已经存在
        res.send({code: 1, msg: '用户已经存在！'})
      } else { // 用户不存在创建用户
        UserModel.create({username, type, password: md5(password) }, (error, data) => {
          if(!error) {
            const {_id} = data
            res.cookie('userId', _id, {maxAge: 1000*60*60*24*7})
            res.send({code: 0, data: {username, type, _id}})
          } else {
            res.send({code: 1, msg: '创建用户失败！'})
          }
        })
      }
    } else {
      res.send({code: 1, msg: '用户查询失败！'})
    }
  })
})

// 登录路由
router.post('/login', (req, res) => {
  const {username, password} = req.body
  UserModel.findOne({username, password: md5(password)}, filter, (error, data) => {
    if(!error) {
      if (data) {
        const {_id} = data
        res.cookie('userId', _id, {maxAge: 1000*60*60*24*7})
        res.send({code: 0, data, msg: '登录成功！'})
      } else {
        res.send({code: 1, msg:'用户名或者密码错误！'})
      }
    }else {
      res.send({code: 1, msg:'查询失败'})
    }
  })
})

// 更新用户信息
router.post('/update/user', (req, res) => {
  const {_id, header, info, company, salary, post} = req.body
  UserModel.findByIdAndUpdate({_id}, {header, info, company, salary, post}, (error, data) => {
    if(!error) {
      res.send({code: 0, msg: '更新成功！'})
    } else {
      res.send({code: 1, msg: '更新失败！'})
    }
  })
})

module.exports = router;
