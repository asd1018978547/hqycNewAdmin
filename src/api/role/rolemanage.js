import { request } from '@/utils/request'

const getRoleList = function(para) {
  return request({
    api: 'i/want/300090',
    para
  })
}
const delRole = function(para) {
  return request({
    api: 'i/want/300093',
    para
  })
}

export { getRoleList, delRole }
