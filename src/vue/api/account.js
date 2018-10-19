import request from '@/utils/request'

const HTTP_POST = 'post'
const HTTP_GET = 'get'

export function queryAccountAssets(){
  return request({
    url: '/api/account/info',
    method: HTTP_GET,
  })
}

export function queryAccountBankcard(){
  return request({
    url: '/api/account/bankcard',
    method: HTTP_GET,
  })
}

export function queryAccountWithdrawList(){
  return request({
    url: '/api/account/withdraw/list',
    method: HTTP_POST,
  })
}

export function accountBankcardBind(data){
  return request({
    url: '/api/account/bank/add',
    method: HTTP_POST,
    data,
  })
}

export function accountBankcardUnbind(){
  return request({
    url: '/api/account/bank/unbind',
    method: HTTP_POST,
  })
}

export function accountRecharge(data){
  return request({
    url: '/api/account/quickpay',
    method: HTTP_POST,
    data,
  })
}

export function accountWithdraw(data){
  return request({
    url: '/api/account/withdraw',
    method: HTTP_POST,
    data,
  })
}