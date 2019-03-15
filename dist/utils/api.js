'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _index = require('../npm/@tarojs/taro-weapp/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Get 请求
 * @param url 请求地址
 * @param params 请求参数
 * @param config 其他配置
 */
var get = exports.get = function get(url, params) {
  var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  _index2.default.showLoading({
    title: '请求中...',
    mask: true
  });
  config.url = url;
  config.data = params;
  return new Promise(function (resolve, reject) {
    _index2.default.request(_extends({}, config, {
      success: function success(res) {
        var data = res.data;

        if (!!data.code || data.code !== 0) {
          _index2.default.showToast({
            title: data.message || '请求失败',
            duration: 3000,
            icon: 'none'
          });
          reject(data.message);
          return;
        }
        resolve(data);
      },
      fail: function fail(err) {
        _index2.default.showToast({
          title: err.message || '请求失败',
          duration: 3000,
          icon: 'none'
        });
        reject(err);
      },
      complete: function complete() {
        _index2.default.hideLoading();
      }
    }));
  });
};