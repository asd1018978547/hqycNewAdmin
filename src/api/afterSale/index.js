import {
  request
} from '@/utils/request'

//退款售后-退款金额计算
const sumBackMoney = function (para) {
  return request({
    api: 'i/want/401042',
    para
  });
}
//退款售后-发起退款
const submitPayBack = function (para) {
  return request({
    api: 'i/want/401038',
    para
  });
}
//退款售后-退款类型及原因
const getPayBackType = function (para) {
  return request({
    api: 'i/want/401035',
    para
  });
}
//退款售后-订单详情
const getPayBackList = function (para) {
  return request({
    api: 'i/want/401034',
    para
  });
}

export {
  sumBackMoney,
  submitPayBack,
  getPayBackType,
  getPayBackList
}
