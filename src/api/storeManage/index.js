import { request } from '@/utils/request'

const getStoreList = function(para) {
  return request({
    api: 'i/want/300035',
    para
  })
}

const getStoreAddress = function(para) {
  return request({
    api: 'i/want/300021',
    para
  })
}

const editStore = function(para) {
  return request({
    api: 'i/want/300057',
    para
  })
}

const delStore = function(para) {
  return request({
    api: 'i/want/300056',
    para
  })
}

const addStore = function(para) {
  return request({
    api: 'i/want/300055',
    para
  })
}
export { getStoreList, editStore, addStore, delStore, getStoreAddress }
