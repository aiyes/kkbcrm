'use strict';

import baseService = require('./base-service');
import common = require('../../utility/index');
// import models = require('../models/index');

export var serviceName = 'quoteService';

class QuoteService extends baseService.Service {

  static $inject = ['$q', '$http', common.utilService.serviceName];

  constructor(protected $q: angular.IQService, protected $http: angular.IHttpService, protected utilService) {
    super($q, $http, utilService);
  }

  createQuote(quote, opts?) {
    return this._post(`api/yobee/quote`, quote, opts);
  }

  getQuote(id) {
    return this._get(`api/yobee/quotes/${id}`);
  }

  getCities() {
    return this._get(`api/yobee/cities`);
  }

}

export class Service extends QuoteService {}