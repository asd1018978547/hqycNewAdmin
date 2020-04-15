import { request } from '@/utils/request'

const getBondMoneyList = (para) => {
  return request({
    api: 'i/want/300241',
    para: para
  })
}

const getBondMoneyForId = (para) => {
  return request({
    api: 'i/want/300240',
    para: para
  })
}

const addBondMoney = (para) => {
  return request({
    api: 'i/want/300238',
    para: para
  })
}

const editBondMoney = (para) => {
  return request({
    api: 'i/want/300239',
    para: para
  })
}

const getAddBondMoneyList = (para) => {
  return request({
    api: 'i/want/300242',
    para: para
  })
}

export { getBondMoneyList, getBondMoneyForId, addBondMoney, editBondMoney, getAddBondMoneyList }
