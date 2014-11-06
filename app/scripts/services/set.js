'use strict';

angular.module('citizendeskFrontendApp')
  .factory('setFactory', function(lodash) {
    return function(elements) {
      return function(element) {
        if (lodash.contains(elements, element)) {
          return element;
        } else {
          var j = JSON.stringify,
              error = j(element) + ' is not in ' + j(elements);
          throw Error(error);
        }
      };
    };
  });
