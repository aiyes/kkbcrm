'use strict';

import common = require('./index');
import {Utils} from "./index";

export abstract class BaseController {

  lcbUtils = Utils;

  constructor(protected $scope: angular.IScope, protected utilService: common.utilService.Service) {
  }

}