import { request } from '@/utils/request'

const getParentList = function(para) {
  return request({
    api: 'i/want/300261',
    para
  })
}

const getList = function(para) {
  return request({
    api: 'i/want/300262',
    para
  })
}

const addSettle = (para) => {
  return request({
    api: 'i/want/300260',
    para
  })
}

const checkTime = (para) => {
  return request({
    api: 'i/want/300263',
    para
  })
}

const getAddParentList = (para) => {
  return request({
    api: 'i/want/300264',
    para
  })
}

const getplist = (para) => {
  return request({
    api: 'i/want/300266',
    para
  })
}

const getZD = (para) => {
  return request({
    api: 'i/want/300265',
    para
  })
}

const checkJS = (para) => {
  return request({
    api: 'i/want/300267',
    para
  })
}

const exportExcl = (para) => {
  return request({
    api: 'i/want/300268',
    para
  })
}

const getAllList = (para) => {
  return request({
    api: 'i/want/300269',
    para
  })
}

const setZQ = (para) => {
  return request({
    api: 'i/want/300270',
    para
  })
}

export { getParentList, getList, addSettle, checkTime, getAddParentList, getplist, getZD, checkJS,exportExcl, getAllList, setZQ }