// 封装后台接口方法
import {getApi} from '../index';
import config from "./config.json";

// 获取区块高度
export const getBlockHeightRequest = () => {
  return getApi(`${config.HttpURL}`);
}

// 获取gasFee
export const getGasFeeInfo = () => {
  return getApi(`https://mempool.space/api/v1/fees/recommended`)
}

// 获取BTC价格
export const getBTCPriceInfo = () => {
  return getApi('https://www.geniidata.com/api/uda/flow/btc/price')
}

//****** discover页面 ******

// 获取Mint Rank表
export const getMintDataRequest = ({tab, page, pageSize}: any) => {
  return getApi(`${config.HttpURL}/stats/brc-20/mints?block_offset=${tab}&offset=${(page - 1) * pageSize}&limit=${pageSize}`)
}

// 获取Transactions表
export const getTransactionsRequest = ({blockHeight}: { blockHeight: number }) => {
  return getApi(`${config.HttpURL}/inscriptions/transfers?block=${blockHeight}`)
}

// getTableDetails
export const getTableDetailsRequest = ({num}: any) => {
  return getApi(`${config.HttpURL}/inscriptions/${num}`)
}

// getImageInfo
export const getImageInfoRequest = (num: number) => {
  return `${config.HttpURL}/inscriptions/${num}/content`
}

// getTableContent
export const getTableContentRequest = ({num}: any) => {
  return getApi(`${config.HttpURL}/inscriptions/${num}/content`)
}

//****** index页面 ******
export const getShowOrderDetails = () => {
  return getApi(`${config.HttpURL}/stats/brc-20`)
}

export const getIndexTableData = ({page, pageSize}: any) => {
  return getApi(`${config.HttpURL}/brc-20/tokens?offset=${(page - 1) * pageSize}&limit=${pageSize}&order_by=tx_count`)
}

//***** tick页面 *****

// 获取tick信息
export const getTickInfoRequest = ({tick}: any) => {
  return getApi(`${config.HttpURL}/brc-20/tokens/${tick}`)
}

export const getTickTableData = ({tick, tab, page, pageSize}: any) => {
  return getApi(`${config.HttpURL}/brc-20/tokens/${tick}${tab}?offset=${(page - 1) * pageSize}&limit=${pageSize}`)
}

// getTransfersTable
export const getTransfersTableRequest = ({tick, tab, page, pageSize}: any) => {
  return getApi(
    `${config.HttpURL}/brc-20/activity?ticker=${tick}&offset=${(page - 1) * pageSize}&limit=${pageSize}${tab}`
  )
}

