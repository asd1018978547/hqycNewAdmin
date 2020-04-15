import { request } from '@/utils/request'


const getRefund = function (req) {
    return request({
        api: 'i/want/300144',
        para: req
    })
}


const ExportOrder = function (req) {
    return request({
        api: 'i/want/300317',
        para: req
    })
}


const getGoods= function (req) {
    return request({
        api: 'i/want/300300',
        para: req
    })
}


const getImage = function (req) {
    return request({
        api: 'i/want/300302',
        para: req
    })
}

const getAfterSale = function (req) {
    return request({
        api: 'i/want/300301',
        para: req
    })
}

const getExp= function (req) {
    return request({
        api: 'i/want/300303',
        para: req
    })
}

const getHistory= function (req) {
    return request({
        api: 'i/want/300304',
        para: req
    })
}

const getRefundAmount= function (req) {
    return request({
        api: 'i/want/300308',
        para: req
    })
}


//客服审核
const serviceReview= function (req) {
    return request({
        api: 'i/want/300305',
        para: req
    })
}
//财务审核
const financeReview= function (req) {
    return request({
        api: 'i/want/300307',
        para: req
    })
}
//确认收货
const confirmReceipt= function (req) {
    return request({
        api: 'i/want/300306',
        para: req
    })
}

const modifyMoney= function (req) {
    return request({
        api: 'i/want/300309',
        para: req
    })
}


export {ExportOrder, getRefund,getImage,getAfterSale,getExp,serviceReview ,financeReview ,confirmReceipt,getGoods,getHistory,getRefundAmount,modifyMoney}
