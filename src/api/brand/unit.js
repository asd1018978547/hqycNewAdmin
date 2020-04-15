import { request } from '@/utils/request'

const getUnitList = function(para) {
  return request({
    api: 'i/want/300023',
    para
  })
}

const editUnit = function(para) {
  return request({
    api: 'i/want/300112',
    para
  })
}

export { getUnitList, editUnit }
