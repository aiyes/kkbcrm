'use strict';

/**
 * YobeeController
 *
 * @description :: Server-side logic for managing Yobees
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var co = require('co');

var utils = require('../utils/utils.js');
var fanhuaService = require('../services/FanhuaService.js');

module.exports = {

  cities(req, resp) {
    co(function* () {
      var query = Object.assign({ agreementProvCode: null }, req.query || {});
      resp.json(yield fanhuaService.getAreas(query));
    }).catch(err => resp.json(400, err));
  },

  providers(req, resp) {
    co(function* () {
      var query = { insureAreaCode: req.params.cityid };
      resp.json(yield fanhuaService.getProviders(query));
    }).catch(err => resp.json(400, err));
  },

  carinfo(req, resp) {
    co(function* () {
      resp.json(yield fanhuaService.getCarModelInfos(req.body));
    }).catch(err => {
      resp.json(400, err)
    });
  },

  fetchinfo(req, resp) {
    co(function* () {
      var payload = req.body;
      resp.json(yield fanhuaService.createTaskA(payload));
    }).catch(err => {
      resp.json(400, err)
    });
  },

  searchQuote(req, resp) {
    co(function* () {
      var payload = req.body;
      resp.json(yield fanhuaService.createTaskA(payload));
    }).catch(err => {
      resp.json(400, err)
    });
  },

  reinsure(req, resp) {
    co(function* () {
      var payload = { taskId: req.params.taskId };
      payload = Object.assign(payload, req.body || {});
      var result = yield fanhuaService.updateQuoteInfo(payload);
      result = yield fanhuaService.submitQuote({ taskId: req.params.taskId });
      resp.json(result);
      // resp.json({ taskId: '1787711' });
    }).catch(err => {
      resp.json(400, err);
    });
  },

  quote(req, resp) {
    co(function* () {
      var payload = {};
      payload = Object.assign(payload, req.body || {});
      var task = yield fanhuaService.createTaskB(payload);
      yield fanhuaService.submitQuote({ taskId: task.taskId });
      resp.json(task);
      // resp.json({ taskId: '1787711' });
    }).catch(err => {
      resp.json(400, err);
    });
  },
 
  submitQuote(req, resp) {
    co(function* () {

      var payload = req.body;
      var userId = payload.userId; delete payload.userId;
      var providers = payload.providerNames; delete payload.providerNames;
      var insureAreaCode = payload.insureAreaCode;

      var task;
      if (payload.taskId) {
        delete payload.insureAreaCode;
        task = yield fanhuaService.updateQuoteInfo(payload);
        task.taskId = payload.taskId;
      } else {
        delete payload.taskId;
        task = yield fanhuaService.createTaskB(payload);
      }
      yield fanhuaService.submitQuote({ taskId: task.taskId });

      payload.insureAreaCode = insureAreaCode;
      yield fanhuaService.initQuote({
        taskId: task.taskId,
        userId: userId,
        carLicenseNo: payload.carInfo.carLicenseNo || `新车未上牌${utils.now('YYMMDDHHmm')}`,
        providers,
        quote: payload
      });

      resp.json(task);

    }).catch(err => {
      resp.json(400, err);
    });
  },
   
  result(req, resp) {
    co(function* () {
      var res = yield fanhuaService.saveResult(req.body);
      return resp.ok("ok");
    }).catch(err => {
      resp.json(400, err);
    });
  },

  getQuote(req, resp) {
    co(function* () {
      var result = yield fanhuaService.getQuote(req.params.taskId);
      if (result) return resp.json(result);
      return resp.notFound();
    }).catch(err => resp.json(400, err));
  },

  deleteQuote(req, resp) {
    co(function* () {
      var result = yield fanhuaService.deleteQuote(req.params.taskId);
      return resp.ok("ok");
    }).catch(err => resp.json(400, err));
  },

  getQuotes(req, resp) {
    co(function* () {
      var userId = req.query.userId;
      resp.json(yield fanhuaService.getQuotes(userId));
    }).catch(err => resp.json(400, err));
  },

  uploadImages(req, resp) {
    co(function* () {
      var taskId = req.params.taskId;
      var prvId = req.params.prvId;
      var images = req.body;
      var imageInfos = [];
      for (let imageType of Object.keys(images)) {
        var image = images[imageType];
        imageInfos.push({
          imageType,
          imageMode: _.last(image.filetype.split('/')),
          imageContent: image.base64
        });
      }
      var res = yield fanhuaService.uploadImage({
        taskId,
        imageInfos
      });
      yield fanhuaService.updateResult({
        taskId,
        prvId,
        msg: '影像已上存，请等待验证',
        taskState: '17' // 核保中（不回调）
      });
      res.imageInfos = imageInfos;
      resp.json(res);
    }).catch(err => {
      resp.json(400, err)
    });
  },
  
  pay(req, resp) {
    co(function* () {
      var payload = req.body;
      var retUrl = payload.retUrl; delete payload.retUrl;
      if (payload.delivery) {
        payload.delivery.deliveryType = payload.delivery.deliveryType || '1';
        payload.delivery.area = payload.delivery.area || payload.delivery.city;
      }
      yield fanhuaService.updateQuoteInfo(payload);
      resp.json(yield fanhuaService.pay({ 
        taskId: payload.taskId, 
        prvId: payload.prvId, 
        retUrl 
      }));
    }).catch(err => {
      resp.json(400, err)
    });
  },

  insure(req, resp) {
    co(function* () {
      var insure = req.body;
      resp.json(yield fanhuaService.submitInsure(insure));
    }).catch(err => {
      resp.json(400, err)
    });
  },

  refund(req, resp) {
    co(function* () {
      var insure = req.body;
      var res = yield fanhuaService.reimbursement(insure);
      yield fanhuaService.updateResult({
        taskId: insure.taskId,
        prvId: insure.prvId,
        msg: res.msg,
        taskState: '98',
        taskStateDescription: '全额退款'
      });
      resp.json(res);
    }).catch(err => {
      resp.json(400, err)
    });
  },

}