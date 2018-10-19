import request from '@/utils/request'

// const HTTP_POST = 'post'
const HTTP_GET = 'get'

export function queryHome(data) {
  return request({
    url: '/api/home',
    method: HTTP_GET,
    params: data
  })
}