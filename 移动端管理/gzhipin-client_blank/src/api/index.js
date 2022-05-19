import ajax from './ajax'

/**
 * 注册
 * @param {*} user
 * @returns
 */
export const registerPost = (user) => ajax('/register', user, 'POST')

/**
 * 登录
 * @param {*} user
 * @returns
 */
export const loginPost = (user) => ajax('/login', user, 'POST')


/**
 *
 * @param {*} user
 * @returns
 */
export const updateUserPost = (user) => ajax('/update/user', user, 'POST')