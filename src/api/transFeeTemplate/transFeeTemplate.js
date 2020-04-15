import { request } from '@/utils/request'

const getTransFeeTemplateList = function(para) {
  return request({
    api: 'i/want/300208',
    para
  })
}

const delTransFeeTemplate = function(para) {
  return request({
    api: 'i/want/300211',
    para
  })
}

const getTransFeeTemplateInfo = (para) => {
  return request({
    api: 'i/want/300222',
    para
  })
}

const addTransFeeTemplate = (para) => {
  return request({
    api: 'i/want/300209',
    para
  })
}

const editTransFeeTemplate = (para) => {
  return request({
    api: 'i/want/300210',
    para
  })
}

export { getTransFeeTemplateList, delTransFeeTemplate, getTransFeeTemplateInfo, addTransFeeTemplate, editTransFeeTemplate }
