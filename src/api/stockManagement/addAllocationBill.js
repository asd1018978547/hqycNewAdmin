import { request } from '@/utils/request'

const getList = function(para) {
  return request({
    api: 'i/want/300340',
    para
  })
}


//新增调拨单
const addAllocate = function(para) {
  return request({
    api: 'i/want/300337',
    para
  })
}





export { getList,addAllocate}
