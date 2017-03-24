'use strict';

var moment = require('moment');

module.exports = {

  sortObjectByKey(obj) {
    return _.object(_.sortBy(_.pairs(obj), o => o[0]));
  },

  now(format = 'YYYY-MM-DD') {
    return moment().format(format);
  }

};