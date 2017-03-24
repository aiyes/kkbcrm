'use strict';

import {Utils} from "../../../utility/index";

import controller = require('./jsontable-controller');

export var directiveName = 'lcbJsonTable';

class JsonTableDirective implements angular.IDirective {

  restrict = 'E';
  scope = {};

  templateUrl = 'components/directives/jsontable/jsontable.html';
  replace = true;

  controller = controller.Controller;
  controllerAs = 'ctrl';
  bindToController = {
    json: '='
  };

  // <modelValue> → ngModelCtrl.$formatters(modelValue) → $viewValue
  //                                                        ↓
  // ↑                                                  $render()
  //                                                        ↓
  // ↑                                                  UI changed
  //                                                        ↓
  // ngModelCtrl.$parsers(newViewValue)    ←    $setViewValue(newViewValue)
  // link = (scope: angular.IScope, el: angular.IAugmentedJQuery, attrs: any, ctrls) => {}

}

export var Directive = [ '$injector', ($injector: angular.auto.IInjectorService) => {
  return $injector.instantiate(JsonTableDirective);
}];