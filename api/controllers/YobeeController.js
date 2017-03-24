'use strict';

/**
 * YobeeController
 *
 * @description :: Server-side logic for managing Yobees
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var co = require('co');

var yobeeService = require('../services/YobeeService.js');

module.exports = {

  cities(req, resp) {
    co(function* () {
      resp.json(yield yobeeService.getCities());
    }).catch(err => resp.json(err));
  },

  quote(req, resp) {

    co(function* () {

      // var vehiclePayload = {
      //   license_no: '京Q9MB02',
      //   license_owner: '王吉红',
      //   city_code: '110100',
      //   vehicle_name: '长安',
      //   frame_no: 'LS5A3ADE1CB055358',
      //   engine_no: 'C4BD10969',
      //   enroll_date: '2012-04-13',
      //   seat_count: 5
      // };

      var vehiclePayload = req.body.vehicle;

      try {
        // 查询车辆
        var vehicle = yield yobeeService.getVehicle(_.pick(vehiclePayload, [ 'city_code', 'license_no', 'license_owner' ]));
      } catch (error) {
        // 车辆不存在，创建车辆
        vehicle = yield yobeeService.createVehicle(vehiclePayload);
      }

      vehicle = vehicle.data;

      var quotePayload = {
        vehicle_id: vehicle.vehicle_id,
        city_code: vehiclePayload.city_code,
        selection: req.body.selection,

        // selection: {

        //   force: 1,             // 交强险
        //   // tax: 1,               // 车船税
        //   damage: 1,            // 机动车损失险
        //   // deduction: 300,       // 车损绝对免赔额
        //   third: 1000000,        // 第三者责任险
        //   // driver: 10000,        // 司机险
        //   // passenger: 10000,     // 乘客险
        //   // pilfer: 1,            // 盗抢险
        //   // glass: 2,             // 玻璃险
        //   // scratch: 5000,        // 划痕险
        //   // combust: 1,           // 自燃险
        //   // water: 1,             // 涉水险
        //   // third_party: 1,       // 机动车损失险
        //   // equipment: 1,         // 新增设备损失险
        //   // repair: 200,          // 修理期间费用补偿
        //   // spirit: 10000,        // 精神损害抚慰金
        //   // cargo: 1,             // 车上货物责任险

        //   exempt_damage: 1,     // 机动车损失险（不计免赔）
        //   exempt_third: 1,      // 第三者责任险（不计免赔）
        //   // exempt_driver: 1,     // 司机险（不计免赔）
        //   // exempt_passenger: 1,  // 乘客险（不计免赔）
        //   // exempt_pilfer: 1,     // 盗抢险（不计免赔）
        //   // exempt_combust: 1,    // 自燃险（不计免赔）
        //   // exempt_scratch: 1,    // 划痕险（不计免赔）
        //   // exempt_water: 1,      // 涉水险（不计免赔）
        //   // exempt_equipment: 1,  // 新增设备损失险（不计免赔）
        //   // exempt_spirit: 1      // 精神损害抚慰金（不计免赔）

        // },

        // biz_start_date: '2016-10-25',
        // force_start_date: '2016-10-25',

        // equipment_list: [
        //   {
        //     name: '设备名称',
        //     quantity: 1,
        //     price: 110588, 
        //     purchase_date: '2015-10-12'
        //   }
        // ]

      };

      quotePayload = _.merge(quotePayload, req.body.options);

      var quote = yield yobeeService.createQuote(quotePayload);
      quote = quote.data;

      var result = yield yobeeService.getQuote(quote.request_id);
      result = result.data;
      resp.json({ id: quote.request_id, result, vehicle });

    }).catch(err => {
      resp.json(400, err);
    });

  },

  getQuote(req, resp) {
    co(function* () {
      resp.json(yield yobeeService.getQuote(req.params.id));
    }).catch(err => resp.json(400, err));
  }

};

