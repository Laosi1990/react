
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
      localStorage.setItem(USER_KEY , JSON.stringify(user))
    },

    /**
     * 获取user
     * @returns
     */
    getUser() {
      return JSON.parse(localStorage.getItem(USER_KEY) || '{}')
    },

    /**
     * 删除user
     */
    removeUser() {
      localStorage.removeItem(USER_KEY)
    }
}