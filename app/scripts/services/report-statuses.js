'use strict';
/* jshint newcap:false */

angular.module('citizendeskFrontendApp')
  .factory('reportStatuses', function(setFactory) {
    return setFactory([
      'debunked',
      'verified',
      'dismissed',
      '' // for indirect statuses
    ]);
  });
