import {
  request
} from '@/utils/request'

const getList = (para) => {
  return request({
    api: 'i/want/300322',
    para: para
  })
}

const getExcel = (para) => {
  return request({
    api: 'i/want/300323',
    para: para
  })
}

//商品批次列表查询
const getPCList = (para) => {
  return request({
    api: 'i/want/300324',
    para: para
  })
}
//商品批次导出excel
const getPCExcelList = (para) => {
  return request({
    api: 'i/want/300325',
    para: para
  })
}

//商品批次详情
const getBase = (para) => {
  return request({
    api: 'i/want/300339',
    para: para
  })
}

//商品批次库存渠道详情
const getData = (para) => {
  return request({
    api: 'i/want/300338',
    para: para
  })
}



export {
  getList,
  getExcel,
  getPCList,
  getPCExcelList,
  getBase,
  getData
}
