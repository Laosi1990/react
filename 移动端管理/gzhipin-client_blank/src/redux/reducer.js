/**
 * @author Kx.R
 * @time 2022年1月8日22:24:58
 */
 import { combineReducers }  from 'redux'
import storageUtils from '../utils/storageUtils'
 import {
  SET_TITLE,
  AUTH_SUCCESS,
  ERROR_MSG
} from "./action-types"

/**
 * 设置用户信息的reducer
 * @param {*} state
 * @param {*} action
 */

const storageUser= storageUtils.getUser()
const initUser = {
  username: '', // 用户名
  type: '', // 用户类型
  msg: '', // 错误提示信息
  redirectTo: '',
  ...storageUser
}
function user(state = initUser, action) {
  switch (action.type) {
    case AUTH_SUCCESS:
      const {user} = action
      return {
        ...user
      }
    case ERROR_MSG:
      const {msg} = action
      return {
        ...state,
        msg
      }
    default:
      return state
  }
}
/**
 * @param {*} state
 * @param {*} action
 */
const initTitle = '主页面'
function title(state = initTitle, action) {
  switch (action.type) {
    case SET_TITLE:
      return action.title
    default:
      return state
  }
}
export default combineReducers({
  user,
  title
})