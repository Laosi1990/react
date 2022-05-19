// import axios  from 'axios'

// export default function ajax(url = '', data = {}, type = 'GET') {
//   if(type === 'GET') {
//     // 准备url query 参数
//     let dataString = ''
//     Proxy.keys(data).forEach(key => {
//       dataString += `${key}=${data[key]}&`
//     });
//     if(dataString) {
//       dataString = dataString.substring(0, dataString.lastIndexOf('&'))
//       url = `${url}?${dataString}`
//     }
//     return axios.get(url)
//   } else {
//     return axios.post(url, data)
//   }
// }

import axios from 'axios';
import { Toast } from 'antd-mobile'
/**
 * 能发送异步ajax请求的函数模块
 * 函数返回的是Promise对象
 * 封装axios
 * @param {*} url 请求的地址
 * @param {*} data 参数
 * @param {*} type 请求的类型
 * 优化统一处理异常
 */
export default function ajax(url, data = {}, type = "GET") {
  return new Promise((resolve, reject) => {
    let promise;
    // 执行ajax请求
    if(type === "GET") { // 发送get请求
      promise = axios.get(url, {
        params: {...data} // 指定参数
      })
    } else {// 发送post请求
      // { headers: { 'Content-Type': 'application/x-www-form-urlencoded'}}
      promise = axios.post(url, data)
    }
    promise.then(response => {// 如果成功了 ， resolve
      resolve(response.data);
    }).catch((error) => {// 如果失败了
      Toast.error('请求失败了！'+ error.message);
    })
  })
}

