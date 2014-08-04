'use strict';

angular.module('citizendeskFrontendApp')
  .controller('TwitterSearchCtrl', function ($scope, TwitterSearches, $routeParams, $location, QueueSelection, PageBroker) {
    $scope.queue = {};
    $scope.limit = 50;
    $scope.loading = true;
    function checkUpdate() {
      var returned = PageBroker.getReturnedData();
      if (returned && returned.updateId) {
        TwitterSearches.refreshReport($routeParams.id, returned.updateId);
      }
    }
    TwitterSearches
      .byId($routeParams.id)
      .then(function(queue) {
        $scope.queue  = queue;
        if (queue) {
          QueueSelection.description = $scope.queue.description;
          checkUpdate();
          return TwitterSearches.start(queue);
        } else {
          $location.url('/error-no-searches');
        }
      })
      .then(function() {
        $scope.loading = false;
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
