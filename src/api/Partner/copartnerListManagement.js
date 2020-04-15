import { request } from '@/utils/request'

const getPartnerList = function(req) {
  return request({
    api: 'api/Copartner/PartnerList',
    para: req,
    urlflag: true
  })
}

const setPartnerShowAll = (req) => {
  return request({
    api: 'api/Copartner/PartnerShowAllSet',
    para: req,
    urlflag: true
  })
}
const setPartnerStatus = (req) => {
  return request({
    api: 'api/Copartner/PartnerStatusSet',
    para: req,
    urlflag: true
  })
}

const exportxml = (req) => {
  return request({
    api: 'api/Copartner/PartnerExport',
    para: req,
    urlflag: true
  })
}

const CommissionMethodSet = (req) => {
  return request({
    api: 'api/Copartner/PartnerCommissionMethodSet',
    para: req,
    urlflag: true
  })
}

export { getPartnerList, setPartnerShowAll, setPartnerStatus, exportxml ,CommissionMethodSet}
