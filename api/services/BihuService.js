'use strict';

var helpers = require('./BihuHelpers.js');

/**
 * BihuService
 */

var rest = require('restler-q');

const baseUrl = "http://iu.91bihu.com/api";

class BihuService {

  getReInfo(query) {
    query = Object.assign(query || {}, { IsPublic: 0, Group: 1 });
    helpers.genSecCode(query);
    return rest.get(`${baseUrl}/CarInsurance/getreinfo`, { query });
  }

  getCreditInfo(LicenseNo) {
    var query = { LicenseNo };
    helpers.genSecCode(query);
    return rest.get(`${baseUrl}/claim/GetCreditInfo`, { query });
  }

  createQuote(payload, options) {
    payload.SubmitGroup = payload.QuoteGroup;
    payload.IsNewCar = payload.IsLastYearNewCar;
    helpers.genSecCode(payload);
    // sails.log.debug(querystring.stringify(payload));
    return rest.get(`${baseUrl}/CarInsurance/PostPrecisePrice`, { query: payload });
  }

  getQuote(LicenseNo, QuoteGroup) {
    var query = { LicenseNo, QuoteGroup };
    helpers.genSecCode(query);
    // sails.log.debug(querystring.stringify(query));
    return rest.get(`${baseUrl}/CarInsurance/GetPrecisePrice`, { query });
  }

}

module.exports = new BihuService();