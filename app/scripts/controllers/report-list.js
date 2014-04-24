'use strict';
/* jshint eqeqeq:false */

angular.module('citizendeskFrontendApp')
  .controller('ReportListCtrl', ['$scope', '$sails', function ($scope, $sails) {
    $sails
      .get('/reports?limit=100&sort=created%20DESC')
      .success(function(data) {
        $scope.reports = data;
      });
    $sails
      .on('message', function (message) {
      if (message.model == 'reports' && message.verb == 'create') {
        $scope.reports.unshift(message.data);
      }
    });
  }]);
