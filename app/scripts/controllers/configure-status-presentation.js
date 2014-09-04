'use strict';

angular.module('citizendeskFrontendApp')
  .controller('ConfigureStatusPresentationCtrl', function ($scope, api, lodash) {
    api.report_statuses
      .query()
      .then(function(response) {
        $scope.statuses = response._items;
        // remove the status with an empty key
        lodash.remove($scope.statuses, function(report) {
          return !report.key;
        });
      });
    $scope.save = function(status) {
      $scope.disabled = true;
      api.report_statuses
        .save(status)
        .then(function() {
          $scope.disabled = false;
        });
    };
  });
