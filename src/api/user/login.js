import { request } from '@/utils/request'

export default function login(UserId, Pwd) {
  const para = {
    UserId,
    Pwd,
    roleId: 31,
    misc: window.navigator.userAgent
  }
  return request({
    api: 'i/want/300001',
    para
  })
}
