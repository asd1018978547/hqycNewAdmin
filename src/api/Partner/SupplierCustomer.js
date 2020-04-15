import { request } from '@/utils/request'

const getSupplierCustomerList = function(req) {
  return request({
    api: 'api/Copartner/SupplierCustomerList',
    para: req,
    urlflag: true
  })
}

const getSkuCommentList = function(req) {
  return request({
    api: 'api/Copartner/SkuCommentList',
    para: req,
    urlflag: true
  })
}

export { getSupplierCustomerList, getSkuCommentList }
