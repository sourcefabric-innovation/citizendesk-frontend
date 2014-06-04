'use strict';

angular.module('citizendeskFrontendApp')
  .factory('reportResource', ['$resource', 'prefix', function ($resource, prefix) {
    return $resource(prefix + '/reports/:id');
  }]);
