
'use strict';

import common = require('../../utility/index');
import services = require('../../components/services/index');
import {BaseEventListener} from "../../utility/base-event-listener";

export var controllerName = 'MenuController';

class MenuController extends BaseEventListener {

  static $inject = ['$scope', common.utilService.serviceName];

  constructor(protected $scope: angular.IScope, protected utilService: common.utilService.Service) {
    super($scope, utilService);
  }

}

export class Controller extends MenuController {}