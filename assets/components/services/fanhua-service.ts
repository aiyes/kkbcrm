'use strict';

import baseService = require('./base-service');
import common = require('../../utility/index');
// import models = require('../models/index');

export var serviceName = 'fanhuaService';

class FanhuaService extends baseService.Service {

  static $inject = ['$q', '$http', common.utilService.serviceName];

  constructor(protected $q: angular.IQService, protected $http: angular.IHttpService, protected utilService) {
    super($q, $http, utilService);
  }

  getCities() {
    return this._get(`api/fanhua/cities`);
  }

  getProviders(city) {
    return this._get(`api/fanhua/cities/${city}/providers`);
  }

  getCarInfo(query) {
    return this._post(`api/fanhua/carinfo`, query);
  }

  fetchInfo(query) {
    return this._post(`api/fanhua/fetchinfo`, query);
  }

  reinsure(taskId, quote) {
    return this._post(`api/fanhua/reinsure/${taskId}`, quote);
  }

  createQuote(quote) {
    return this._post(`api/fanhua/quote`, quote);
  }

  getQuote(id) {
    return this._get(`api/fanhua/quotes/${id}`);
  }

  uploadImages(id, images) {
    return this._post(`api/fanhua/quotes/${id}/images`, images);
  }

  pay(id, payment) {
    return this._post(`api/fanhua/quotes/${id}/pay`, payment);
  }

  submitInsure(id, insure) {
    return this._post(`api/fanhua/insures/${id}`, insure);
  }

  reimbursement(id, insure) {
    return this._post(`api/fanhua/insures/${id}/reimbursement`, insure);
  }

}

export class Service extends FanhuaService {}