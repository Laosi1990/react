import store from "store"; // 兼容其他浏览器--跨浏览器使用
/**
 *  进行local数据存储管理的工具模块
 */
const USER_KEY = 'user_key';
export default {
    /**
     * 保存user
     * @param {object} user
     */
    saveUser(user) {
      localStorage.setItem(USER_KEY , JSON.stringify(user)) || store.set(USER_KEY, user)
    },
    /**
     * 获取user
     * @returns
     */
    getUser() {
      return JSON.parse(localStorage.getItem(USER_KEY) || '{}') || store.get(USER_KEY)
    },
    /**
     * 删除user
     */
    removeUser() {
      localStorage.removeItem(USER_KEY) || store.remove(USER_KEY)
    }
}