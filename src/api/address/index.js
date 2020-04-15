import {
  request
} from '@/utils/request'

const getAddressData = function(para) {
  return request({
    api: 'i/want/401025',
    para
  })
}

export {
  getAddressData
}
