import request from '@/utils/request'

const HTTP_POST = 'post'
const HTTP_GET = 'get'

export function login(data) {
  console.log('登录跳转Post', data)
  return request({
    url: '/api/login',
    method: HTTP_POST,
    data
  })
}

export function logout() {
  return request({
    url: '/api/logout',
    method: HTTP_GET
  })
}

export function fetchToken(data) {
  return request({
    url: '/api/user',
    method: HTTP_GET,
    params: data
  })
}

export function queryHome(data) {
  return request({
    url: '/api/home',
    method: HTTP_GET,
    params: data
  })
}

export function captcha(data) {
  return request({
    url: '/api/captcha',
    method: HTTP_POST,
    data
  })
}

export function sendSmsCode(data) {
  return request({
    url: '/api/send/smscode',
    method: HTTP_POST,
    data
  })
}

export function planDetail(data) {
  return request({
    url: '/api/plan/'+data.id,
    method: HTTP_GET,
    data
  })
}

export function checkMobile(data) {
  return request({
    url: '/api/check/mobile',
    method: HTTP_POST,
    data
  })
}

export function userSignup(data) {
  return request({
    url: '/api/signup',
    method: HTTP_POST,
    data
  })
}

export function avoidLoginOpen(data) {
  return request({
    url: '/api/open/avoid/login',
    method: HTTP_POST,
    data
  })
}
export function userForgot(data) {
  console.log(data)
  return request({
    url: '/api/forgot',
    method: HTTP_POST,
    data
  })
}
