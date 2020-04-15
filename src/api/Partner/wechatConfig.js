import { request } from '@/utils/request'

const getAuthCodeAppList = function(req) {
  return request({
    api: 'api/CodeApp/AuthCodeAppList',
    para: req,
    urlflag: true
  })
}

//提交代码

const getTemplateList = (req) => {
  return request({
    api: 'api/CodeApp/TemplateList',
    para: req,
    urlflag: true
  })
}
const comcode = (req) => {
  return request({
    api: 'api/CodeApp/ComitCode',
    para: req,
    urlflag: true
  })
}
//设置模板消息
const getTemplateMsgList = (req) => {
  return request({
    api: 'api/CodeApp/TemplateMsgList',
    para: req,
    urlflag: true
  })
}

const SetSupplierTmpMsg = (req) => {
  return request({
    api: 'api/CodeApp/SetSupplierTmpMsg',
    para: req,
    urlflag: true
  })
}
//审核
const setCategoryCode = (req) => {
  return request({
    api: 'api/CodeApp/CategoryCode',
    para: req,
    urlflag: true
  })
}
const setPageCode = (req) => {
  return request({
    api: 'api/CodeApp/PageCode',
    para: req,
    urlflag: true
  })
}
const SubmitAuditCode = (req) => {
  return request({
    api: 'api/CodeApp/SubmitAuditCode',
    para: req,
    urlflag: true
  })
}
//撤销审核
const unAuditCode = (req) => {
  return request({
    api: 'api/CodeApp/UnAuditCode',
    para: req,
    urlflag: true
  })
}
//设置域名
const setSetAuthDomain = (req) => {
  return request({
    api: 'api/CodeApp/SetAuthDomain',
    para: req,
    urlflag: true
  })
}
//发布
const releaseCode = (req) => {
  return request({
    api: 'api/CodeApp/ReleaseCode',
    para: req,
    urlflag: true
  })
}
//版本回退
const rollbackCode = (req) => {
  return request({
    api: 'api/CodeApp/RollbackCode',
    para: req,
    urlflag: true
  })
}
//状态查询
const auditStatusCode = (req) => {
  return request({
    api: 'api/CodeApp/AuditStatusCode',
    para: req,
    urlflag: true
  })
}

export {SubmitAuditCode, SetSupplierTmpMsg,getAuthCodeAppList,auditStatusCode,rollbackCode,releaseCode,setSetAuthDomain,unAuditCode,setPageCode,setCategoryCode,getTemplateMsgList,comcode,getTemplateList }
