import { request } from '@/utils/request'
//po单
const getList = function(para) {
  return request({
    api: 'i/want/300348',
    para
  })
}


//编辑PO单
const POlistDetail = function(para) {
  return request({
    api: 'i/want/300349',
    para
  })
}





export { getList,POlistDetail}
