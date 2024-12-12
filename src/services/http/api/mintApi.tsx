// 封装后台接口方法
import {getApi, postApi, putApi} from '../index';
import config from "./config.json";

// 创建订单
export const createOrderPost = ({request}: any) => {
  return postApi(`${config.BackEndURL}/btc/order`, request)
}

// 修改订单信息
export const modifyOrderPut = ({orderId, data}: any) => {
  return putApi(`${config.BackEndURL}/btc/order/${orderId}`, data)
}

// 获取订单列表
export const getOrderListRequest = ({address, page, pageSize}: any) => {
  return getApi(`${config.BackEndURL}/btc/order/list/${address}?page=${page}&pageSize=${pageSize}`)
}

// 获取单个订单信息
export const getOrderDetails = ({id}: any) => {
  return getApi(`${config.BackEndURL}/btc/order/${id}`)
}

// 邮箱订阅
export const emailSubscribe = ({request}: any) => {
  return postApi(`${config.BackEndURL}/email/subscribe`, request)
}

// 查询用户持有哪些brc20 tick
export const getBRC20BalancesByAddress = ({address}: any) => {
  return getApi(`https://api.hiro.so/ordinals/v1/brc-20/balances/${address}`)
}
