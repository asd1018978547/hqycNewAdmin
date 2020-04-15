import { request } from '@/utils/request'

const getBrandList = function(req) {
  return request({
    api: 'api/Copartner/BrandList',
    para: req,
    urlflag: true
  })
}

const getUnitList = function(req) {
  return request({
    api: 'api/Copartner/UnitList',
    para: req,
    urlflag: true
  })
}
const getStandardList = function(req) {
  return request({
    api: 'api/Copartner/StandardList',
    para: req,
    urlflag: true
  })
}
const getStandardVals = function(req) {
  return request({
    api: 'api/Copartner/StandardValsList',
    para: req,
    urlflag: true
  })
}

const addSkuSpecItem = function(req) {
  return request({
    api: 'api/Copartner/StandardValsAdd',
    para: req,
    urlflag: true
  })
}

const addSkuSpec = function(req) {
  return request({
    api: 'api/Copartner/StandardAdd',
    para: req,
    urlflag: true
  })
}

const addSku = function(req) {
  return request({
    api: 'api/Copartner/SkuAdd',
    para: req,
    urlflag: true
  })
}

const getSkuInfo = function(req) {
  return request({
    api: 'api/Copartner/SkuProfile',
    para: req,
    urlflag: true
  })
}

const editSkuInfo = function(req) {
  return request({
    api: 'api/Copartner/SkuUpdate',
    para: req,
    urlflag: true
  })
}

export { getBrandList,getUnitList,getStandardList,getStandardVals, addSkuSpecItem, addSkuSpec, addSku, getSkuInfo, editSkuInfo }
