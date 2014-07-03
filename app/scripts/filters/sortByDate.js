'use strict';

angular.module('citizendeskFrontendApp')
  .filter('sortByDate', function (lodash, parseDate) {
    return function (input, prop) {
      if (input) {
        var result = angular.copy(input);
        result.sort(function(a, b) {
          return parseDate(a[prop]) - parseDate(b[prop]);
        });
        return result;
      } else {
        return [];
      }
    };
  });
