'use strict';

angular.module('citizendeskFrontendApp')
  .factory('addNewValues', function (lodash) {
    var _ = lodash;
    return function(existing, received) {
      function isUnique(testedElement) {
        var found = _.find(existing, function(existingElement) {
          return testedElement._id === existingElement._id;
        });
        if (typeof found === 'undefined') {
          return true;
        } else {
          return false;
        }
      }
      var uniques = _.filter(received, isUnique);
      uniques.forEach(function(element) {
        existing.push(element);
      });
    };
  });
