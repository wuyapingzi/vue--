import AsyncValidator from 'async-validator'

/**
 * 校验小写字母
 * @param {string} string
 * @returns {boolean} Returns `Boolean`
 */
export function validateMobile(str) {
  const reg = /^1[3|4|5|6|7|8|9][0-9]{9}$/
  return reg.test(str)
}

/**
 * 校验小写字母
 * @param {string} string
 * @returns {boolean} Returns `Boolean`
 */
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/**
 * 校验大写字母
 * @param {string} string
 * @returns {boolean} Returns `Boolean`
 */
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/**
 * 校验真实姓名
 * @param {string} string
 */
export function reNickName(str) {
  const reg= /^[\u0391-\uFFE5]{2,6}$/
  return reg.test(str)
}

/**
 * 校验身份证号
 * @param {string} string
 * @returns {boolean} Returns `Boolean`
 */
export function checkIdentityCard(str) {
  const reg = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)?$/i
  return reg.test(str)
}

/**
 * 校验银行卡号
 * @param {string} string
 * @returns {boolean} Returns `Boolean`
 */
export function reBankCardNo(str) {
  const reg = /^\d{16,30}$/
  return reg.test(str)
}

/**
 * 校验大小写字母
 * @param {string} string
 * @returns {boolean} Returns `Boolean`
 */
export function validateAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * validate email
 * @param email
 * @returns {boolean}
 */
export function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}

/**
 * 校验登录密码
 * @param {string} string
 * @return {boolean}
 */
export function validatePassword(str) {
  const reg = /^[A-Za-z0-9]{8}$/
  return reg.test(str)
}

export default AsyncValidator
