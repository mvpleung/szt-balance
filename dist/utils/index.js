'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _api = require('./api.js');

Object.defineProperty(exports, 'get', {
  enumerable: true,
  get: function get() {
    return _api.get;
  }
});

/**
 * 去除空格
 * @param str 传入字符串
 */
var trim = exports.trim = function trim(str) {
  return str && !(str instanceof Object) ? String(str).replace(/(^\s+)|(\s+$)/g, '') : str;
};
/**
 * 是否为空
 * @param value 传入数据
 */
var isEmpty = exports.isEmpty = function isEmpty(value) {
  return !value || value === undefined || trim(value) === '' || trim(value) === 'null' || value === '' || value.length === 0;
};
/**
 * 获取余额信息
 * @param balance 余额字符串
 */
var getBalance = exports.getBalance = function getBalance(balance) {
  if (isEmpty(balance)) return 0;
  var _balance = balance.substring(0, balance.lastIndexOf('元'));
  return Number(_balance);
};
/**
 * 是否余额不足
 * @param balance 余额字符串
 */
var lowBalance = exports.lowBalance = function lowBalance(balance) {
  return getBalance(balance) < 1;
};