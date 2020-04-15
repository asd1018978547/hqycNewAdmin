import { request } from '@/utils/request'

const search =function(para){
    return request({
        api: 'i/want/401035',
        para
    })
}


const getRuleData = function (para) {
    return request({
        api: 'i/want/300310',
        para
    })
}
const delRule = function (para) {
    return request({
        api: 'i/want/300313',
        para
    })
}

const queryRule= function (para) {
    return request({
        api: 'i/want/300314',
        para
    })
}
export { getRuleData,search ,delRule ,queryRule}