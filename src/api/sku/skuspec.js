import { request } from '@/utils/request'

const getSkuSpecList = function(para) {
  return request({
    api: 'i/want/300061',
    para
  })
}

const addSkuSpec = function(para) {
  return request({
    api: 'i/want/300062',
    para
  })
}

const addSkuSpecItem = function(para) {
  return request({
    api: 'i/want/300064',
    para
  })
}

const delSkuSpec = function(para) {
  return request({
    api: 'i/want/300063',
    para
  })
}

const delSkuSpecItem = function(para) {
  return request({
    api: 'i/want/300065',
    para
  })
}

export { getSkuSpecList, delSkuSpec, delSkuSpecItem, addSkuSpec, addSkuSpecItem }
