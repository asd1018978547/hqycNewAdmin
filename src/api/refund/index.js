import { request } from '@/utils/request'

const editRefund = function(req) {
  return request({
    api: 'i/want/300143',
    para: {
      isRefund: req.isRefund,
      OrderCode: req.OrderCode,
      remarks: req.remarks
    }})
}

const getRefund = function(req) {
  return request({
    api: 'i/want/300144',
    para: req
  })
}
export { editRefund, getRefund }
