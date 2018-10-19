import request from '@/utils/request'

const HTTP_POST = 'post'
// const HTTP_GET = 'get'

export function queryThirdpartResult(){
  return request({
    url: '/api/thirdpart/result',
    method: HTTP_POST,
  })
}