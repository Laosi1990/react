/**
 * 定义action
 * @author Kx.R
 * @time 2022年1月8日22:28:11
 */
import {
  AUTH_SUCCESS,
  SET_TITLE,
  ERROR_MSG
} from "./action-types"
import {
  loginPost,
  registerPost,
  updateUserPost
} from '../api/index'
import { Toast } from "antd-mobile"
import storageUtils from "../utils/storageUtils"


/**
 * 同步设置user信息
 * @param {*} user
 * @returns
 */
export const authSuccess = (user) => ({type: AUTH_SUCCESS, user})

/**
 * 显示注册错误的信息的action
 * @param {*} msg
 * @returns
 */
 export const showErrorMsg = (msg) => ({type: ERROR_MSG, msg})

 /**
 * 同步设置title信息
 * @param  title
 * @returns
 */
export const setTitle = (title) => ({type: SET_TITLE, title})

/**
 * 异步注册 user 信息
 * @param {*} user
 * @returns
 */
export const register = (user) => {
  const {username, password, password2, type} = user
  if(!username) {
    return showErrorMsg('请填写用户名！')
  } else if(password !== password2) {
    return showErrorMsg('密码需保持一致！')
  }
  return async dispatch => {
    const {code, msg, data} = await registerPost({username, password, type})
    if (code === 0) {
      const user  = {...data, redirectTo: '/'}
      storageUtils.saveUser({...user})
      dispatch(authSuccess({...user}))
      Toast.success('注册成功！')
    } else {
      dispatch(showErrorMsg(msg))
    }
  }
}

/**
 * 异步登录的action
 * @param {*} user
 * @returns
 */
export const login = (user) => {
  const {username, password} = user
  if(!username) {
    return showErrorMsg('请填写用户名！')
  } else if(!password) {
    return showErrorMsg('请填写密码！')
  }
  return async dispatch => {
    const {code, msg, data} = await loginPost(user)
    if (code === 0) {
      const user  = {...data, redirectTo: '/'}
      storageUtils.saveUser(user)
      dispatch(authSuccess(user))
      Toast.success('登录成功！')
    } else {
      dispatch(showErrorMsg(msg))
    }
  }
}

/**
 * 更新user信息
 * @param {} user
 * @returns
 */
export const updateUser = (user) => {
  return async dispatch => {
    const {code, msg} = await updateUserPost(user)
    if(code ===0) {
      storageUtils.saveUser({...user})
      dispatch(authSuccess({...user}))
      Toast.success(msg)
    } else {
      Toast.fail(msg)
    }
  }
}