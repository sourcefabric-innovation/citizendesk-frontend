'use strict';

angular.module('citizendeskFrontendApp')
  .controller('QueuesCtrl', function ($scope, TwitterSearches, Monitors, session) {
    $scope.session = session;
    $scope.collapseSearches = true;
    Monitors.promise.then(function(monitors){
      $scope.monitors = monitors;
    });
    TwitterSearches.promise.then(function(searches) {
      $scope.searches = searches;
    });
  });
