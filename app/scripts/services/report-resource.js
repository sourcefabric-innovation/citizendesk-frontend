'use strict';

angular.module('citizendeskFrontendApp')
  .factory('reportResource', ['$resource', function ($resource) {
    var root = 'http://martin.sourcefabric.net:1337';
    return $resource(root + '/reports/:id');
  }]);
