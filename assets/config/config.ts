'use strict';

export abstract class Config {

  static baseUrl = `//${location.host}`;

  static getStoragePrefix = () => `${location.hostname}-`;

}
