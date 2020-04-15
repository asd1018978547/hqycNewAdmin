import { request } from '@/utils/request'

// 获取商户列表
const getList = function(para) {
  return request({
    api: 'i/want/400096',
    para
  })
}

// 修改商户信息
const editUser = function(para) {
  return request({
    api: 'i/want/400098',
    para
  })
}

// 新增商户
const addUser = function(para) {
  return request({
    api: 'i/want/400097',
    para
  })
}

// 获取认证列表
const getAuthList = function(para) {
  return request({
    api: 'i/want/400100',
    para
  })
}

// 获取认证详情
const getAuthDesc = function(para) {
  return request({
    api: 'i/want/400102',
    para
  })
}

// 获取商户等级列表
const getUserRank = function(para) {
  return request({
    api: 'i/want/400107',
    para
  })
}

// 提交商户认证
const submitAuth = function(para) {
  return request({
    api: 'i/want/400101',
    para
  })
}

// 获取所有的商户级别
const getLevel = function(para) {
  return request({
    api: 'i/want/400093',
    para
  })
}

// 新增商户级别
const addLevel = function(para) {
  return request({
    api: 'i/want/400094',
    para
  })
}

// 编辑商户级别
const editLevel = function(para) {
  return request({
    api: 'i/want/400095',
    para
  })
}

// 删除商户级别
const delLevel = function(para) {
  return request({
    api: 'i/want/400099',
    para
  })
}

// 获取合作者列表
const getRetailerList = (para) => {
  return request({
    api: 'i/want/401026',
    para
  })
}

// 获取商户详细资料
const getRetailerDesc = (para) => {
  return request({
    api: 'i/want/401027',
    para
  })
}

const getmanalist = (para) => {
  return request({
    api: 'i/want/300285',
    para
  })
}

const getkehujihua = (para) => {
  return request({
    api: 'i/want/300286',
    para
  })
}

const editjihua = (para) => {
  return request({
    api: 'i/want/300287',
    para
  })
}

export { editjihua,getkehujihua,getmanalist,getList, editUser, addUser, getAuthList, getAuthDesc, getUserRank, submitAuth, getLevel, addLevel, editLevel, delLevel, getRetailerList, getRetailerDesc }
