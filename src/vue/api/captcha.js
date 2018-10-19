import request from '@/utils/request'

// const HTTP_POST = 'post'
const HTTP_GET = 'get'

export function captcha(data) {
  return request({
    url: '/api/captcha',
    method: HTTP_GET,
    data
  })
}
