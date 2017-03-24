'use strict';

var querystring = require('querystring');
var cryptoJS = require('crypto-js');

// const Agent = 102;
// const CustKey = 123456789654;
// const SecretKey = '';

const Agent = 13022;
const CustKey = 123456789654;
const SecretKey = '250202b14s1';

module.exports = {

  genSecCode(query) {
    if (query.LicenseNo) query.LicenseNo = query.LicenseNo.toUpperCase();
    query.Agent = Agent;
    query.CustKey = CustKey;
    query.SecCode = cryptoJS.MD5(querystring.stringify(query, null, null, { encodeURIComponent: str => str }) + SecretKey).toString();
    return query;
  }

};