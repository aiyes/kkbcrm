'use strict';

export import utilService = require('./util-service');
export import storeService = require('./store-service');

import baseController = require('./base-controller');
import baseDialogController = require('./base-dialog-controller');
import {Config} from "../config/config";

export abstract class Utils {

  static parseBool(val, defVal = false) {
    if (angular.isUndefined(val)) return defVal;
    if (val == 'true') return true;
    return false;
  }

  static toImageData(image) {
    if (!image.base64) return image;
    return {
      data: image.base64,
      filename: image.filename
    }
  }

  static isEmpty(val) {
    return _.isEmpty(val);
  }

  static parseInt(val) {
    return parseInt(val);
  }

  parseInt(val) {
    return Utils.parseInt(val);
  }

  static formatDate(dt) {
    if (!dt) return;
    return moment(dt).format('YYYY-MM-DD');
  }

  static formatTime(dt) {
    return moment(dt).format('HH:mm:ss');
  }

  static sortObjectByKey(obj) {
    return _.zipObject(_.sortBy(_.toPairs(obj), o => o[0]));
  }

  static applyMixins(derivedCtor: any, baseCtors: any[]) {
    baseCtors.forEach(baseCtor => {
      Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
        derivedCtor.prototype[name] = baseCtor.prototype[name];
      });
    });
  }

  /**
   * Convert number of seconds into time object
   *
   * @param integer secs Number of seconds to convert
   * @return object
   */
  static secondsToTime(secs) {

    var hours = Math.floor(secs / (60 * 60));

    var divisor_for_minutes = secs % (60 * 60);
    var minutes = Math.floor(divisor_for_minutes / 60);

    var divisor_for_seconds = divisor_for_minutes % 60;
    var seconds = Math.ceil(divisor_for_seconds);

    return {
      "h": hours,
      "m": minutes,
      "s": seconds
    };
    
  }

  static mockReturn(ret?) {
    var data = {};
    data['data'] = {};
    data['data']['data'] = ret;
    return data;
  }
  
  static formatDuration(duration, opt = { h: true, m: true, s: true }) {
    var formatted = '';
    duration = Utils.secondsToTime(duration);
    if (opt.h && duration.h > 0) formatted += `${duration.h}小时`;
    if (opt.m && duration.m > 0) formatted += `${duration.m}分`;
    if (opt.s && duration.s > 0) formatted += `${duration.s}秒`;
    return formatted;
  }


  /**
   * Convert base64 string to array buffer.
   *
   * @param {string} base64
   * @returns {object}
   */
  static base64ToArrayBuffer(base64) {
    var binaryString = window.atob(base64);
    var len = binaryString.length;
    var bytes = new Uint8Array( len );
    for (var i = 0; i < len; i++)        {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  /**
   * Reorient specified element.
   *
   * @param {number} orientation
   * @param {object} element
   * @returns {undefined}
   */
  static reOrient(orientation, element) {
    switch (orientation) {
      case 1:
        // No action needed
        break;
      case 2:
        element.css({
          '-moz-transform': 'scaleX(-1)',
          '-o-transform': 'scaleX(-1)',
          '-webkit-transform': 'scaleX(-1)',
          'transform': 'scaleX(-1)',
          'filter': 'FlipH',
          '-ms-filter': "FlipH"
        });
        break;
      case 3:
        element.css({
          'transform': 'rotate(180deg)'
        });
        break;
      case 4:
        element.css({
          '-moz-transform': 'scaleX(-1)',
          '-o-transform': 'scaleX(-1)',
          '-webkit-transform': 'scaleX(-1)',
          'transform': 'scaleX(-1) rotate(180deg)',
          'filter': 'FlipH',
          '-ms-filter': "FlipH"
        });
        break;
      case 5:
        element.css({
          '-moz-transform': 'scaleX(-1)',
          '-o-transform': 'scaleX(-1)',
          '-webkit-transform': 'scaleX(-1)',
          'transform': 'scaleX(-1) rotate(90deg)',
          'filter': 'FlipH',
          '-ms-filter': "FlipH"
        });
        break;
      case 6:
        element.css({
          'transform': 'rotate(90deg)'
        });
        break;
      case 7:
        element.css({
          '-moz-transform': 'scaleX(-1)',
          '-o-transform': 'scaleX(-1)',
          '-webkit-transform': 'scaleX(-1)',
          'transform': 'scaleX(-1) rotate(-90deg)',
          'filter': 'FlipH',
          '-ms-filter': "FlipH"
        });
        break;
      case 8:
        element.css({
          'transform': 'rotate(-90deg)'
        });
        break;
    }
  }

}

export var load = (app: angular.IModule) => {

  app.controller(baseDialogController.controllerName, baseDialogController.Controller)
    .service(utilService.serviceName, utilService.Service)
    .service(storeService.serviceName, storeService.Service);
    // .run(['$rootScope', 'utilService', ($rootScope, utilService) => {
    //   $rootScope.parseBool = Utils.parseBool;
    //   $rootScope.lcbUtils = Utils;
    //   $rootScope.isEmpty = _.isEmpty;
    // }]);

  app.config(['blockUIConfig', '$localStorageProvider', (blockUIConfig, $localStorageProvider) => {

    $localStorageProvider.setKeyPrefix(Config.getStoragePrefix());
    blockUIConfig.autoBlock = false;

    // angular.extend(CacheFactoryProvider.defaults, {
    //   maxAge: 15 * 60 * 1000,   // 15 分钟过期
    //   deleteOnExpire: 'passive'
    // });

  }]);

};