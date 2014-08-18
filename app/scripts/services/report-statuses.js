'use strict';
/* jshint newcap:false */

angular.module('citizendeskFrontendApp')
  .factory('reportStatuses', function(Set) {
    return Set([
      'debunked',
      'verified',
      'dismissed',
      '' // for indirect statuses
    ]);
  });
