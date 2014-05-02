'use strict';

angular.module('citizendeskFrontendApp')
  .controller('MonitorsCtrl', ['$scope', 'Reports', function ($scope, Reports) {
    $scope.filters = Reports.filters;
  }]);
