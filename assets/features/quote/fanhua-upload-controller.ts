'use strict';

import common = require('../../utility/index');
import services = require('../../components/services/index');
import {BaseDialogController} from "../../utility/base-dialog-controller";
import {Utils} from "../../utility/index";
import {mock} from "./mock";

export class FanhuaUploadController extends BaseDialogController {

  images;

  static $inject = ['$injector', '$scope', '$uibModalInstance', 'data', common.utilService.serviceName, services.fanhuaService.serviceName];

  constructor(protected $injector, protected $scope, protected $modalInstance, protected data, private utilService: common.utilService.Service, private fanhuaService: services.fanhuaService.Service) {
    super($injector, $scope, $modalInstance, data);
  }

  ok() {
    if (Utils.isEmpty(this.images)) return this.$modalInstance.close();
    this.utilService.showSpinner();
    this.fanhuaService.uploadImages(this.data.taskId, this.images)
      .then(resp => this.$modalInstance.close(resp.data))
      .finally(() => this.utilService.hideSpinner());
  }

}
