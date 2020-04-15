import { request } from '@/utils/request'

const getRole = function(para) {
  return request({
    api: 'i/want/300091',
    para
  })
}

const addRole = function(para) {
  return request({
    api: 'i/want/300092',
    para
  })
}

const getRoleInfo = function(para) {
  return request({
    api: 'i/want/300094',
    para
  })
}

const editRole = function(para) {
  return request({
    api: 'i/want/300095',
    para
  })
}

export { getRole, addRole, getRoleInfo, editRole }
