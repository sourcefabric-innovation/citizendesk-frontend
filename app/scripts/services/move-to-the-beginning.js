'use strict';

angular.module('citizendeskFrontendApp')
  .factory('moveToTheBeginning', function () {
    return function(index, originalArray) {
      var array = angular.copy(originalArray),
          removed = array.splice(index, 1);
      return removed.concat(array);
    };
  });
