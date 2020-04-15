import { request } from '@/utils/request'

const getIndexData = function(para) {
  return request({
    api: 'i/want/300161',
    para
  })
}

const getIndexTableData = function(para) {
  return request({
    api: 'i/want/300162',
    para
  })
}

const getIndexRankData = function(para) {
  return request({
    api: 'i/want/300163',
    para
  })
}

const getIndexPieData = function(para) {
  return request({
    api: 'i/want/300164',
    para
  })
}

export { getIndexData, getIndexTableData, getIndexRankData, getIndexPieData }
