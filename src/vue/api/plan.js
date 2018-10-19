import request from '@/utils/request'

const HTTP_GET = 'get'
const HTTP_POST = 'post'

export function planJoin(data = {}) {
  let id = 830
  return request({
    url: `/api/plan/buy/${id}`,
    method: HTTP_GET,
    data
  })
}

export function chooseBestCoupon(data) {
  data.id = 830
  return request({
    url: '/api/coupon/best',
    method: HTTP_POST,
    data
  })
}

export function couponList(data) {
  return request({
    url: '/api/buy/coupon/list',
    method: HTTP_POST,
    data
  })
}

export function handChooseCoupon(data = {}) {
  return request({
    url: '/api/choose/coupon',
    method: HTTP_POST,
    data
  })
}

export function planDetail(data){
  return request({
    url: '/api/plan/740',
    method: HTTP_GET,
    data
  })
}

export function joinList(data){
  return request({
    url: '/api/plan/754/record',
    method: HTTP_GET,
    data
  })
}

export function investList(data){
  return request({
    url: '/api/plan/invest',
    method: HTTP_GET,
    data
  })
}
