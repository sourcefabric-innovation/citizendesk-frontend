'use strict';

angular.module('citizenfrontApp')
  .controller('ReportListCtrl', ['$scope', 'ReportResource', function ($scope, ReportResource) {
    $scope.reports = ReportResource.query();
  }]);
