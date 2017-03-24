'use strict';

import common = require('../../../utility/index');
import services = require('../../../components/services/index');
import enums = require('../../../enums/index');
import {Utils} from "../../../utility/index";
import {BaseController} from "../../../utility/base-controller";

class JsonTableController extends BaseController {

  json;
  displayJson;

  ignores = [ 'code', 'insured', 'original', 'biz_original', 'force_original', 'total_cent', 'riskCode', 'riskName' ];

  static $inject = ['$scope', common.utilService.serviceName];

  constructor(protected $scope: angular.IScope, protected utilService: common.utilService.Service) {
    super($scope, utilService);
    this.$scope.$watch('ctrl.json', (newValue, oldValue) => {
      if (!newValue) return;
      this.json = newValue;
      this.transferJson();
    });
  }

  transferJson() {
    if (!this.json) return;
    this.displayJson = _.transform(this.json, (result, v, k: string) => {
      if (_.includes(this.ignores, k)) return;
      var transId = `quote_result.${k}`;
      var newK: any = this.utilService.translate(transId);
      if (newK == transId) newK = k;
      result[newK] = v;
    });
  }

  isInvalid() {
    if (!this.json) return false;
    var valid = this.json.valid === undefined ? true : this.json.valid;
    var insured = this.json.insured === undefined ? true : this.json.insured;
    return !valid || !insured;
  }

  isEmpty() {
    return _.isEmpty(this.json);
  }

}

export class Controller extends JsonTableController {}