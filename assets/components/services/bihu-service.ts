'use strict';

import baseService = require('./base-service');
import common = require('../../utility/index');
// import models = require('../models/index');

export var serviceName = 'bihuService';

class BihuService extends baseService.Service {

  static $inject = ['$q', '$http', common.utilService.serviceName];

  constructor(protected $q: angular.IQService, protected $http: angular.IHttpService, protected utilService) {
    super($q, $http, utilService);
  }

  getCities() {
    return this._get(`api/bihu/cities`);
  }

  reinsure(query) {
    return this._post(`api/bihu/reinsure`, query);
  }

  createQuote(quote) {
    return this._post(`api/bihu/quote`, quote);
  }

  getQuote(LicenseNo) {
    return this._get(`api/bihu/quotes/${LicenseNo}`);
  }

}

export class Service extends BihuService {}