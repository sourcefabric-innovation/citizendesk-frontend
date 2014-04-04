'use strict';

angular.module('citizenfrontApp')
  .service('ReportResource', ['$resource', 'configuration', function ReportResource($resource, configuration) {
    return $resource(
      configuration.root + '/reports/:id'
    );
  }]);
