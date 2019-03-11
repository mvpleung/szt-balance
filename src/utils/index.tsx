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
