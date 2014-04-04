'use strict';

angular.module('citizenfrontApp')
  .controller('NewReportCtrl', ['$scope', 'ReportResource', function ($scope, ReportResource) {
    $scope.content = '';
    $scope.submit = function() {
      var newReport = new ReportResource({
        content: $scope.content
      });
      newReport.$save();
    };
  }]);
