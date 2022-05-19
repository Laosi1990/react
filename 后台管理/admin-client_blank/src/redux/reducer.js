/**
 * 根据现有的state和指定的action生成新的state状态
 */
import {combineReducers} from 'redux';
import storageUtils from "../utils/storageUtils";
import {
  SET_HEAD_TITLE,
  RECEIVE_USER,
  SHOW_ERROR_MSG,
  RESET_USER
} from "./action-types";

/**
 * 管理当前头部标题
 * @param {*} state
 * @param {*} action
 * @returns
 */
 const initHeadTitle = '首页'
function  headTitle(state = initHeadTitle, action) {
  switch (action.type) {
    case SET_HEAD_TITLE:
      return action.data
    default:
      return state
  }
}


/**
 * 管理user
 * @param {*} state
 * @param {*} action
 * @returns
 */
const initUser = storageUtils.getUser()
function user(state = initUser, action) {
  debugger
  switch (action.type) {
    case RECEIVE_USER:
      return action.user
    case SHOW_ERROR_MSG:
      const { errorMsg } = action
      return { ...state, errorMsg }
    case RESET_USER:
      return {}
    default:
      return state
  }
}

/**
 * 向外暴露的是合并产生的总的reducer
 * 管理的总的state的结构是： {
 * headerTitleReducer,
 * userReducer
 * }
 */
export default combineReducers({
  headTitle,
  user
})