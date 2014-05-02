'use strict';

angular.module('citizendeskFrontendApp')
  .controller('ReportListCtrl', ['$scope', 'Reports', '$routeParams', function ($scope, Reports, $routeParams) {
    var group = $routeParams.group;
    $scope.reports = Reports.filters[group].reports;
  }]);
