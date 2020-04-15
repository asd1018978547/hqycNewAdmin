import { request } from '@/utils/request'

const getSkuInfoList = (para) => {
  return request({
    api: 'i/want/300123',
    para: para
  })
}

const getAllUsers = (para) => {
  return request({
    api: 'i/want/300037',
    para: para
  })
}

const sumitAdd = (para) => {
  return request({
    api: 'i/want/300034',
    para: para
  })
}

export { getSkuInfoList, getAllUsers, sumitAdd }
