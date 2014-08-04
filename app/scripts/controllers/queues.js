'use strict';

angular.module('citizendeskFrontendApp')
  .controller('QueuesCtrl', function ($scope, TwitterSearches, Monitors, session) {
    $scope.session = session;
    TwitterSearches.promise.then(function(searches) {
      $scope.searches = searches;
    });
    Monitors.promise.then(function(monitors){
      $scope.monitors = monitors;
    });
  });
