import { request } from '@/utils/request'

const OrderList = (req) => {
  return request({
    api: 'i/want/300011',
    para: req
  })
}

const ExpCompany = () => {
  return request({
    api: 'i/want/300036'
  })
}

const StoreList = (req) => {
  return request({
    api: 'i/want/300035',
    para: req
  })
}
const getDictionary = () => {
  return request({
    api: 'i/want/300014'
  })
}
const getListFromDictionary = (arr = [], name) => {
  const o = []
  for (var i in arr) {
    const item = arr[i]
    if (item.Name === name) {
      o.push(item)
    }
  }
  return o
}
const ExportOrder = (req) => {
  return request({
    api: 'i/want/300135',
    para: req
  })
}

const UploadExcle = (req) => {
  return request({
    api: 'i/want/300004',
    para: req
  })
}
const SubmitRemark = (req) => {
  return request({
    api: 'i/want/300016',
    para: req
  })
}
const SubmitAddRemark = (req) => {
  return request({
    api: 'i/want/300342',
    para: req
  })
}
const SubMfd = (req) => {
  return request({
    api: 'i/want/300140',
    para: req
  })
}
const SubBack = (req) => {
  return request({
    api: 'i/want/300145',
    para: req
  })
}
const OrderRefund = (req) => {
  return request({
    api: 'i/want/400116',
    para: req
  })
}
const OrderPay = (req) => {
  return request({
    api: 'i/want/300141',
    para: req
  })
}
const CheckBatChPay = (req) => {
  return request({
    api: 'i/want/300005',
    para: req
  })
}
const BatchOrderSend = (req) => {
  return request({
    api: 'i/want/300025',
    para: req
  })
}
const BatchOrderReceive = (req) => {
  return request({
    api: 'i/want/300024',
    para: req
  })
}

const batchSendPayOrder = (req) => {
  return request({
    api: 'i/want/300224',
    para: req
  })
}

const batchSendStore = (req) => {
  return request({
    api: 'i/want/300236',
    para: req
  })
}

const getYCType = (req) => {
  return request({
    api: 'i/want/300249',
    para: req
  })
}

const setYC = (req) => {
  return request({
    api: 'i/want/300250',
    para: req
  })
}

const setFX = (req) => {
  return request({
    api: 'i/want/300251',
    para: req
  })
}

const reZF = (req) => {
  return request({
    api: 'i/want/300252',
    para: req
  })
}

const reDD = (req) => {
  return request({
    api: 'i/want/300253',
    para: req
  })
}

const batchZuoFei = (req) => {
  return request({
    api: 'i/want/300254',
    para: req
  })
}

const batchExitYiChang = (req) => {
  return request({
    api: 'i/want/300255',
    para: req
  })
}

const getQGinfo = (req) => {
  return request({
    api: 'i/want/300256',
    para: req
  })
}
const getYCnum = (req) => {
  return request({
    api: 'i/want/300257',
    para: req
  })
}
// 待出库时标注一场
const markYC = (req) => {
  return request({
    api: 'i/want/300329',
    para: req
  })
}

export {
  getQGinfo,
  getYCnum,
  batchExitYiChang,
  batchZuoFei,
  reZF,
  reDD,
  setFX,
  setYC,
  getYCType,
  batchSendStore,
  ExpCompany,
  OrderList,
  StoreList,
  getDictionary,
  getListFromDictionary,
  ExportOrder, UploadExcle, batchSendPayOrder,
  SubmitRemark,
  SubmitAddRemark,
  OrderRefund,
  SubMfd,
  SubBack,
  OrderPay,
  CheckBatChPay,
  BatchOrderSend,
  BatchOrderReceive,
  markYC
}
