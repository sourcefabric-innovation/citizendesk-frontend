'use strict';

angular.module('citizendeskFrontendApp')
  .controller('MonitorCtrl', ['$scope', 'Queues', 'Monitors', '$routeParams', '$location', function ($scope, Queues, Monitors, $routeParams, $location) {
    $scope.queues = [];
    $scope.monitor = {};
    Queues.promise.then(function(queues) {
      $scope.queues = queues;
      $scope.monitor = Monitors
        .getBySlug($scope.queues, $routeParams.id);
      if (!$scope.monitor) {
        $location.url('/error-no-monitors');
      }
    });
    $scope.resetNewTrack = function() {
      $scope.newTrack = angular.copy($scope.monitor.filter.spec.track);
    };
    $scope.save = function() {
      Monitors
        .retrack($scope.monitor, $scope.newTrack)
        .then(function() { $scope.editing = false; });
    };
  }]);
