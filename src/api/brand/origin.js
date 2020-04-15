import { request } from '@/utils/request'

const getOriginList = function(para) {
  return request({
    api: 'i/want/300021',
    para
  })
}

const editOrigin = function(para) {
  return request({
    api: 'i/want/300111',
    para
  })
}

export { getOriginList, editOrigin }
