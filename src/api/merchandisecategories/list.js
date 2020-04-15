import { request } from '@/utils/request'

const getGoodsList = function(para) {
  return request({
    api: 'i/want/300043',
    para
  })
}

const delGoods = function(para) {
  return request({
    api: 'i/want/300047',
    para
  })
}

const exportGoods = function(para) {
  return request({
    api: 'i/want/300136',
    para
  })
}
//备案接口
const FilingGoods = function(para) {
  return request({
    api: 'i/want/300316',
    para
  })
}
export { getGoodsList, delGoods, exportGoods ,FilingGoods}
