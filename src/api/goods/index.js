import { request } from '@/utils/request'

const addGoods = function(para) {
  return request({
    api: 'i/want/300046',
    para
  })
}

const editGoods = function(para) {
  return request({
    api: 'i/want/300101',
    para
  })
}

const delGoodsSpec = function(para) {
  return request({
    api: 'i/want/300102',
    para
  })
}
const getGoodsSpecList = function(para) {
  return request({
    api: 'i/want/300048',
    para
  })
}

const getMoreSpecList = function(para) {
  return request({
    api: 'i/want/300049',
    para
  })
}

const addMoreSpec = function(para) {
  return request({
    api: 'i/want/300050',
    para
  })
}

const delMoreSpec = function(para) {
  return request({
    api: 'i/want/300051',
    para
  })
}

const addSpecGoods = function(para) {
  return request({
    api: 'i/want/300052',
    para
  })
}

const getStoreList = function(para) {
  return request({
    api: 'i/want/300053',
    para
  })
}

const saveEditStoreList = function(para) {
  return request({
    api: 'i/want/300054',
    para
  })
}

export { addGoods, getGoodsSpecList, getMoreSpecList, addMoreSpec, delMoreSpec, delGoodsSpec, addSpecGoods, getStoreList, saveEditStoreList, editGoods }
