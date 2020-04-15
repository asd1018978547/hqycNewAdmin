import { request } from '@/utils/request'

const editSKUType = function(para) {
  return request({
    api: 'i/want/300059',
    para
  })
}

const addSKUType = function(para) {
  return request({
    api: 'i/want/300090',
    para
  })
}

const delSKUType = function(para) {
  return request({
    api: 'i/want/300060',
    para
  })
}

const getReSkuTypeList = (para) => {
  return request({
    api: 'i/want/300299',
    para
  })
}
const editSkuTypeList = (para) => {
  return request({
    api: 'i/want/300295',
    para
  })
}
const delSkuTypeList = (para) => {
  return request({
    api: 'i/want/300296',
    para
  })
}

export { editSKUType, addSKUType, delSKUType,getReSkuTypeList, editSkuTypeList,delSkuTypeList }
