import {
  request
} from '@/utils/request'

const addRule = function (para) {
  return request({
    api: 'i/want/300311',
    para
  })
}
//修改数据
const editRule = function (para) {
  return request({
    api: 'i/want/300312',
    para
  })
}
//拿到要修改的数据
const getEditRule = function (para) {
  return request({
    api: 'i/want/300314',
    para
  })
}


export {
  addRule,
  editRule,
  getEditRule
}
