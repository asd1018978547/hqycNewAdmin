import { request } from '@/utils/request'

const getNewsList = (para) => {
  return request({
    api: 'i/want/300172',
    para: para
  })
}

const getLabelList = (para) => {
  return request({
    api: 'i/want/300169',
    para: para
  })
}

const delNews = (para) => {
  return request({
    api: 'i/want/300171',
    para: para
  })
}

const editNews = (para) => {
  return request({
    api: 'i/want/300170',
    para: para
  })
}

const getNews = (para) => {
  return request({
    api: 'i/want/300173',
    para: para
  })
}

const delTag = (para) => {
  return request({
    api: 'i/want/300168',
    para: para
  })
}

const addTag = (para) => {
  return request({
    api: 'i/want/300167',
    para: para
  })
}

export { getNewsList, getLabelList, delNews, editNews, getNews, delTag, addTag }
