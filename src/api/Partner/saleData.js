import { request } from '@/utils/request'

const getSupplierRptSalesList = function(req) {
  return request({
    api: 'api/Copartner/SupplierRptSalesList',
    para: req,
    urlflag: true
  })
}

const getSupplierRptGoodsList = function(req) {
  return request({
    api: 'api/Copartner/SupplierRptGoodsList',
    para: req,
    urlflag: true
  })
}

export { getSupplierRptSalesList,getSupplierRptGoodsList  }
