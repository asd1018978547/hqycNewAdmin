import { request } from '@/utils/request'

const getRetailTraderList = function(para) {
  return request({
    api: 'i/want/300231',
    para
  })
}

const getRetailTraderSkuList = (para) => {
  return request({
    api: 'i/want/300225',
    para
  })
}
const getRetailTraderInfo = (para) => {
  return request({
    api: 'i/want/300232',
    para
  })
}

const addRetailTraderSku = (para) => {
  return request({
    api: 'i/want/300226',
    para
  })
}

const upDownSku = (para) => {
  return request({
    api: 'i/want/300227',
    para
  })
}

const editPrice = (para) => {
  return request({
    api: 'i/want/300233',
    para
  })
}

const delSku = (para) => {
  return request({
    api: 'i/want/300228',
    para
  })
}

const editSkuSpecs = (para) => {
  return request({
    api: 'i/want/300235',
    para
  })
}

const editSkuTime = (para) => {
  return request({
    api: 'i/want/300259',
    para
  })
}

const batchCreate = (para) => {
  return request({
    api: 'i/want/300297',
    para
  })
}

const shenhetongyi = (para) => {
  return request({
    api: 'i/want/300292',
    para
  })
}

const getfenxiaoshangskugaijie = (para) => {
  return request({
    api: 'i/want/300294',
    para
  })
}

const daochusku = (para) => {
  return request({
    api: 'i/want/300298',
    para
  })
}

export {
  batchCreate,
  daochusku,
  shenhetongyi,
  getfenxiaoshangskugaijie,
  getRetailTraderList,
  getRetailTraderSkuList,
  getRetailTraderInfo,
  addRetailTraderSku,
  upDownSku,
  editPrice,
  delSku,
  editSkuSpecs,
  editSkuTime
}
