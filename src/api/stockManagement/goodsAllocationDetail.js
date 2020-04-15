import { request } from '@/utils/request'

const getBase = function(para) {
  return request({
    api: 'i/want/300332',
    para
  })
}

const getGoods = function(para) {
  return request({
    api: 'i/want/300333',
    para
  })
}

const getReview = function(para) {
  return request({
    api: 'i/want/300335',
    para
  })
}


export { getBase ,getGoods, getReview}
