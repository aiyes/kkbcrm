'use strict';

import fileUploaderDirective = require('./file-uploader/file-uploader-directive');
import jsonTableDirective = require('./jsontable/jsontable-directive');

export var load = (app: angular.IModule) => {
  app.directive(fileUploaderDirective.directiveName, fileUploaderDirective.Directive)
    .directive(jsonTableDirective.directiveName, jsonTableDirective.Directive);
};