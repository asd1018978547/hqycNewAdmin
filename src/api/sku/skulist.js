import { request } from '@/utils/request'

const delSkuGoods = function(para) {
  return request({
    api: 'i/want/300073',
    para
  })
}

const downSkuGoods = function(para) {
  return request({
    api: 'i/want/300082',
    para
  })
}

const gethisprice = function(para) {
  return request({
    api: 'i/want/300290',
    para
  })
}

export { delSkuGoods, downSkuGoods, gethisprice }
