'use strict';

import common = require('../../utility/index');
import services = require('../../components/services/index');
import {BaseController} from "../../utility/base-controller";
import {Utils} from "../../utility/index";
import {mock} from "./mock";

export var controllerName = 'quote.bihuController';

class BihuController extends BaseController {

  supportCities;

  query: any = {
    IsLastYearNewCar: '1',
    ForceTax: '1'
  };

  quote = {};

  done;
  info = {};
  credit = {};
  result = {};

  static $inject = ['$scope', common.utilService.serviceName, services.bihuService.serviceName];

  constructor(protected $scope, protected utilService: common.utilService.Service, private bihuService: services.bihuService.Service) {
    super($scope, utilService);
    this.prepareCities();
    this['emptyQuote'] = angular.copy(this.quote);
  }

  private prepareCities() {
    this.utilService.showSpinner();
    this.bihuService.getCities().then(resp => this.supportCities = resp.data).finally(() => this.utilService.hideSpinner());
  }

  reinsure() {
    this.utilService.showSpinner();
    this.bihuService.reinsure({ CityCode: this.query.CityCode, LicenseNo: this.query.LicenseNo }).then(resp => {
      if (this.errorHandler(resp.data)) return;
      angular.merge(this.query, resp.data.UserInfo);
      this.query.CarOwnersName = this.query.LicenseOwner;
      this.query.IdCard = this.query.InsuredIdCard;
      this.quote = _.mapValues(resp.data.SaveQuote, (v, k, o) => {
        if (_.includes(['SanZhe', 'SiJi', 'ChengKe', 'BoLi', 'HuaHen'], k)) return "" + v;
        return v;
      });
      this.info = resp.data;
      this.result = {};
      this.credit = {};
      if (resp.data.SaveQuote.Source != -1) {
        this.result[resp.data.SaveQuote.Source] = _.mapValues(resp.data.SaveQuote, (v, k, o) => {
          if (k == 'Source') return v;
          return { BaoE: v };
        });
      }
      // if (resp.data.SaveQuote) this.result[resp.data.SaveQuote.Source] = resp.data.SaveQuote;
    }).finally(() => this.utilService.hideSpinner());
  }

  createQuote() {
    this.done = true;
    this.result = {};
    this.credit = {};
    this.utilService.showSpinner('提交中……');
    this.bihuService.createQuote(this.getQuote()).then(resp => {
      if (this.errorHandler(resp.data)) return;
      this.done = false;
      this.refreshResult();
    }).finally(() => this.utilService.hideSpinner());
  }

  refreshResult() {
    // if (this.done) return;
    this.utilService.showSpinner('取回结果中……');
    this.bihuService.getQuote(this.query.LicenseNo).then(resp => {
      if (this.errorHandler(resp.data.Result)) return;
      // this.done = (_.countBy(resp.data, 'BusinessStatus')[1] == 3);
      // if (this.done) {
        this.result = _.keyBy(_.map(resp.data.Result, (data: any) => data.Item), 'Source');
        this.credit = resp.data.Credit;
      //   return;
      // }
      // setTimeout(() => this.refreshResult(), 2000);
    }).finally(() => this.utilService.hideSpinner());
  }

  getQuote() {
    angular.merge(this.quote, this.query);
    return this.quote;
  }

  errorHandler(err) {
    if (!angular.isObject(err)) {
      this.utilService.error(err);
      return true;
    }
    if (err.BusinessStatus < 0) {
      this.utilService.error(err.StatusMessage);
      return true;
    }
  }

  cantQuote() {
    return _.isEmpty(this.quote);
  }


}

export class Controller extends BihuController {}