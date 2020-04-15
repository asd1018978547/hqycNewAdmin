import { request } from '@/utils/request'

const getKeyword = (para) => {
  return request({
    api: 'i/want/300200',
    para: para
  })
}

const addKeyword = (para) => {
  return request({
    api: 'i/want/300201',
    para: para
  })
}

const editKeyword = (para) => {
  return request({
    api: 'i/want/300202',
    para: para
  })
}

const dekKeyword = (para) => {
  return request({
    api: 'i/want/300203',
    para: para
  })
}

export { getKeyword, addKeyword, editKeyword, dekKeyword }
