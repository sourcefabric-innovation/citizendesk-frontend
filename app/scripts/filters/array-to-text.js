'use strict';

angular.module('citizendeskFrontendApp')
  .filter('arrayToText', function () {
    return function (input) {
      return input.join(', ');
    };
  });
