import { request } from '@/utils/request'

const getActivityAreaList = function(para) {
  return request({
    api: 'i/want/300279',
    para
  })
}

const setActivityArea = function(para) {
  return request({
    api: 'i/want/300280',
    para
  })
}

const addActivityArea = function(para) {
  return request({
    api: 'i/want/300281',
    para
  })
}

const getActivityArea = function(para) {
  return request({
    api: 'i/want/300283',
    para
  })
}

const editActivityArea = function(para) {
  return request({
    api: 'i/want/300282',
    para
  })
}

export { getActivityAreaList, setActivityArea, addActivityArea, getActivityArea, editActivityArea }
