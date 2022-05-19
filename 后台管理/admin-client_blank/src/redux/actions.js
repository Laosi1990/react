/**
 * 包含n个action creator函数的模块
 * 同步的action {type: 'XXXX'}
 * 异步的action 函数 dispatch => {}
 */
import {
  SET_HEAD_TITLE,
  RECEIVE_USER,
  SHOW_ERROR_MSG,
  RESET_USER
} from "./action-types";
import {
  login
} from '../api/index'
import { message } from "antd";
import storageUtils from "../utils/storageUtils";

/**
 * 设置头部标题的同步的action
 */
export const setHeadTitle = (headTitle) => ({type: SET_HEAD_TITLE, data: headTitle})

/**
 * 接受用户信息的同步的action
 * @param {*} user
 * @returns
 */
export const receiveUser = (user) => ({type: RECEIVE_USER, user})

/**
 * 显示错误的信息的action
 * @param {*} errorMsg
 * @returns
 */
export const showErrorMsg = (errorMsg) => ({type: SHOW_ERROR_MSG, errorMsg})

/**
 * 登录的异步的action
 */
export const loginAsync = (username, password) => {
  return async dispatch => {
    // 执行异步ajax请求
    const {status, msg, data} = await login(username, password)
    if( status === 0) { // 成功
      message.success('登录成功！')
      // 保存到 localStorage
      storageUtils.saveUser({...data})
      // 保存到state里面
      dispatch(receiveUser({...data}))
    } else {
      dispatch(showErrorMsg(msg))
    }
  }
}

/**
 * 退出登录的同步action
 */
export const logout = () => {
  // 清除本地缓存里面的user
  storageUtils.removeUser()
  // 清除state里面的user
  return {type: RESET_USER}
}