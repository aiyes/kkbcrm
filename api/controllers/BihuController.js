'use strict';

/**
 * BihuController
 *
 * @description :: Server-side logic for managing Yobees
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var co = require('co');
var sleep = require('co-sleep');

var bihuService = require('../services/BihuService.js');

module.exports = {

  cities(req, resp) {
    resp.json({
      1: '北京',
      2: '重庆',
      3: '天津',
      4: '四川',
      5: '昆明',
      6: '上海',
      7: '宁夏',
      8: '江苏',
      9: '杭州',
      10: '福建',
      11: '深圳',
      12: '河北',
      13: '安徽',
      14: '广州'
    });
  },

  reinsure(req, resp) {
    co(function* () {
      resp.json(yield bihuService.getReInfo(req.body));
    }).catch(err => {
      sails.log.error(err);
      resp.json(err)
    });
  },

  quote(req, resp) {

    co(function* () {

      // 00000000001 太平洋 1
      // 00000000010 平安 2
      // 00000000100 人保 4
      // 00000001000 国寿财 8
      // 00000010000 中华联合 16
      // 00000100000 大地 32
      // 00001000000 阳光 64
      // 00010000000 太平保险 128
      // 00100000000 华安 256
      // 01000000000 天安 512
      // 10000000000 英大 1024

      var payload = {
        // CityCode: '1',
        // LicenseNo: '京QDX980',
        // CarOwnersName: '张冠文',
        // IdCard: '340122199212120171',
        // MoldName: '一汽大众宝来',
        // CarVin: 'LSYYBBDB5CC096537',
        // EngineNo: 'E074275',
        // RegisterDate: '2011-06-14',
        // InsuredMobile: '18612994885',
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
        SheShui: 0,
        HuaHen: 0,
        SiJi: 0,
        ChengKe: 0,
        CheSun: 0,
        DaoQiang: 0,
        SanZhe: 0,
        ZiRan: 0,
        HcJingShenSunShi: 0,
        HcSanFangTeYue: 0
      };
      payload = Object.assign(payload, req.body || {});

      var res = [];
      for (var i = 0, sources = [1 + 2 + 4], l = sources.length; i < l; i++) {
        var source = sources[i];
        payload.QuoteGroup = source;
        var r = yield bihuService.createQuote(_.clone(payload));
        if (r.BusinessStatus < 0) throw r.StatusMessage;
        res.push(r);
        yield sleep(3000); // 睡3秒
      }

      resp.json(res);

      // resp.json(yield bihuService.createQuote(req.body));

    }).catch(err => {
      sails.log.error(err);
      if (_.isString(err)) err = { data: { message: err } };
      resp.json(400, err);
    });

  },

  getQuote(req, resp) {
    co(function* () {

      var res = [];
      for (var i = 0, sources = [1, 2, 4], l = sources.length; i < l; i++) {
        var source = sources[i];
        var r = yield bihuService.getQuote(req.params.LicenseNo, source);
        if (!r.Item) {  // 有错误的情况
          r.Item = { Source: source, QuoteResult: r.StatusMessage };
        }
        res.push(r);
        yield sleep(3000); // 睡3秒
      }

      var credit = yield bihuService.getCreditInfo(req.params.LicenseNo);

      resp.json({
        Result: res,
        Credit: credit
      });

    }).catch(err => {
      sails.log.error(err);
      resp.json(400, err)
    });
  }

};

