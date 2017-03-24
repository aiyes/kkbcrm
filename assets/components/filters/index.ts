'use strict';

import bihuCompanyFilter = require('./bihu-company-filter');

export var load = (app: angular.IModule) => {
  app.filter(bihuCompanyFilter.filterName, bihuCompanyFilter.Filter.filter);
};