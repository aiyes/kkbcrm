'use strict';

import common = require('./index');
import enums = require('../enums/index');
import services = require('../components/services/index');

export abstract class BaseEventListener {

  userLoggedIn = false;
  user;

  static $inject = ['$scope', common.utilService.serviceName];
  
  constructor(protected $scope: angular.IScope, protected utilService: common.utilService.Service) {

    // $scope.$on(enums.events.Events.user_loggedin, this.onUserLoggedIn.bind(this));
    // $scope.$on(enums.events.Events.user_loggedout, this.onUserLoggedOut.bind(this));
    // $scope.$on(enums.events.Events.user_updated, this.onUserUpdated.bind(this));
    // $scope.$on(enums.events.Events.token_expired, this.onTokenExpired.bind(this));
    $scope.$on(enums.events.Events.result_succeed, this.onResultSucceed.bind(this));
    $scope.$on(enums.events.Events.result_failed, this.onResultFailed.bind(this));
    $scope.$on(enums.events.Events.network_error, this.onNetworkError.bind(this));

    //if (userService.isLoggedIn()) this.onUserUpdated();

  }

  // onUserLoggedIn(e, user: models.user.Model) {
  //   this.user = user;
  //   this.userLoggedIn = true;
  // }
  //
  // onUserLoggedOut() {
  //   this.user = null;
  //   this.userLoggedIn = false;
  // }
  //
  // onUserUpdated() {
  //   this.utilService.showSpinner();
  //   this.userService.getProfile().then((data) => this.onUserLoggedIn(null, data.data.data)).finally(() => this.utilService.hideSpinner());
  // }
  //
  // onTokenExpired(e, result: models.result.Model) {
  //   this.utilService.hideSpinner();
  //   this.user = null;
  //   this.userLoggedIn = false;
  //   this.utilService.handleLogin();
  // }

  onResultSucceed(e, result) {
    this.utilService.notify(result.msg);
  }

  onNetworkError(e, result) {
    //this.utilService.alert('您的网络可能出现了问题，请稍后再试。');
  }

  onResultFailed(e, result) {
    var error: any = result.data || {};
    var message = error.message || error.msg;
    // if (error.selection_code) {
    //   message += `: ${error.selection_code}`;
    // }
    this.utilService.hideSpinner();
    this.utilService.error(message);
  }

}