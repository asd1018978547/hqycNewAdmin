import { request } from '@/utils/request'

const getRoleList = function(para) {
  return request({
    api: 'i/want/300096',
    para
  })
}

const getUserRoleList = function(para) {
  return request({
    api: 'i/want/300090',
    para
  })
}

const addUserRole = function(para) {
  return request({
    api: 'i/want/300097',
    para
  })
}

const editUserInfo = function(para) {
  return request({
    api: 'i/want/300100',
    para
  })
}
const getUserInfo = function(para) {
  return request({
    api: 'i/want/300099',
    para
  })
}

const changePwd = function(para) {
  return request({
    api: 'i/want/300108',
    para
  })
}

const lockUser = function(para) {
  return request({
    api: 'i/want/300098',
    para
  })
}

const userLoginOut = function(para) {
  return request({
    api: 'i/want/300003',
    para
  })
}

export { getRoleList, getUserRoleList, addUserRole, editUserInfo, getUserInfo, changePwd, lockUser, userLoginOut }
