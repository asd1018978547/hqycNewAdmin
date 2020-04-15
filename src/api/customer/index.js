import { request } from '@/utils/request'

const getCustomer = function(para) {
  return request({
    api: 'i/want/401005',
    para
  })
}

const editCustomer = (para) => {
  return request({
    api: 'i/want/401006',
    para
  })
}

const delCustomer = (para) => {
  return request({
    api: 'i/want/401007',
    para
  })
}

export { getCustomer, editCustomer, delCustomer }
