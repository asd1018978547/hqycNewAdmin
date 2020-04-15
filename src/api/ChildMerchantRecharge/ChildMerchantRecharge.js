import { request } from '@/utils/request'

const getmerchantlist = (para) => {
  return request({
    api: 'i/want/300237',
    para: para
  })
}

const getChildMarginManageList = (para) => {
  return request({
    api: 'i/want/300243',
    para: para
  })
}

const getChildMerchantWalletList = (para) => {
  return request({
    api: 'i/want/300244',
    para: para
  })
}

const changeStatus = (para) => {
  return request({
    api: 'i/want/300245',
    para: para
  })
}
const getChildMerchantDesc = (para) => {
  return request({
    api: 'i/want/300247',
    para: para
  })
}

const getChildMerchantWalletDesc = (para) => {
  return request({
    api: 'i/want/300246',
    para: para
  })
}

export { getmerchantlist, getChildMarginManageList, getChildMerchantWalletList, changeStatus, getChildMerchantWalletDesc, getChildMerchantDesc }
