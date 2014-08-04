'use strict';
/* jshint camelcase: false */

angular.module('citizendeskFrontendApp')
  .controller('AssignCtrl', function ($scope, Assign, PageBroker, $window, api, $http, session) {
    $scope.users = Assign.users;
    $scope.totals = Assign.totals;
    $scope.identity = session.identity;
    $scope.disabled = false;
    PageBroker
      .getData('/twitter-search/')
      .then(function(data) {
        $scope.report = data.report;
      });
    Assign.updateTotals();
    $scope.assignTo = function(user_id) {
      $scope.disabled = true;
      api.reports
        .update($scope.report, {
          assignments: [{
            user_id: user_id
          }],
          proto: false
        })
        .then(function() {
          PageBroker.back({ updateId: $scope.report._id });
        });
    };
    $scope.back = function() {
      $window.history.back();
    };
  });
