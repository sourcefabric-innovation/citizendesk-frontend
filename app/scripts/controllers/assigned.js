'use strict';

angular.module('citizendeskFrontendApp')
  .controller('AssignedCtrl', function ($scope, Assign) {
    $scope.users = Assign.users;
    $scope.totals = Assign.totals;
    $scope.collapseReports = true;
    $scope.collapseTweets = true;
    Assign.updateTotals();
  });