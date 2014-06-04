'use strict';

angular.module('citizendeskFrontendApp')
  .controller('TwitterSearchCtrl', ['$scope', 'TwitterSearches', '$routeParams', '$location', 'QueueSelection', function ($scope, TwitterSearches, $routeParams, $location, QueueSelection) {
    $scope.queue = {};
    TwitterSearches.promise.then(function() {
      $scope.queue  = TwitterSearches.byId($routeParams.id);
      if (!$scope.queue) {
        $location.url('/error-no-searches');
      } else {
        TwitterSearches.fetchResults($scope.queue);
        QueueSelection.description = $scope.queue.description;
      }
    });
  }]);
