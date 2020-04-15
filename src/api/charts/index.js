import { request } from '@/utils/request'

const getCharts = (para) => {
  return request({
    api: 'i/want/300146',
    para
  })
}

const getProfit = (para) => {
  return request({
    api: 'i/want/300158',
    para
  })
}

const getProfitUserList = (para) => {
  return request({
    api: 'i/want/300159',
    para
  })
}

const exportData = (para) => {
  return request({
    api: 'i/want/300160',
    para
  })
}

const getSkuSalesReport = (para) => {
  return request({
    api: 'i/want/300165',
    para
  })
}

const expoerSkuSalesReport = (para) => {
  return request({
    api: 'i/want/300166',
    para
  })
}

const exportBrandReach = (para) => {
  return request({
    api: 'i/want/300275',
    para
  })
}

const getBrandReach = (para) => {
  return request({
    api: 'i/want/300277',
    para
  })
}

const exportBrandReachData = (para) => {
  return request({
    api: 'i/want/300276',
    para
  })
}


const gethezuozhedachebaobiao = (para) => {
  return request({
    api: 'i/want/300288',
    para
  })
}

const daochuhezuozhedachebaobiao = (para) => {
  return request({
    api: 'i/want/300289',
    para
  })
}

export { gethezuozhedachebaobiao,daochuhezuozhedachebaobiao,getCharts, getProfit, getProfitUserList, exportData, getSkuSalesReport, expoerSkuSalesReport, exportBrandReach, getBrandReach, exportBrandReachData }
