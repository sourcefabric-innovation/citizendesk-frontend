'use strict';

angular.module('citizendeskFrontendApp')
  .controller('NewReportCtrl', function ($scope, reportResource, $log, $filter) {
    $scope.content = '';
    $scope.submit = function() {
      reportResource.save(
        {
          texts: [{
            original: $scope.content
          }],
          channels: [{
            type: 'frontend'
          }],
          produced: $filter('date')(new Date(), 'yyyy-MM-ddTHH:mm:ss+0000')
        },
        function() {
          $log.debug('report posted');
          $scope.content = '';
        },
        function() {
          $log.error('error posting report');
        });
    };
  });
