import { request } from '@/utils/request'

const getSharingTemplateGet = function(req) {
  return request({
    api: 'api/Copartner/SharingTemplateGet',
    para: req,
    urlflag: true
  })
}

const getSupplierSettingsShopGet = function(req) {
  return request({
    api: 'api/Copartner/SupplierSettingsShopGet',
    para: req,
    urlflag: true
  })
}

const saveSupplierSettingsShopGet = function(req) {
  return request({
    api: 'api/Copartner/SupplierSettingsShopSet',
    para: req,
    urlflag: true
  })
}

const getSupplierSettingsMngrGet = function(req) {
  return request({
    api: 'api/Copartner/SupplierSettingsMngrGet',
    para: req,
    urlflag: true
  })
}
const saveSupplierSettingsMngrSet = function(req) {
  return request({
    api: 'api/Copartner/SupplierSettingsMngrSet',
    para: req,
    urlflag: true
  })
}

const getSupplierSettingsBaseInfoGet = function(req) {
  return request({
    api: 'api/Copartner/SupplierSettingsBaseInfoGet',
    para: req,
    urlflag: true
  })
}

const saveSupplierSettingsBaseInfoSet = function(req) {
  return request({
    api: 'api/Copartner/SupplierSettingsBaseInfoSet',
    para: req,
    urlflag: true
  })
}

export { saveSupplierSettingsBaseInfoSet,getSharingTemplateGet,getSupplierSettingsShopGet,saveSupplierSettingsShopGet, getSupplierSettingsMngrGet,saveSupplierSettingsMngrSet, getSupplierSettingsBaseInfoGet }
