'use strict';

import common = require('../../utility/index');
import services = require('../../components/services/index');
import {BaseController} from "../../utility/base-controller";
import {Utils} from "../../utility/index";

export var controllerName = 'trip.tripController';

class TripController extends BaseController {
  
  map;

  query: any = {
    date: new Date()
  };
  trips;

  selectedTrip;

  providers = {

    gaode: L.layerGroup([L.tileLayer.chinaProvider('GaoDe.Normal.Map', {
      maxZoom: 18,
      minZoom: 5
    })]),

    mapbox: L.layerGroup([L.tileLayer.provider('MapBox', {
      maxZoom: 18,
      minZoom: 5,
      id: 'mapbox.streets',
      accessToken: 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'
    })])

  };

  markers = {
    suddenAcce: L.icon({ iconUrl: '/static/images/icon_accel.png', iconSize: [15, 15] }),
    suddenBrake: L.icon({ iconUrl: '/static/images/icon_brake.png', iconSize: [15, 15] }),
    suddenTurn: L.icon({ iconUrl: '/static/images/icon_turn.png', iconSize: [15, 15] })
  };

  static $inject = ['$scope', 'partners', common.utilService.serviceName, services.tripService.serviceName];

  constructor(protected $scope, private partners, protected utilService: common.utilService.Service, private tripService: services.tripService.Service) {
    super($scope, utilService);
    this.partners = partners.data.data.partners;
    this._initMap();
  }

  private _initMap() {

    var baseLayers = {
      "MapBox": this.providers.mapbox,
      "高德": this.providers.gaode
    };

    var map = L.map("map", {
      center: [31.22, 121.50],
      zoom: 12,
      layers: [this.providers.mapbox],
      zoomControl: false
    });

    L.control.layers(baseLayers, null).addTo(map);
    L.control.zoom({
      zoomInTitle: '放大',
      zoomOutTitle: '缩小'
    }).addTo(map);
    
    this.map = map;

    this._renderLegend(map);

  }

  private _renderLegend(map) {

    var legend = L.control({position: 'bottomright'});

    legend.onAdd = map => {
      var div = L.DomUtil.create('div', 'legend');
      div.innerHTML += `
        <img src="/static/images/icon_accel.png"> 急加速 <br>
        <img src="/static/images/icon_brake.png"> 急减速 <br>
        <img src="/static/images/icon_turn.png"> 急转弯 <br>
      `;
      return div;
    };

    legend.addTo(map);

  }

  search() {
    this.utilService.showSpinner();
    this._clearMap();
    this.selectedTrip = null;
    var payload: any = angular.copy(this.query);
    payload.date = Utils.formatDate(this.query.date);
    this.tripService.getTripsByDay(payload).then(resp => this.trips = resp.data.data.trips).finally(() => this.utilService.hideSpinner());
  }

  isSelected(trip) {
    if (!this.selectedTrip) return false;
    return this.selectedTrip.id == trip.id;
  }

  renderTrip(trip) {

    this.selectedTrip = trip;
    this._clearMap();
    if (_.isEmpty(trip.path)) return this.utilService.error('没有行程数据');

    var line = polyline.decode(trip.path);
    var r = L.polyline(line).addTo(this.map);
    this.map.fitBounds(r.getBounds());

    L.marker([trip.start_loc_lat, trip.start_loc_lon]).bindTooltip('起点', { permanent: true }).addTo(this.map);
    L.marker([trip.end_loc_lat, trip.end_loc_lon]).bindTooltip('终点', { permanent: true }).addTo(this.map);

    if (!trip.path_details) return;
    this._renderPoints(trip.path_details.acce, this.markers.suddenAcce);
    this._renderPoints(trip.path_details.brake, this.markers.suddenBrake);
    this._renderPoints(trip.path_details.turn, this.markers.suddenTurn);

  }

  private _renderPoints(points, icon) {
    if (!points) return;
    angular.forEach(points, p => {
      L.marker([p.lat, p.lng], { icon }).addTo(this.map);
    });
  }

  private _clearMap() {
    var map = this.map;
    map.eachLayer(function (layer) {
      if (layer instanceof L.Polyline) { layer.remove(); return; }
      if (layer instanceof L.Marker) { layer.remove(); return; }
    });
  }

}

export class Controller extends TripController {}