import {
  request
} from '@/utils/request'

const getSkuAttr = function (para) {
  return request({
    api: 'i/want/300066',
    para
  })
}

const getSkuSpec = function (para) {
  return request({
    api: 'i/want/300070',
    para
  })
}
const getStoreRest = function (para) {
  return request({
    api: 'i/want/300334',
    para
  })
}

const delSkuAttr = function (para) {
  return request({
    api: 'i/want/300068',
    para
  })
}
const delSkuAttrVal = function (para) {
  return request({
    api: 'i/want/300071',
    para
  })
}

const delSkuSpec = function (para) {
  return request({
    api: 'i/want/300106',
    para
  })
}

const addSkuAttr = function (para) {
  return request({
    api: 'i/want/300067',
    para
  })
}

const addSkuAttrVal = function (para) {
  return request({
    api: 'i/want/300069',
    para
  })
}

const getSkuSpecList = function (para) {
  return request({
    api: 'i/want/300061',
    para
  })
}

const addSkuSpecList = function (para) {
  return request({
    api: 'i/want/300072',
    para
  })
}

export {
  getSkuAttr,
  getSkuSpec,
  delSkuAttr,
  delSkuSpec,
  delSkuAttrVal,
  addSkuAttr,
  addSkuAttrVal,
  getSkuSpecList,
  addSkuSpecList,
  getStoreRest
}
