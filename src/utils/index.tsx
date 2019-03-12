export { get } from './api'

/**
 * 去除空格
 * @param str 传入字符串
 */
export const trim = (str: any): string => {
  return str && !(str instanceof Object)
    ? String(str).replace(/(^\s+)|(\s+$)/g, '')
    : str
}

/**
 * 是否为空
 * @param value 传入数据
 */
export const isEmpty = (value: any): boolean => {
  return (
    !value ||
    value === undefined ||
    trim(value) === '' ||
    trim(value) === 'null' ||
    value === '' ||
    value.length === 0
  )
}

/**
 * 获取余额信息
 * @param balance 余额字符串
 */
export const getBalance = (balance: string): number => {
  if (isEmpty(balance)) return 0
  let _balance = balance.substring(0, balance.lastIndexOf('元'))
  return Number(_balance)
}

/**
 * 是否余额不足
 * @param balance 余额字符串
 */
export const lowBalance = (balance: string): boolean => {
  return getBalance(balance) < 1
}
