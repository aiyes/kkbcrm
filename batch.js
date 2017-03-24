'use strict';

var co = require('co');
var sleep = require('co-sleep');
var _ = require('lodash');

var bihuService = require('./api/services/BihuService.js');

// Ensure we're in the project directory, so relative paths work as expected
// no matter where we actually lift from.
process.chdir(__dirname);

co(function* () {

  var payload = {
    CityCode: '1',
    LicenseNo: '京G11775',
    CarOwnersName: '潘效善',
    IdCard: '410221196912261358',
    MoldName: '上海大众桑塔纳',
    CarVin: 'LSVACFB00YB141613',
    EngineNo: 'AJR0236565',
    RegisterDate: '2001-02-23',
    InsuredMobile: '13241956296',
    // QuoteGroup: 16,
    BoLi: 0,
    BuJiMianCheSun: 0,
    BuJiMianDaoQiang: 0,
    BuJiMianSanZhe: 0,
    BuJiMianChengKe: 0,
    BuJiMianSiJi: 0,
    BuJiMianHuaHen: 0,
    BuJiMianSheShui: 0,
    BuJiMianZiRan: 0,
    BuJiMianJingShenSunShi: 0,
    SheShui: 1,
    HuaHen: 0,
    SiJi: 0,
    ChengKe: 0,
    CheSun: 1,
    DaoQiang: 0,
    SanZhe: 0,
    ZiRan: 0,
    HcJingShenSunShi: 0,
    HcSanFangTeYue: 0
  };

  var res = [];
  for (var i = 0, sources = [1 + 2 + 4], l = sources.length; i < l; i++) {
    var source = sources[i];
    payload.QuoteGroup = source;
    var r = yield bihuService.createQuote(_.clone(payload));
    if (r.BusinessStatus < 0) throw r.StatusMessage;
    res.push(r);
    yield sleep(3000); // 睡3秒
  }

  console.log(res);

}).catch(err => {
  console.error(err);
});
