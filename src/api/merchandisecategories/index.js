import { request } from '@/utils/request'

const getList = function(para) {
  return request({
    api: 'i/want/300042',
    para
  })
}

const add = function(para) {
  return request({
    api: 'i/want/300044',
    para
  })
}

const del = function(para) {
  return request({
    api: 'i/want/300045',
    para
  })
}
export { getList, add, del }
