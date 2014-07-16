'use strict';

angular.module('citizendeskFrontendApp')
  .controller('QueuesCtrl', function ($scope, TwitterSearches) {
    $scope.monitors = [];
    TwitterSearches.promise.then(function(response) {
      $scope.searches = response._items;
    });
  });
