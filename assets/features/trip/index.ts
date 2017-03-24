'use strict';

// import common = require('../../../utility/index');
import services = require('../../components/services/index');
// import {Utils} from "../../../utility/index";

import tripController = require('./trip-controller');

export var load = (app: angular.IModule) => {
  app.controller(tripController.controllerName, tripController.Controller);
};

export var states = ($stateProvider: angular.ui.IStateProvider) => {

  $stateProvider
    .state('trip', {
      url: '/trip',
      templateUrl: 'features/trip/trip.html',
      controller: tripController.Controller,
      controllerAs: 'ctrl',
      resolve: {
        partners: [services.tripService.serviceName, (tripService: services.tripService.Service) => tripService.getPartners()]
      }
    });

};
