import {
  request
} from '@/utils/request'

const getOrderInfo = (para) => {
  return request({
    api: 'i/want/300116',
    para: para
  })
}

const getOrderGoodsInfo = (para) => {
  return request({
    api: 'i/want/300117',
    para: para
  })
}
const getOrderUserInfo = (para) => {
  return request({
    api: 'i/want/300118',
    para: para
  })
}
const getOrderPayInfo = (para) => {
  return request({
    api: 'i/want/300119',
    para: para
  })
}
const getOrderExpInfo = (para) => {
  return request({
    api: 'i/want/300120',
    para: para
  })
}

const saveStoreInfo = function (para) {
  return request({
    api: 'i/want/300121',
    para
  })
}

const saveAddressInfo = function (para) {
  return request({
    api: 'i/want/300122',
    para
  })
}

const getStoreGoodsInfo = function (para) {
  return request({
    api: 'i/want/300148',
    para
  })
}

const getJSinfo = (para) => {
  return request({
    api: 'i/want/300258',
    para
  })
}
//推送海外仓单个/批量
const sendToOverseaStore = (para) => {
  return request({
    api: 'i/want/300328',
    para: para
  })
}
//仓储信息
const storeInfo = (para) => {
  return request({
    api: 'i/want/300327',
    para: para
  })
}

export {
  getOrderInfo,
  getOrderGoodsInfo,
  getOrderUserInfo,
  getOrderPayInfo,
  getOrderExpInfo,
  saveStoreInfo,
  saveAddressInfo,
  getStoreGoodsInfo,
  getJSinfo,
  sendToOverseaStore,
  storeInfo
}
