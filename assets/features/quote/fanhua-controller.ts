'use strict';

import common = require('../../utility/index');
import services = require('../../components/services/index');
import {BaseController} from "../../utility/base-controller";
import {Utils} from "../../utility/index";
import {mock} from "./mock";
import {FanhuaUploadController} from "./fanhua-upload-controller";

export var controllerName = 'quote.fanhuaController';

class FanhuaController extends BaseController {

  supportCities;
  carModels;
  providers;

  choosableRisks = ['VehicleDemageIns', 'ThirdPartyIns', 'DriverIns', 'PassengerIns', 'TheftIns', 'GlassIns', 'CombustionIns', 'ScratchIns', 'WadingIns', 'VehicleDemageMissedThirdPartyCla', 'SpecifyingPlantCla', 'GoodsOnVehicleIns', 'CompensationForMentalDistressIns', 'VehicleCompulsoryIns', 'VehicleTax'];

  query: any = {
    isNew: 'N',
    isTransferCar: 'N',
    bizInsureInfo: {}
  };

  quote: any = {};

  taskId;
  done;
  info = {};
  result = {};

  static $inject = ['$scope', '$timeout', '$state', '$q', common.utilService.serviceName, common.storeService.serviceName, services.fanhuaService.serviceName];

  constructor(protected $scope, private $timeout, private $state, private $q, protected utilService: common.utilService.Service, private storeService: common.storeService.Service, private fanhuaService: services.fanhuaService.Service) {
    super($scope, utilService);
    this.prepareCities();
  }

  private prepareCities() {
    this.utilService.showSpinner();
    this.fanhuaService.getCities().then(resp => this.supportCities = resp.data).finally(() => this.utilService.hideSpinner());
  }

  reload() {
    this.$state.reload();
  }

  getProviders() {
    return this.fanhuaService.getProviders(this.query.insureAreaCode).then(resp => {
      this.providers = resp.data.providers;
    });
  }

  getCarInfo() {
    return this.fanhuaService.getCarInfo({
      vehicleName: this.query.vehicleName,
      carLicenseNo: this.query.carLicenseNo,
      registDate: this.query.registDate
    }).then(resp => {
      this.carModels = resp.data.carModelInfos;
      this.query.vehicleId = this.carModels ? this.carModels[0].vehicleId : null;
    });
  }

  fetchInfo() {
    // this.utilService.showSpinner();
    // this.fanhuaService.fetchInfo({
    //   insureAreaCode: this.query.insureAreaCode,
    //   carInfo: { carLicenseNo: this.query.carLicenseNo },
    //   carOwner: {
    //     name: this.query.name,
    //     idcardNo: this.query.idcardNo
    //   }
    // }).then(resp => {
    //   this.info = resp.data;
    //   this.taskId = resp.data.taskId;
    //   this.query = angular.merge(this.query, _.omit(resp.data.carInfo, ['insureAreaCode', 'carLicenseNo', 'name', 'idcardNo']));
    //   this.parseInsure(resp.data);
    // }).finally(() => this.utilService.hideSpinner());
    // // 获取车型信息
    // this.getCarInfo().then(resp => {
    // 获取供应商列表
    this.getProviders().then(resp => {
      // 获取报价信息
      return this.fanhuaService.fetchInfo({
        insureAreaCode: this.query.insureAreaCode,
        carInfo: { carLicenseNo: this.query.carLicenseNo },
        carOwner: {
          name: this.query.name,
          idcardNo: this.query.idcardNo
        }
      }).then(resp => {
        this.info = resp.data;
        this.taskId = resp.data.taskId;
        this.query = angular.merge(this.query, _.omit(resp.data.carInfo, ['insureAreaCode', 'carLicenseNo', 'name', 'idcardNo']));
        this.parseInsure(resp.data);
      });
    }).then(resp => {
      return this.getCarInfo();
    }).finally(() => this.utilService.hideSpinner());
  }

  parseInsure(data) {

    if (!data.insureInfo) return;

    this.query.bizInsureInfo = data.insureInfo.bizInsureInfo || {};
    this.query.bizInsureInfo.startDate = Utils.formatDate(this.query.bizInsureInfo.startDate);
    this.query.bizInsureInfo.endDate = Utils.formatDate(this.query.bizInsureInfo.endDate);
    this.query.efcInsureInfo = data.insureInfo.efcInsureInfo || {};
    this.query.efcInsureInfo.startDate = Utils.formatDate(this.query.efcInsureInfo.startDate);
    this.query.efcInsureInfo.endDate = Utils.formatDate(this.query.efcInsureInfo.endDate);

    var riskKinds = this.query.bizInsureInfo.riskKinds;
    this.quote = _.keyBy(riskKinds, 'riskCode');
    if (this.query.efcInsureInfo.amount == 1) this.query.efcInsure = true;
    if (data.insureInfo.taxInsureInfo) this.query.taxInsure = true;

  }

  quickQuote() {
    this.done = true;
    this.result = {};
    this.utilService.showSpinner('提交中……');
    this.fanhuaService.reinsure(this.taskId, this.getQuote()).then(resp => {
      // this.taskId = resp.data.taskId;
      this.saveLast();
      this.done = false;
      this.refreshResult();
    });
  }

  createQuote() {
    this.done = true;
    this.result = {};
    this.utilService.showSpinner('提交中……');
    this.fanhuaService.createQuote(this.getQuote(true)).then(resp => {
      this.taskId = resp.data.taskId;
      this.saveLast();
      this.done = false;
      this.refreshResult();
    });
  }

  refreshResult() {
    if (this.done) return;
    // this.utilService.showSpinner('取回结果中……');
    this.fanhuaService.getQuote(this.taskId).then(resp => {
      if (resp.data.length >= this.providers.length) this.utilService.hideSpinner();
      // this.done = resp.data.length == this.providers.length;
      if (!this.done) this.$timeout(() => this.refreshResult(), 2000);
      if (resp.data.length == _.size(<any> this.result)) return;
      this.result = _.keyBy(_.map(resp.data, (data: any) => {
        var riskKinds: any = _.get(data, 'data.insureInfo.bizInsureInfo.riskKinds');
        var isValid = !(_.includes(['2', '18', '19', '20', '22'], data.data.taskState));
        if (riskKinds) data.data.insureInfo.bizInsureInfo.riskKinds = _.keyBy(_.map(riskKinds, (k: any) => {
          k.valid = isValid;
          return k;
        }), 'riskCode');
        return data.data;
      }), 'prvId');
      // this.result = angular.merge(res, this.result);
    }).finally(() => this.utilService.hideSpinner());
  }

  getQuote(full = false) {
    var quote: any = {
      insureInfo: {},
      providers: _.map(this.providers, (p: any) => {
        return { prvId: p.prvId }
      })
    };
    if (full) {
      quote = angular.extend(quote, {
        insureAreaCode: this.query.insureAreaCode,
        carInfo: {
          isNew: this.query.isNew,
          carLicenseNo: this.query.carLicenseNo,
          vinCode: this.query.vinCode,
          engineNo: this.query.engineNo,
          registDate: this.query.registDate,
          price: this.query.price,
          vehicleId: this.query.vehicleId,
          isTransferCar: this.query.isTransferCar,
          transferDate: this.query.transferDate
        },
        carOwner: {
          name: this.query.name,
          idcardNo: this.query.idcardNo,
          phone: this.query.phone
        }
      });
    }
    if (this.query.efcInsure) {
      quote.insureInfo.efcInsureInfo = this.query.efcInsureInfo;
    }
    if (this.query.taxInsure) {
      quote.insureInfo.taxInsureInfo = {
        isPaymentTax: 'Y'
      }
    }
    // quote.insureInfo.bizInsureInfo = angular.merge(this.query.bizInsureInfo || {}, { riskKinds: this.getInsures() });
    quote.insureInfo.bizInsureInfo = this.query.bizInsureInfo || {};
    quote.insureInfo.bizInsureInfo.riskKinds = this.getInsures();
    if (Utils.isEmpty(quote.insureInfo.bizInsureInfo.riskKinds)) delete quote.insureInfo.bizInsureInfo;
    return quote;
  }

  saveLast() {
    this.storeService.storeItem('taskId', this.taskId);
    this.storeService.storeItem('query', {
      insureAreaCode: this.query.insureAreaCode,
      carLicenseNo: this.query.carLicenseNo,
      name: this.query.name
    });
    this.storeService.storeItem('quote', this.quote);
  }

  loadLastResult() {
    // this.taskId = resp.data.taskId;
    var lastTaskId = this.storeService.getItem('taskId');
    if (!lastTaskId) return;
    this.query = this.storeService.getItem('query');
    this.quote = this.storeService.getItem('quote');
    this.getProviders();
    this.taskId = lastTaskId;
    this.done = false;
    this.refreshResult();
  }

  searchVehicle() {
    this.getProviders();
    this.utilService.prompt({ title: '请输入车型名称或VIN码', value: this.query.vinCode }).then(q => {
      this.fanhuaService.getCarInfo({
        vehicleName: q,
        carLicenseNo: this.query.carLicenseNo,
        registDate: this.query.registDate
      }).then(resp => {
        this.carModels = resp.data.carModelInfos;
        this.query.vehicleId = this.carModels ? this.carModels[0].vehicleId : null;
        this.query.vehicleName = this.carModels[0].vehicleName;
      });
    });
  }

  getInsures() {
    var insures = [];
    _.forOwn(this.quote, (v, k) => {
      var risk: any = angular.copy(v);
      risk.riskCode = k;
      if (!risk.amount || risk.amount == 0) return;
      if (!_.includes(this.choosableRisks, risk.riskCode)) return;
      delete risk.premium;
      delete risk.ncfPremium;
      insures.push(risk);
    });
    return insures;
  }

  cantQuote() {
    if (_.isEmpty(this.quote)) return true;
    if (this.query.isTransferCar == 'Y' && this.query.transferDate == null) return true;
    return false;
  }

  pay(quote) {
    var more = this.needMore(quote);
    this.$q.when(more).then(more => {
      if (!more) return;
      return this.utilService.dialog('features/quote/fanhua-upload.html', FanhuaUploadController, more, { windowClass: 'fanhua-upload' }).result
        .then(resp => {
          if (!resp) return;
          quote.imageInfos = _.xorBy(quote.imageInfos, resp.imageInfos, 'imageType');
        });
    }).then(() => {
      this.utilService.showSpinner();
      this.fanhuaService.pay(this.taskId, {
        taskId: this.taskId,
        prvId: quote.prvId,
        retUrl: `${location.origin}/#/quote/fanhua/order`
      }).then(resp => {
        window.open(resp.data.payUrl, '_fanhua_pay');
      }).finally(() => this.utilService.hideSpinner());
    });
  }

  submitInsure(insure) {
    var more = this.needMore(insure);
    this.$q.when(more).then(more => {
      if (!more) return;
      return this.utilService.dialog('features/quote/fanhua-upload.html', FanhuaUploadController, more, { windowClass: 'fanhua-upload' }).result
        .then(resp => {
          if (!resp) return;
          insure.imageInfos = _.xorBy(insure.imageInfos, resp.imageInfos, 'imageType');
        });
    }).then(() => {
      this.utilService.showSpinner();
      this.fanhuaService.submitInsure(this.taskId, {
        taskId: this.taskId,
        prvId: insure.prvId
      }).finally(() => this.utilService.hideSpinner());
    })
  }

  needMore(quote) {
    var needed: any = {};
    if (quote.msgType == '01') {
      var missingImages = _.filter(quote.imageInfos, { upload: 'N' });
      if (!Utils.isEmpty(missingImages)) {
        needed.missingImages = missingImages;
      }
    }
    if (Utils.isEmpty(needed)) return;
    needed.taskId = quote.taskId;
    return needed;
   }

  reimbursement(insure) {
    this.utilService.showSpinner();
    this.fanhuaService.reimbursement(this.taskId, {
      taskId: this.taskId,
      prvId: insure.prvId
    }).then(resp => {
      this.utilService.notify(resp.data.msg);
    }).finally(() => this.utilService.hideSpinner());
  }

}

export class Controller extends FanhuaController {}