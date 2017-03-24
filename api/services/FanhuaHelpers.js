'use strict';

var Q = require('q');
var moment = require('moment');
var cryptoJS = require('crypto-js');

var utils = require('../utils/utils.js');

// 测试环境
// const channelId = 'nqd_kaikaibao2017';
// const channelSecret = '8KmYXVSFOrjHBUwelD5ha3mkkOPp5fsS';

// 生产环境
const channelId = 'nqd_kaikaibao2017';
const channelSecret = 'AcclIyGPhyQCyA3qV7KSnvBBYp97fei6';

class OptionsBuilder {

  constructor(options) {
    this.options = options || {};
    this._initialOptions();
  }

  _initialOptions() {
    this._generateHeaders();
  }

  _generateHeaders() {

    var fanhuaHeaders = {
      'Accept': 'application/json;charset=utf8',
      'Content-Type': 'application/json',
      'channelId': channelId
    };

    var toSign = channelSecret;
    if (this.options.payload) {
      toSign = `${JSON.stringify(this.options.payload)}${toSign}`;
    }
    fanhuaHeaders['sign'] = cryptoJS.MD5(toSign).toString();;
    
    this.options.headers = Object.assign(this.options.headers || {}, fanhuaHeaders);

  }

  headers(headers) {
    this.options.headers = Object.assign(this.options.headers || {}, headers);
    return this;
  }

  build() {
    return this.options;
  }

}

module.exports = {

  channelId,

  optionsBuilder(options) {
    return new OptionsBuilder(options);
  },

  result(fanhuaResponse) {
    return Q.Promise((resolve, reject) => {
      fanhuaResponse.then(data => {
        if (data.code < 0) {
          // console.error(data);
          // var err = new Error();
          // err.data = data;
          return reject(data);
        }
        resolve(data);
      });
    });
  }

};