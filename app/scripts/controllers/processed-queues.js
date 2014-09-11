'use strict';

angular.module('citizendeskFrontendApp')
  .controller('ProcessedQueuesCtrl', function ($scope, ProcessedQueues) {
    var keys = [
      'published',
      'dismissed',
      'debunked',
      'assigned'
    ];
    $scope.totals = {};
    keys.forEach(function (key) {
      ProcessedQueues
        .getResponses(key)
        .onValue(function(response) {
          $scope.totals[key] = response._meta.total;
        });
    });
    $scope.update = function() {
      keys.forEach(function(key) {
        ProcessedQueues.requests.push(key);
      });
    };
    $scope.update();
  });
