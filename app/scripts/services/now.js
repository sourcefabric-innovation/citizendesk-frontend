'use strict';

/* this service exists in order to be mocked, in places in the code
where the current time is needed */

angular.module('citizendeskFrontendApp')
  .factory('now', function () {
    return function() {
      var d = new Date();
      return d.getTime();
    };
  });
