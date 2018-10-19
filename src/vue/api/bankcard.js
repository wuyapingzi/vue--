import request from '@/utils/request'

const HTTP_POST = 'post'
// const HTTP_GET = 'get'

export function queryBankChecked(data) {
  return request({
    url: '/api/bankcard/checked',
    method: HTTP_POST,
    data
  })
}