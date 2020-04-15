import { request } from '@/utils/request'

const getBtnList = (para) => {
  return request({
    api: 'i/want/300174',
    para: para
  })
}

const delBtn = (para) => {
  return request({
    api: 'i/want/300179',
    para: para
  })
}

const addBtn = (para) => {
  return request({
    api: 'i/want/300177',
    para: para
  })
}

const editBtn = (para) => {
  return request({
    api: 'i/want/300178',
    para: para
  })
}

const addMenuBtn = (para) => {
  return request({
    api: 'i/want/300175',
    para: para
  })
}

const delMenuBtn = (para) => {
  return request({
    api: 'i/want/300176',
    para: para
  })
}

export { getBtnList, delBtn, addBtn, editBtn, addMenuBtn, delMenuBtn }
