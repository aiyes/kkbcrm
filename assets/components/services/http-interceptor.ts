'use strict';

import common = require('../../utility/index');
// import models = require('../models/index');
import enums = require('../../enums/index');

export var serviceName = 'httpInterceptor';

class HttpInterceptor {

  static $inject = ['$q', '$rootScope'];

  constructor(private $q: angular.IQService, private $rootScope: angular.IRootScopeService) {}

  request = (config) => {
    return config;
  };

  requestError = (rejection) => {
    return this.$q.reject(rejection);
  };

  response = (response) => {
    return response;
  };

  responseError = (rejection) => {
    if (rejection.status == 0) {
      this.$rootScope.$broadcast(enums.events.Events.network_error, rejection.data);
      return this.$q.reject(rejection);
    }
    if (rejection.data && rejection.data.code == 401) {
      this.$rootScope.$broadcast(enums.events.Events.token_expired, rejection.data);
      return this.$q.reject(rejection);
    }
    var errorHandler: any = _.get(rejection, 'config.errorHandler');
    if (errorHandler && angular.isFunction(errorHandler)) {
      var handled = errorHandler(rejection.data, rejection);
      if (handled === true) return this.$q.reject(rejection);
    }
    if (rejection.config && rejection.config.errorHandled) return this.$q.reject(rejection);
    this.$rootScope.$broadcast(enums.events.Events.result_failed, rejection.data || {});
    return this.$q.reject(rejection);
  }

}

export class Service extends HttpInterceptor {}