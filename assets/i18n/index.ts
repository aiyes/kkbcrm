'use strict';

import {zh_CN} from "./zh_CN";

export var load = (app: angular.IModule) => {

  app.config(['$translateProvider', function ($translateProvider) {
    $translateProvider.translations('zh-CN', zh_CN);
    $translateProvider.preferredLanguage('zh-CN').fallbackLanguage('zh-CN');
  }]);


};