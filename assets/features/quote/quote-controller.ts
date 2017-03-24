'use strict';

import common = require('../../utility/index');
import services = require('../../components/services/index');
import {BaseController} from "../../utility/base-controller";
import {Utils} from "../../utility/index";
import {mock} from "./mock";

export var controllerName = 'quote.quoteController';

class QuoteController extends BaseController {

  supportCities;

  quote: any = {
    vehicle: {},
    selection: {},
    options: {}
  };

  quote_id;
  done;

  result;
  // result: any = mock;

  static $inject = ['$scope', common.utilService.serviceName, services.quoteService.serviceName];

  constructor(protected $scope, protected utilService: common.utilService.Service, private quoteService: services.quoteService.Service) {
    super($scope, utilService);
    this.prepareCities();
  }

  private prepareCities() {
    this.utilService.showSpinner();
    this.quoteService.getCities().then(data => {
      var allCities: any = _.keyBy(data.data.data, 'name');
      var supportCities = [];
      supportCities = supportCities.concat(allCities['北京'].cities);
      supportCities = supportCities.concat(allCities['上海'].cities);
      supportCities = supportCities.concat(allCities['天津'].cities);
      supportCities.push({ code: '440000', name: '广东省 --', province: true });
      supportCities = supportCities.concat(allCities['广东'].cities);
      this.supportCities = supportCities;
    }).finally(() => this.utilService.hideSpinner());
  }

  private watchDates(...models) {
    var owner = models.shift();
    models.forEach((model) => {
      this.$scope.$watch(model, (newValue, oldValue) => {
        if (!newValue) {
          delete this.quote[owner][model];
          return;
        }
        this.quote[owner][model] = Utils.formatDate(newValue);
      });
    });
  }

  createQuote() {
    this.done = true;
    this.result = {};
    this.utilService.showSpinner('提交中……');
    this.quoteService.createQuote(this.getQuote(), { errorHandler: this.errorHandler.bind(this) }).then(data => {
      this.quote_id = data.data.id;
      this.quote.vehicle.vehicle_name = data.data.vehicle.brand_name + data.data.vehicle.family_name;
      this.result = _.keyBy(data.data.result.quotes, 'supplier_name');
      delete this.result['永安车险'];
      this.done = false;
      this.refreshResult();
    }).finally(() => this.utilService.hideSpinner());
  }

  getMessage(val) {
    if (!val.is_done) return '报价中……';
    if (val.is_success) return '报价完成';
    return val.original_message || val.message || '报价出错';
  }

  getBizInfo(val) {
    if (!val) return;
    if (!val.biz_info_summary) val.biz_info_summary = _.pick(val.biz_info, 'total', 'start_date', 'end_date');
    return val.biz_info_summary;
  }

  getQuoteDetail(val, code) {
    if (!val) return;
    if (!val.biz_info) return;
    if (_.isArray(val.biz_info.detail)) val.biz_info.detail = _.keyBy(val.biz_info.detail, 'code');
    return val.biz_info.detail[code];
  }

  errorHandler(err) {
    err = err.data;
    var fn = this[`handle${err.code}`];
    if (fn) return fn.bind(this)(err);
  }

  handle401008(err) {
    this.utilService.error(`缺少参数: ${this.utilService.translate(err.argument_name)}`);
    return true;
  }

  handle401010(err) {
    this.utilService.error(`缺少参数: ${this.utilService.translate(err.argument_name)}`);
    return true;
  }

  handle20004(err) {
    this.utilService.error(`${err.message}: ${this.utilService.translate(err.selection_code)}`);
    return true;
  }

  handle20006(err) {
    this.utilService.error(`${err.message}: ${this.utilService.translate(err.selection_code)}`);
    return true;
  }

  refreshResult() {
    this.quoteService.getQuote(this.quote_id).then(data => {
      if (this.done) return;
      this.result = _.keyBy(data.data.data.quotes, 'supplier_name');
      delete this.result['永安车险'];
      this.done = data.data.data.is_done;
      if (this.done) return;
      setTimeout(() => this.refreshResult(), 2000);
    });
  }

  getQuote() {
    var payload: any = _.clone(this.quote);
    var predicate = (v, k) => {
      if (v === false) return true;
      if (v === "") return true;
      return false;
    };
    payload.selection = _.omitBy(this.quote.selection, predicate);
    payload.options = _.omitBy(this.quote.options, predicate);
    return payload;
  }

  cantQuote() {
    var quote = this.getQuote();
    return _.isEmpty(quote.vehicle) || _.isEmpty(quote.selection);
  }

}

export class Controller extends QuoteController {}