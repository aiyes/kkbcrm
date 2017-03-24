'use strict';

// import common = require('../../../utility/index');
// import services = require('../../../components/services/index');
// import {Utils} from "../../../utility/index";

import quoteController = require('./quote-controller');
import bihuController = require('./bihu-controller');
import fanhuaController = require('./fanhua-controller');

export var load = (app: angular.IModule) => {
  app.controller(quoteController.controllerName, quoteController.Controller)
    .controller(bihuController.controllerName, bihuController.Controller)
    .controller(fanhuaController.controllerName, fanhuaController.Controller);
};

export var states = ($stateProvider: angular.ui.IStateProvider) => {

  $stateProvider
    .state('quote', {
      abstract: true,
      url: '/quote',
      template: '<div ui-view></div>'
    })
    .state('quote.yibao', {
      url: '/yibao',
      templateUrl: 'features/quote/quote.html',
      controller: quoteController.controllerName,
      controllerAs: 'ctrl'
    })
    .state('quote.bihu', {
      url: '/bihu',
      templateUrl: 'features/quote/bihu.html',
      controller: bihuController.controllerName,
      controllerAs: 'ctrl'
    })
    .state('quote.fanhua', {
      url: '/fanhua',
      templateUrl: 'features/quote/fanhua.html',
      controller: fanhuaController.controllerName,
      controllerAs: 'ctrl'
    })
    .state('quote.fanhua.order', {
      url: '/order',
      views: {
        "@": {
          templateUrl: 'features/quote/fanhua-order.html'
        }
      }
    });

};
