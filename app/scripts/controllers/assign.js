'use strict';
/* jshint camelcase: false */

angular.module('citizendeskFrontendApp')
  .controller('AssignCtrl', function ($scope, Assign, PageBroker, $window, api, $http, session) {
    $scope.users = Assign.users;
    $scope.identity = session.identity;
    $scope.disabled = false;
    PageBroker
      .getData('/twitter-search/')
      .then(function(data) {
        $scope.report = data.report;
      });
    $scope.assignTo = function(user_id) {
      $scope.disabled = true;
      api.reports
        .update($scope.report, {
          assignments: [{
            user_id: user_id
          }]
        })
        .then(function() {
          $window.history.back();
        });
    };
  });
