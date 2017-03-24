'use strict';

var Q = require('q');
var moment = require('moment');
var cryptoJS = require('crypto-js');

var utils = require('../utils/utils.js');

const appId = 'Fyu361GZu9k2yF27K7UNqpu78kThqKwC';
const appVersion = 1;
const appKey = 'irA42R5J88fB70IPtfly5J173VEUd2v7oPQQe489ldu7ErQDPp';

class OptionsBuilder {

  constructor(options) {
    this.options = options || {};
    this._initialOptions();
  }

  _initialOptions() {
    this._generateHeaders();
  }

  _generateHeaders() {

    var yoobeHeaders = {
      'Accept': 'application/json;charset=utf8',
      'Content-Type': 'application/json',
      'X-Yobee-AccessKeyID': appId,
      'X-Yobee-Version': appVersion
    };

    var timestamp = moment().unix();
    yoobeHeaders['X-Yobee-Timestamp'] = timestamp;

    var url = this.options.yobeeUrl;
    if (this.options.payload) {
      var keys = _.keys(this.options.payload).join('');
      var body = cryptoJS.MD5(JSON.stringify(this.options.payload)).toString();
    }
    var stringToSign = `${url}${keys || ''}${appId}${timestamp}${body || ''}${appVersion}${appKey}`;
    yoobeHeaders['X-Yobee-Signature'] = cryptoJS.HmacSHA256(stringToSign, appKey).toString(cryptoJS.enc.Hex);
    this.options.headers = Object.assign(this.options.headers || {}, yoobeHeaders);

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

  optionsBuilder(options) {
    return new OptionsBuilder(options);
  },

  result(yobeeResponse) {
    return Q.Promise((resolve, reject) => {
      yobeeResponse.then(data => {
        if (!data.success) {
          // console.error(data);
          var err = new Error();
          err.data = data;
          return reject(err);
        }
        resolve(data);
      });
    });
  }

};