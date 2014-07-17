'use strict';

angular.module('citizendeskFrontendApp')
  .controller('TwitterSearchCtrl', function ($scope, TwitterSearches, $routeParams, $location, QueueSelection, PageBroker) {
    $scope.queue = {};
    $scope.limit = 50;
    $scope.loading = true;
    TwitterSearches.promise.then(function() {
      $scope.queue  = TwitterSearches.byId($routeParams.id);
      if (!$scope.queue) {
        $location.url('/error-no-searches');
      } else {
        TwitterSearches.start($scope.queue).then(function() {
          $scope.loading = false;
        });
        QueueSelection.description = $scope.queue.description;
      }
    });
    $scope.delete = function() {
      $scope.status = 'deleting';
      TwitterSearches
        .delete($scope.queue)
        .then(function() { $scope.status = 'deleted'; })
        .catch(function() { $scope.status = 'error'; });
    };
    $scope.assign = function(report) {
      PageBroker.load('/assign/', {
        report: report
      });
    };
  });
