import { request } from '@/utils/request'
const getAdvList = function(para) {
  return request({
    api: 'i/want/300124',
    para
  })
}
const disAdv = function(para) {
  return request({
    api: 'i/want/300125',
    para
  })
}

const getAdvLocation = function(para) {
  return request({
    api: 'i/want/300130',
    para
  })
}
const getAdvPlate = function(para) {
  return request({
    api: 'i/want/300129',
    para
  })
}
const getAdvInfo = function(para) {
  return request({
    api: 'i/want/300126',
    para
  })
}

const addAdv = function(para) {
  return request({
    api: 'i/want/300127',
    para
  })
}

const editAdv = function(para) {
  return request({
    api: 'i/want/300128',
    para
  })
}

export { getAdvList, disAdv, getAdvPlate, getAdvLocation, getAdvInfo, addAdv, editAdv }
