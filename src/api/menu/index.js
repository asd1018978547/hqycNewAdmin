import { request } from '@/utils/request'

const getMenu = function(para) {
  return request({
    api: 'i/want/300007',
    para
  })
}

const getSelectOptions = function(para) {
  return request({
    api: 'i/want/300014',
    para
  })
}

export { getMenu, getSelectOptions }