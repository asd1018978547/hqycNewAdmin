import { request } from '@/utils/request'

const getAttr = function(para) {
  return request({
    api: 'i/want/300154',
    para
  })
}

const addAttr = (para) => {
  return request({
    api: 'i/want/300149',
    para
  })
}

const delAttr = (para) => {
  return request({
    api: 'i/want/300150',
    para
  })
}

const addAttrProp = (para) => {
  return request({
    api: 'i/want/300152',
    para
  })
}

const delAttrProp = (para) => {
  return request({
    api: 'i/want/300153',
    para
  })
}

export { getAttr, addAttr, delAttr, addAttrProp, delAttrProp }
