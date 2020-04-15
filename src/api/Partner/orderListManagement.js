import { request } from '@/utils/request'

const getSupplierOrderList = function(req) {
  return request({
    api: 'api/Copartner/SupplierOrderList',
    para: req,
    urlflag: true
  })
}

const getSupplierOrderDetail = function(req) {
  return request({
    api: 'api/Copartner/SupplierOrderDetail',
    para: req,
    urlflag: true
  })
}

export { getSupplierOrderList, getSupplierOrderDetail }
