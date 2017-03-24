'use strict';

/**
 * YobeeService
 */

var rest = require('restler-q');
var utils = require('../utils/utils.js');

var helpers = require('./FanhuaHelpers.js');

// const baseUrl = "http://cmchannel.uat.52zzb.com/chn/channel"; // 测试环境
const baseUrl = "http://cm.channel.52zzb.com/chn/channel";  // 生产环境
 

class FanhuaService {

  getAreas(query, options) {
    var fanhuaUrl = `${baseUrl}/getAreas`;
    options = Object.assign(options || {}, { fanhuaUrl, payload: query });
    return helpers.result(rest.postJson(fanhuaUrl, query, helpers.optionsBuilder(options).build()));
  }

  getProviders(query, options) {
    var fanhuaUrl = `${baseUrl}/getProviders`;
    options = Object.assign(options || {}, { fanhuaUrl, payload: query });
    return helpers.result(rest.postJson(fanhuaUrl, query, helpers.optionsBuilder(options).build()));
  }

  getCarModelInfos(query, options) {
    var fanhuaUrl = `${baseUrl}/getCarModelInfos`;
    query = Object.assign({ carInfo: query }, { pageSize: 10, pageNum: 1 });
    options = Object.assign(options || {}, { fanhuaUrl, payload: query });
    // console.dir(query);
    // console.dir(helpers.optionsBuilder(options).build(), { depth: null });
    return helpers.result(rest.postJson(fanhuaUrl, query, helpers.optionsBuilder(options).build()));
  }

  createTaskA(payload, options) {
    var fanhuaUrl = `${baseUrl}/createTaskA`;
    payload = Object.assign(payload || {}, { channelUserId: helpers.channelId });
    options = Object.assign(options || {}, { fanhuaUrl, payload });
    return helpers.result(rest.postJson(fanhuaUrl, payload, helpers.optionsBuilder(options).build()), options);
  }

  createTaskB(payload, options) {
    var fanhuaUrl = `${baseUrl}/createTaskB`;
    payload = Object.assign(payload || {}, { channelUserId: helpers.channelId });
    if (payload.carOwner) payload.carOwner.idcardType = payload.carOwner.idcardType || '0';
    // payload.remark = '测试';
    options = Object.assign(options || {}, { fanhuaUrl, payload });
    console.dir(payload);
    console.dir(helpers.optionsBuilder(options).build(), { depth: null });
    return helpers.result(rest.postJson(fanhuaUrl, payload, helpers.optionsBuilder(options).build()), options);
  }

  updateQuoteInfo(payload, options) {
    var fanhuaUrl = `${baseUrl}/updateQuoteInfo`;
    // payload = Object.assign(payload || {}, { channelUserId: helpers.channelId });
    if (payload.carOwner) payload.carOwner.idcardType = payload.carOwner.idcardType || '0';
    // payload.remark = '测试';
    options = Object.assign(options || {}, { fanhuaUrl, payload });
    console.dir(payload);
    console.dir(helpers.optionsBuilder(options).build(), { depth: null });
    return helpers.result(rest.postJson(fanhuaUrl, payload, helpers.optionsBuilder(options).build()), options);
  }

  submitQuote(payload, options) {
    var fanhuaUrl = `${baseUrl}/submitQuote`;
    options = Object.assign(options || {}, { fanhuaUrl, payload });
    return helpers.result(rest.postJson(fanhuaUrl, payload, helpers.optionsBuilder(options).build()), options);
  }

  submitInsure(payload, options) {
    var fanhuaUrl = `${baseUrl}/submitInsure`;
    options = Object.assign(options || {}, { fanhuaUrl, payload });
    return helpers.result(rest.postJson(fanhuaUrl, payload, helpers.optionsBuilder(options).build()), options);
  }

  reimbursement(payload, options) {
    var fanhuaUrl = `${baseUrl}/reimbursement`;
    options = Object.assign(options || {}, { fanhuaUrl, payload });
    return helpers.result(rest.postJson(fanhuaUrl, payload, helpers.optionsBuilder(options).build()), options);
  }

  initQuote(quote) {
    return FanhuaResult.destroy({
      carLicenseNo: quote.carLicenseNo
    }).then(resp => {
      return FanhuaResult.create(quote);
    });
  }

  saveResult(newResult) {
    return FanhuaResult.findOne({
      taskId: newResult.taskId
    }).then(result => {
      if (!result.data) result.data = {};
      result.data[newResult.prvId] = newResult;
      return result.save();
    })
  }

  updateResult(newResult) {
    return FanhuaResult.findOne({
      taskId: newResult.taskId
    }).then(result => {
      if (!result.data) result.data = {};
      var oldResult = result.data[newResult.prvId];
      newResult = _.merge(oldResult || {}, newResult);
      result.data[newResult.prvId] = newResult;
      return result.save();
    })
  }

  getQuote(taskId) {
    return FanhuaResult.findOne({
      taskId
    });
  }

  deleteQuote(taskId) {
    return FanhuaResult.destroy({
      taskId
    });
  }

  getQuotes(userId) {
    return FanhuaResult.find({
      userId
    });
  }

  uploadImage(payload, options) {
    var fanhuaUrl = `${baseUrl}/uploadImage`;
    options = Object.assign(options || {}, { fanhuaUrl, payload });
    return helpers.result(rest.postJson(fanhuaUrl, payload, helpers.optionsBuilder(options).build()), options);
  }

  pay(payload, options) {
    var fanhuaUrl = `${baseUrl}/pay`;
    options = Object.assign(options || {}, { fanhuaUrl, payload });
    return helpers.result(rest.postJson(fanhuaUrl, payload, helpers.optionsBuilder(options).build()), options);
  }

}

module.exports = new FanhuaService();