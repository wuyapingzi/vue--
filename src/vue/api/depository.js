import request from "@/utils/request"

const HTTP_POST = "post"
const HTTP_GET = "get"

export function depositoryActive(data) {
  return request({
    url: "/api/depository/active",
    method: HTTP_POST,
    data
  })
}

export function bankLimitList(data) {
  return request({
    url: "/api/bank/limit",
    method: HTTP_GET,
    data
  })
}

export function depositoryAccount(data) {
  console.log(data)
  return request({
    url: '/api/depository/account',
    method: HTTP_POST,
    data
  })
}
