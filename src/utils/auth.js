import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

// cookie 中获取 token
export function getToken() {
  return Cookies.get(TokenKey)
}

// 将 token 保存至 cookie 中
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

// 移除 cookie 中 token 数据
export function removeToken() {
  return Cookies.remove(TokenKey)
}
