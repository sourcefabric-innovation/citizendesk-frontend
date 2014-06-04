'use strict';

angular.module('citizendeskFrontendApp')
  .controller('QueueSelectionCtrl', ['$scope', 'TwitterSearches', 'QueueSelection', function ($scope, TwitterSearches, QueueSelection) {
    $scope.monitors = [];
    $scope.service = QueueSelection;
    TwitterSearches.promise.then(function(searches) {
      $scope.searches = searches;
    });
  }]);
