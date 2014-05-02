'use strict';

angular.module('citizendeskFrontendApp')
  .controller('ReportListCtrl', ['$scope', 'Reports', function ($scope, Reports) {
    $scope.reports = Reports.reports;
  }]);
