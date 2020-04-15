import { request } from '@/utils/request'

const getSupplierSettlementWaittingList = function(req) {
  return request({
    api: 'api/Copartner/SupplierSettlementWaittingList',
    para: req,
    urlflag: true
  })
}

const getSupplierSettlementDoneList = function(req) {
  return request({
    api: 'api/Copartner/SupplierSettlementDoneList',
    para: req,
    urlflag: true
  })
}

const setSupplierDoSettlement = function(req) {
  return request({
    api: 'api/Copartner/SupplierDoSettlement',
    para: req,
    urlflag: true
  })
}

export { getSupplierSettlementWaittingList, getSupplierSettlementDoneList, setSupplierDoSettlement }
