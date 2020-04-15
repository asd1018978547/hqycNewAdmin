import { request } from '@/utils/request'

// 获取物流模版
const getExpTemp = function(para) {
  return request({
    api: 'i/want/300138',
    para
  })
}

// 新增SKU
const addSku = function(para) {
  return request({
    api: 'i/want/300019',
    para
  })
}

// 编辑SKU
const editSku = function(para) {
  return request({
    api: 'i/want/300075',
    para
  })
}

// 获取SKU商品信息
const getSkuGoods = function(para) {
  return request({
    api: 'i/want/300033',
    para,
  })
}

// 获取SKU关联商品信息
const gethHQYCSKU = function(para) {
  return request({
    api: 'api/Copartner/HQYCSKUList',
    para:para,
    urlflag : true
  })
}

// 获取sku商品分类列表
const getSkuGoodsList = function(para) {
  return request({
    api: 'i/want/300058',
    para
  })
}

// 获取SKU
const getSkuInfo = function(para) {
  return request({
    api: 'i/want/300074',
    para
  })
}

// 根据SKUID获取备货信息
const getQuoteBySkuId = function(para) {
  return request({
    api: 'i/want/300078',
    para
  })
}

// 获取当前SKU选择的规格
const getSkuChoiceProp = (para) => {
  return request({
    api: 'i/want/300156',
    para
  })
}

// 根据skuid获取选中的属性
const getAttrBySkuId = function(para) {
  return request({
    api: 'i/want/300155',
    para
  })
}

// 修改对应SKUid下属性
const editAttrBySkuid = function(para) {
  return request({
    api: 'i/want/300077',
    para
  })
}

// 修改对应skuid下规格和备货信息
const editSpecBySkuid = function(para) {
  return request({
    api: 'i/want/300110',
    para
  })
}

// 删除sku图片
const delSkuImage = function(para) {
  return request({
    api: 'i/want/100007',
    para
  })
}

export { getSkuChoiceProp, getExpTemp, addSku, editSku, getSkuInfo, getSkuGoods, getSkuGoodsList, getQuoteBySkuId, getAttrBySkuId, editAttrBySkuid, editSpecBySkuid, delSkuImage,gethHQYCSKU }
