import {
  request
} from '@/utils/request'

//直邮打包单列表
const getDMList = (para) => {
  return request({
    api: 'i/want/300343',
    para: para
  })
}
//直邮打包单新增
const createDM = (para) => {
  return request({
    api: 'i/want/300344',
    para: para
  })
}
//直邮打包单-查看详情
const getDMDetail = (para) => {
  return request({
    api: 'i/want/300345',
    para: para
  })
}
//直邮打包单-编辑
const editDMList = (para) => {
  return request({
    api: 'i/want/300346',
    para: para
  })
}
//直邮打包单-删除
const delDM = (para) => {
  return request({
    api: 'i/want/300347',
    para: para
  })
}

export {
  getDMList,
  createDM,
  delDM,
  editDMList,
  getDMDetail
}
