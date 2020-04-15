import { request } from '@/utils/request'

const getskulist = function(req) {
  return request({
    api: 'api/Copartner/SkuList',
    para: req,
    urlflag: true
  })
}

const getCategoryAll = (req) => {
  return request({
    api: 'api/Copartner/CategoryAll',
    para: req,
    urlflag: true
  })
}

const setSkuOnOffLine = (req) => {
  return request({
    api: 'api/Copartner/SkuOnOffLine',
    para: req,
    urlflag: true
  })
}

const delsku = (req) => {
  return request({
    api: 'api/Copartner/SkuDel',
    para: req,
    urlflag: true
  })
}

const delcate = (req) => {
  return request({
    api: 'api/Copartner/CategoryDel',
    para: req,
    urlflag: true
  })
}

const updatecate = (req) => {
  return request({
    api: 'api/Copartner/CategorySetup',
    para: req,
    urlflag: true
  })
}

export { getskulist, getCategoryAll, setSkuOnOffLine, delsku, delcate, updatecate }
