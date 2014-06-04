'use strict';

angular.module('citizendeskFrontendApp')
  .controller('VerifiedReportsCtrl', ['$scope', 'Resources', function ($scope, Resources) {
    $scope.reports = Resources.reports.query({
      where: '{"verified":true}'
    });
  }]);
