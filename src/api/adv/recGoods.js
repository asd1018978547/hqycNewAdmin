import { request } from '@/utils/request'

const getRecGoodsList = function(para) {
  return request({
    api: 'i/want/300131',
    para
  })
}

const delRecGoods = function(para) {
  return request({
    api: 'i/want/300133',
    para
  })
}

const setRecGoods = function(para) {
  return request({
    api: 'i/want/300134',
    para
  })
}
const getSkuList = function(para) {
  return request({
    api: 'i/want/300058',
    para
  })
}
const getSkuForId = function(para) {
  return request({
    api: 'i/want/300107',
    para
  })
}
const getBrand = function(para) {
  return request({
    api: 'i/want/300022',
    para
  })
}

const editRecGoods = function(para) {
  return request({
    api: 'i/want/300221',
    para
  })
}
const batchChangePrice = function(para) {
  return request({
    api: 'i/want/300271',
    para
  })
}

const exportSkuList = function(para) {
  return request({
    api: 'i/want/300272',
    para
  })
}

export { getRecGoodsList, delRecGoods, getSkuList, getSkuForId, setRecGoods, getBrand, editRecGoods, batchChangePrice, exportSkuList }
