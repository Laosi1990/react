import ajax from "./ajax";
import jsonp from "jsonp";
import { message } from "antd";

/**
 * 登录
 * @param {string} username
 * @param {string} password
 * @returns Promise
 */
export const login = (username, password) => ajax('/login',{username, password}, 'POST');

/**
 * 添加用户
 * @param {object} user
 * @returns Promise
 */
export const addUser = (user) => ajax('/manage/user/add', user, 'POST');

/**
 * 获取用户列表
 * @returns
 */
export const getUserList = () => ajax('/manage/user/list')

/**
 * 修改更新用户
 * @param {*} user
 * @returns
 */
export const updateUser = (user) => ajax('/manage/user/update', {...user}, 'POST')

/**
 * 删除用户
 * @param {*} userId
 * @returns
 */
export const deleteUser = (userId) => ajax('/manage/user/delete', {userId}, 'POST')
//========================================================================================================

/**
 * 获取分类列表
 * @returns
 */
export const getCategoryList = (parentId) => ajax('/manage/category/list', {parentId});

/***
 *获取分类所有的列表
 */
export const getCategoryAll = () =>  ajax('/manage/category/all');

/**
 *
 * @returns
 */
export const removeCategoryAll = () => ajax('/manage/category/remove', {}, 'POST');

/**
 * 添加分类
 * @param {oject} data
 * @returns
 */
export const addCategory = (parentId, categoryName) => ajax('/manage/category/add', {parentId, categoryName}, 'POST');
/**
 *删除分类
 * @param {string} categoryId
 * @returns
 */
export const deleteCategory = (categoryId) => ajax('/manage/category/delete', {categoryId}, 'POST');

/**
 * 更新分类
 * @param {*} parentId
 * @param {*} categoryName
 * @returns
 */
export const updateCategory = (categoryId, categoryName) => ajax('/manage/category/update', {categoryId, categoryName}, 'POST');

/**
 * 查看子分类
 * @param {string} id
 * @returns
 */
export const lookAtChild = (id) => ajax('/manage/user/addCategory', {id}, 'GET')

//========================================================================================================

/**
 * 获取商品的分页列表
 * @returns
 */
export const getProducts = (pageNum, pageSize) => ajax('/manage/product/list', {pageNum, pageSize})

/**
 * 根据信息搜索列表
 * @param {*} params
 * @returns
 */
export const searchProducts = (params) => ajax('/manage/product/search', {...params})

/**
 * 根据_id获取商品信息
 * @param {} _id
 * @returns
 */
export const getProduct = (_id) => ajax('/manage/product/findOne', {_id})

/**
 * 添加商品
 * @param {*} data
 * @returns
 */
export const addProduct = (data) => ajax('/manage/product/add', {...data}, 'POST')

/**
 * 删除商品
 * @param {*} productId
 * @returns
 */
export const deleteProduct = (productId) => ajax('/manage/product/delete', {productId}, 'POST')

/**
 * 更新商品
 * @param {*} data
 * @returns
 */
export const updateProduct = (data) => ajax('/manage/product/update', {...data}, 'POST')

/**
 * 修改商品的状态
 * @param {*} _id
 * @param {*} status
 * @returns
 */
export const updateProductStatus = (productId, status) => ajax('/manage/product/updateStatus', {productId, status}, 'POST')

//========================================================================================================
/**
 * 添加角色
 * @param {*} roleName
 * @returns
 */
export const addRole = (roleName) => ajax('/manage/role/add', {roleName}, 'POST')

/**
 * 删除角色
 * @param {*} roleId
 * @returns
 */
export const deleteRole = (roleId) => ajax('/manage/role/delete', {roleId}, 'POST')

/**
 * 获取角色列表
 * @returns
 */
export const getRoleList = () => ajax('/manage/role/list')

/**
 * 给角色添加权限
 * @param {*} data
 * @returns
 */
export const roleUpdate = (data) => ajax('/manage/role/update', {...data}, 'POST')
//========================================================================================================

/**
 * 获取天气信息的jsonp接口
 * @param {string} city
 * @returns
 */
export const getWeather = (city) => {
  return new Promise((resolve, reject) => {
    const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`;
    jsonp(url, {}, (error, data) => {
      if(!error && data.status === 'success') {
        const {dayPictureUrl, weather} = data.result[0].weather_data[0]
        resolve({
          dayPictureUrl,
          weather
        })
      } else {
        // 失败处理
        message.error(error.message);
      }
    })
  });
}

