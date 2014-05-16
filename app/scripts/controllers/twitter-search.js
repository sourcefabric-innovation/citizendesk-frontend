'use strict';

angular.module('citizendeskFrontendApp')
  .controller('TwitterSearchCtrl', ['$scope', 'Queues', 'TwitterSearches', '$routeParams', '$location', function ($scope, Queues, TwitterSearches, $routeParams, $location) {
    $scope.queues = [];
    $scope.queue = {};
    Queues.promise.then(function(queues) {
      $scope.queues = queues;
      $scope.queue  = TwitterSearches.getBySlug(queues, $routeParams.id);
      if (!$scope.queue) {
        $location.url('/error-no-searches');
      }
    });
  }]);
