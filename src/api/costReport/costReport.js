import { request } from '@/utils/request'

const getData = (para) => {
  return request({
    api: 'i/want/300318',
    para
  })
}
const Exl = (para) => {
  return request({
    api: 'i/want/300320',
    para
  })
}

const getHistory = (para) => {
  return request({
    api: 'i/want/300319',
    para
  })
}


const HistoryExl = (para) => {
  return request({
    api: 'i/want/300321',
    para
  })
}


export { getData ,Exl , getHistory , HistoryExl}