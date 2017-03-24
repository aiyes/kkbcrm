/// <reference path="../typings/app.d.ts" />

'use strict';

var app = angular.module('lcbapp', [
  'ui.bootstrap', 'ui.router',
  'ngAnimate', 'ngTouch', 'ngSanitize', 'ngCookies', 'ngStorage',
  'blockUI', 'dialogs.main', 'pascalprecht.translate', 'cgPrompt',
  'checklist-model', 'naif.base64',
  'ngPrettyJson', 'angular-json-editor', 'datetime'
]);

import common = require('./utility/index'); common.load(app);
import directives = require('./components/directives/index'); directives.load(app);
// import components = require('./components/components/index'); components.load(app);
import filters = require('./components/filters/index'); filters.load(app);
import services = require('./components/services/index'); services.load(app);
import i18n = require('./i18n/index'); i18n.load(app);
import enums = require('./enums/index');

/* features */
import welcome = require('./features/welcome/index'); welcome.load(app);
import quote = require('./features/quote/index'); quote.load(app);
import trip = require('./features/trip/index'); trip.load(app);

app.config(['$locationProvider', '$stateProvider', '$urlRouterProvider', ($locationProvider: angular.ILocationProvider, $stateProvider: angular.ui.IStateProvider, $urlRouterProvider: angular.ui.IUrlRouterProvider) => {

  // $locationProvider.html5Mode({
  //   enabled: true,
  //   requireBase: false,
  //   rewriteLinks: false
  // });

  welcome.states($stateProvider);
  quote.states($stateProvider);
  trip.states($stateProvider);

  $urlRouterProvider.otherwise('/quote/bihu');


}]);
