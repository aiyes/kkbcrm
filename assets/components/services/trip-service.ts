'use strict';

import baseService = require('./base-service');
import common = require('../../utility/index');
// import models = require('../models/index');

export var serviceName = 'tripService';

class TripService extends baseService.Service {

  static $inject = ['$q', '$http', common.utilService.serviceName];

  constructor(protected $q: angular.IQService, protected $http: angular.IHttpService, protected utilService) {
    super($q, $http, utilService);
  }

  getPartners() {
    return this._post(`proxy/server/command`, {
      cmd: 'get_partners',
    });
  }

  getTripsByDay(query) {
    return this._post(`proxy/server/command`, {
      cmd: 'get_trips_by_day',
      data: [ query.partner, query.cid, query.date ]
      // data: ['999901000', '862095020628589', '2016-10-18']
    });
  }

}

export class Service extends TripService {}