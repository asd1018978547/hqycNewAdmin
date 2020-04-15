import { request } from '@/utils/request'

const getList = function(para) {
  return request({
    api: 'i/want/300330',
    para
  })
}

const getWarehouseList = function(para) {
  return request({
    api: 'i/want/300331',
    para
  })
}

const del = function(para) {
  return request({
    api: 'i/want/300336',
    para
  })
}


const ExportOrder = function(para) {
  return request({
    api: 'i/want/300341',
    para
  })
}






export { getList,getWarehouseList ,del,ExportOrder}
