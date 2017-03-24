'use strict';

export import httpInterceptor = require('./http-interceptor');
export import quoteService = require('./quote-service');
export import bihuService = require('./bihu-service');
export import fanhuaService = require('./fanhua-service');
export import tripService = require('./trip-service');

export var load = (app: angular.IModule) => {
  app.service(httpInterceptor.serviceName, httpInterceptor.Service)
    .service(quoteService.serviceName, quoteService.Service)
    .service(bihuService.serviceName, bihuService.Service)
    .service(fanhuaService.serviceName, fanhuaService.Service)
    .service(tripService.serviceName, tripService.Service)
    .config([ '$httpProvider', ($httpProvider: angular.IHttpProvider) => {
      $httpProvider.interceptors.push(httpInterceptor.serviceName);
    }])
};