import { request } from '@/utils/request'

const getBrandList = function(para) {
  return request({
    api: 'i/want/300022',
    para
  })
}

const addBrand = function(para) {
  return request({
    api: 'i/want/300113',
    para
  })
}

const editBrand = function(para) {
  return request({
    api: 'i/want/300114',
    para
  })
}

const delBrand = function(para) {
  return request({
    api: 'i/want/300115',
    para
  })
}

const getBrandScale = function(para) {
  return request({
    api: 'i/want/300273',
    para
  })
}

const addBrandScale = function(para) {
  return request({
    api: 'i/want/300274',
    para
  })
}

export { getBrandList, addBrand, editBrand, delBrand, getBrandScale, addBrandScale }
