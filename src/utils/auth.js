
const TokenKey = 'Token'

export function getToken() {
  return window.localStorage.getItem(TokenKey)
}

export function setToken(token) {
  return window.localStorage.setItem(TokenKey)
}

export function removeToken() {
  return window.localStorage.removeItem(TokenKey)
}

export const regIdCard = function(val) {
  const regs = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/
  if (!regs.test(val)) return false
  const idCardWi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2] // 将前17位加权因子保存在数组里
  const idCardY = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2] // 这是除以11后，可能产生的11位余数、验证码，也保存成数组
  let idCardWiSum = 0 // 用来保存前17位各自乖以加权因子后的总和
  for (let i = 0; i < 17; i++) {
    idCardWiSum += val.substring(i, i + 1) * idCardWi[i]
  }
  const idCardMod = idCardWiSum % 11 // 计算出校验码所在数组的位置
  const idCardLast = val.substring(17) // 得到最后一位身份证号码
  // 如果等于2，则说明校验码是10，身份证号码最后一位应该是X
  if (idCardMod === 2) {
    if (idCardLast === 'X' || idCardLast === 'x') {
      return true
    } else {
      return false
    }
  } else {
    // 用计算出的验证码与最后一位身份证号码匹配，如果一致，说明通过，否则是无效的身份证号码
    if (parseInt(idCardLast) === idCardY[idCardMod]) {
      return true
    } else {
      return false
    }
  }
}
