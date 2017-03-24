'use strict';

/**
 * YobeeService
 */

var rest = require('restler-q');
var utils = require('../utils/utils.js');

var helpers = require('./YobeeHelpers.js');

const baseUrl = "https://open.iyobee.com";

class YobeeService {

  getCities(options) {
    var yobeeUrl = `${baseUrl}/city`;
    options = Object.assign(options || {}, { yobeeUrl });
    return helpers.result(rest.get(yobeeUrl, helpers.optionsBuilder(options).build()));
  }

  getCity(code, options) {
    var yobeeUrl = `${baseUrl}/city/${code}`;
    options = Object.assign(options || {}, { yobeeUrl });
    return helpers.result(rest.get(yobeeUrl, helpers.optionsBuilder(options).build()));
  }

  getVehicle(query, options) {
    var yobeeUrl = `${baseUrl}/vehicle`;
    query = utils.sortObjectByKey(query);
    options = Object.assign(options || {}, { yobeeUrl, payload: query });
    return helpers.result(rest.postJson(yobeeUrl, query, helpers.optionsBuilder(options).build()), options);
  }

  getVehicleModel(query, options) {
    var yobeeUrl = `${baseUrl}/vehicle/model`;
    query = query || {};
    if (query.brand_id) yobeeUrl += `/${query.brand_id}`;
    if (query.family_id) yobeeUrl += `/${query.family_id}`;
    options = Object.assign(options || {}, { yobeeUrl });
    return helpers.result(rest.get(yobeeUrl, helpers.optionsBuilder(options).build()), options);
  }

  createVehicle(payload, options) {
    var yobeeUrl = `${baseUrl}/vehicle/input`;
    payload = utils.sortObjectByKey(payload);
    options = Object.assign(options || {}, { yobeeUrl, payload });
    return helpers.result(rest.postJson(yobeeUrl, payload, helpers.optionsBuilder(options).build()), options);
  }

  createQuote(payload, options) {
    var yobeeUrl = `${baseUrl}/quote`;
    payload = utils.sortObjectByKey(payload);
    options = Object.assign(options || {}, { yobeeUrl, payload });
    return helpers.result(rest.postJson(yobeeUrl, payload, helpers.optionsBuilder(options).build()), options);
  }

  getQuote(id, options) {
    var yobeeUrl = `${baseUrl}/quote/${id}`;
    options = Object.assign(options || {}, { yobeeUrl });
    return helpers.result(rest.get(yobeeUrl, helpers.optionsBuilder(options).build()));
  }

  applyQuote(payload, options) {
    var yobeeUrl = `${baseUrl}/apply`;
    payload = utils.sortObjectByKey(payload);
    options = Object.assign(options || {}, { yobeeUrl, payload });
    return helpers.result(rest.postJson(yobeeUrl, payload, helpers.optionsBuilder(options).build()), options);
  }

  uploadPhotos(orderno, payload, options) {
    var yobeeUrl = `${baseUrl}/photo/${orderno}`;
    payload = utils.sortObjectByKey(payload);
    options = Object.assign(options || {}, { yobeeUrl, payload });
    return helpers.result(rest.postJson(yobeeUrl, payload, helpers.optionsBuilder(options).build()), options);
  }

  guarantee(payload, options) {
    var yobeeUrl = `${baseUrl}/guarantee/payment/notify`;
    payload = utils.sortObjectByKey(payload);
    options = Object.assign(options || {}, { yobeeUrl, payload });
    return helpers.result(rest.postJson(yobeeUrl, payload, helpers.optionsBuilder(options).build()), options);
  }

  verifyId(orderno, payload, options) {
    var yobeeUrl = `${baseUrl}/id/verify/${orderno}`;
    payload = utils.sortObjectByKey(payload);
    options = Object.assign(options || {}, { yobeeUrl, payload });
    return helpers.result(rest.postJson(yobeeUrl, payload, helpers.optionsBuilder(options).build()), options);
  }

  getOrder(orderno, options) {
    var yobeeUrl = `${baseUrl}/query/${orderno}`;
    options = Object.assign(options || {}, { yobeeUrl });
    return helpers.result(rest.get(yobeeUrl, helpers.optionsBuilder(options).build()));
  }

  renewal(payload, options) {
    var yobeeUrl = `${baseUrl}/renewal`;
    payload = utils.sortObjectByKey(payload);
    options = Object.assign(options || {}, { yobeeUrl, payload });
    return helpers.result(rest.postJson(yobeeUrl, payload, helpers.optionsBuilder(options).build()), options);
  }

  getRenewal(requiestid, options) {
    var yobeeUrl = `${baseUrl}/renewal/${requiestid}`;
    options = Object.assign(options || {}, { yobeeUrl });
    return helpers.result(rest.get(yobeeUrl, helpers.optionsBuilder(options).build()));
  }

  refund(payload, options) {
    var yobeeUrl = `${baseUrl}/refund/notify`;
    payload = utils.sortObjectByKey(payload);
    options = Object.assign(options || {}, { yobeeUrl, payload });
    return helpers.result(rest.postJson(yobeeUrl, payload, helpers.optionsBuilder(options).build()), options);
  }

  applyPayment(orderno, payload, options) {
    var yobeeUrl = `${baseUrl}/apply/payment/${orderno}`;
    payload = utils.sortObjectByKey(payload);
    options = Object.assign(options || {}, { yobeeUrl, payload });
    return helpers.result(rest.postJson(yobeeUrl, payload, helpers.optionsBuilder(options).build()), options);
  }

}

module.exports = new YobeeService();