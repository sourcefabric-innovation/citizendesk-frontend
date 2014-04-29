'use strict';

angular.module('citizendeskFrontendApp')
  .controller('NewReportCtrl', ['$scope', 'reportResource', '$log', function ($scope, reportResource, $log) {
    $scope.content = '';
    $scope.submit = function() {
      reportResource.save(
        {
          texts: [{
            original: $scope.content
          }]
        },
        function() {
          $log.debug('report posted');
          $scope.content = '';
        },
        function() {
          $log.error('error posting report');
        });
    };
  }]);
