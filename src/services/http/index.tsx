import axios from 'axios';
import md5 from 'js-md5';
import {AxiosRequestConfig} from "axios/index";

// 创建一个拥有通用配置的axios实例
axios.create({
  // 创建一个拥有通用配置的axios实例
  timeout: 1000 * 30, // 请求超时时间（毫秒）
  withCredentials: true, // 是否携带cookie信息
  headers: { // 头部信息
    'Content-Type': 'application/json; charset=utf-8'
  }
})

axios.interceptors.request.use(config => {
  // 添加一个请求拦截器
  if (config.url === 'https://brc20market.akiprotocol.io/geniidataapi/api/btc/ord/flow/index?obj=1&type=brc20&p=brc20') {
    // 请求头带上token在发送请求之前做某事
    let now = Math.ceil(Date.now() / 1e3).toString();
    // @ts-ignore
    config.headers['X-SIGN-TOKEN'] = md5(`path=/api/btc/ord/flow/index&x-timestamp=${now}Geniidata`).toUpperCase()
    config.headers['X-TIMESTAMP'] = now;
    return config;
  } else {
    return config;
  }
}, error => {
  return Promise.reject(error)
})

export function postApi(url: any, config?: AxiosRequestConfig) {
  return axios.post(url, config)
}

export function getApi(url: any, config?: AxiosRequestConfig) {
  return axios.get(url, config)
}

export function putApi(url: any, config?: AxiosRequestConfig) {
  return axios.put(url, config)
}

