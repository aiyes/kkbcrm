'use strict';

import storeService = require('./store-service');
import {Config} from "../config/config";
import baseDialogController = require('./base-dialog-controller');

export var serviceName = 'utility.utilService';

class UtilService {

  static $inject = ['$q', '$rootScope', '$state', 'dialogs', 'prompt', 'blockUI', '$translate', storeService.serviceName];

  constructor(
    private $q: angular.IQService,
    private $rootScope: angular.IRootScopeService,
    private $state: angular.ui.IStateService,
    private dialogs,
    private promptService,
    private blockUI,
    private $translate: angular.translate.ITranslateService,
    private storeService: storeService.Service) { }

  showSpinner(message?, ops: any = {}) {
    if (message) ops.message = message;
    this.blockUI.start(ops);
  }

  hideSpinner(reset: boolean = false) {
    if (reset) return this.blockUI.reset();
    this.blockUI.stop();
  }

  handleLogin() {
    //if (Config.inWechat()) {
    //  var url = Config.ssoUrl + '?redirect_uri=' + encodeURIComponent([Config.baseUrl, '#/token'].join('/'));
    //  this.$window.location.replace(url);
    //  return;
    //}
    this.$state.go('login');
  }

  /**
   * 各种弹窗
   */

  wait(msg, header = '进度', progress, opts: angular.dialogservice.IDialogOptions = {}): ng.ui.bootstrap.IModalServiceInstance {
    return this.dialogs.wait(header, msg, progress, opts);
  }

  error(msg, header = '错误', opt: angular.dialogservice.IDialogOptions = {}): ng.ui.bootstrap.IModalServiceInstance {
    opt.size = opt.size || 'md';
    return this.dialogs.error(header, msg, opt);
  }

  notify(msg, header = '通知', opt: angular.dialogservice.IDialogOptions = {}): ng.ui.bootstrap.IModalServiceInstance {
    opt.size = opt.size || 'md';
    return this.dialogs.notify(header, msg, opt);
  }

  confirm(msg, header = '确认', opt: angular.dialogservice.IDialogOptions = {}): ng.ui.bootstrap.IModalServiceInstance {
    opt.size = opt.size || 'lg';
    return this.dialogs.confirm(header, msg, opt);
  }

  dialog(url, ctrl?, data?, opt?): ng.ui.bootstrap.IModalServiceInstance {
    ctrl = ctrl || baseDialogController.controllerName;
    opt = opt || {};
    opt.size = opt.size || 'md';
    return this.dialogs.create(url, ctrl, data, opt, 'ctrl');
  }

  prompt(options: any = {}) {
    return this.promptService({
      title: options.title,
      message: options.message,
      input: true,
      label: options.label,
      value: options.value,
      values: options.values
    });
  }

  translate(transId) {
    return this.$translate.instant(transId);
  }

  /**
   * 处理 登录 和 页面回转
   */

  // rememberState(state, params) {
  //   if (Config.isPhantomState(state)) return;
  //   this.$rootScope['targetView'] = {
  //     toState: state.name,
  //     toParams: params
  //   }
  // }

  returnBack(defaultState, params = {}) {
    var targetView = this.$rootScope['targetView'];
    if (!targetView) targetView = { toState: defaultState };
    params = angular.merge(targetView.toParams || {}, params);
    if (targetView) return this.$state.go(targetView.toState, params);
  }

  /**
   * 把 token 存储逻辑放到这里是为了让其他的 service 解绑对存储位置的依赖
   */

  getToken() {
    return this.storeService.getToken();
  }

  setToken(token) {
    this.storeService.setToken(token);
  }

  deleteToken() {
    this.storeService.deleteToken();
  }

}

export class Service extends UtilService {}
