'use strict';

angular.module('citizendeskFrontendApp')
  .controller('QueuesCtrl', function ($scope, TwitterSearches, Monitors) {
    TwitterSearches.promise.then(function(response) {
      $scope.searches = response._items;
    });
    Monitors.promise.then(function(monitors){
      $scope.monitors = monitors;
    });
  });
