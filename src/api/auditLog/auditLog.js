import { request } from '@/utils/request'

const getAuditLog = function(para) {
  return request({
    api: 'i/want/100014',
    para
  })
}

const getAuditLogInfo = function(para) {
  return request({
    api: 'i/want/100017',
    para
  })
}
const getAuditPlate = function(para) {
  return request({
    api: 'i/want/100015',
    para
  })
}

const getAuditPlateInfo = function(para) {
  return request({
    api: 'i/want/100016',
    para
  })
}

export { getAuditLog, getAuditPlate, getAuditPlateInfo, getAuditLogInfo }
