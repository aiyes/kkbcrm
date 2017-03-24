'use strict';

import common = require('../../utility/index');
import config = require('./../../config/config');

abstract class BaseService {

  private config = config.Config;

  static $inject = ['$q', '$http', common.utilService.serviceName];
  
  constructor(protected $q: angular.IQService, protected $http: angular.IHttpService, protected utilService) {}

  _getOptions(opts?) {
    var headers = this._getHeaders();
    if (this.utilService.getToken()) headers['Authorization'] = `Bearer ${this.utilService.getToken()}`;
    return angular.extend({ headers: headers }, opts || {});
  }

  _getHeaders(headers = {}) {
    var defaults = {
      'x-from': 'html5'
    };
    return angular.extend(defaults, headers);
  }
  
  _get(url, opts?): angular.IHttpPromise<any> {
    return this.$http.get(this._processUrl(url), this._getOptions(opts));
  }

  _post(url, data, opts?): angular.IHttpPromise<any> {
    return this.$http.post(this._processUrl(url), data, this._getOptions(opts));
  }

  _put(url, data, opts?): angular.IHttpPromise<any> {
    return this.$http.put(this._processUrl(url), data, this._getOptions(opts));
  }

  _delete(url, opts?): angular.IHttpPromise<any> {
    return this.$http.delete(this._processUrl(url), this._getOptions(opts));
  }

  private _processUrl(url) {
    return `${this.config.baseUrl}/${url}`;
  }
  
}

export class Service extends BaseService {}