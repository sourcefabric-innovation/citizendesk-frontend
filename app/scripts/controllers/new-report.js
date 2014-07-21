'use strict';

angular.module('citizendeskFrontendApp')
  .controller('NewReportCtrl', function ($scope/*, $filter*/) {
    $scope.content = '';
    $scope.submit = function() {
    /*
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
          $scope.content = '';
        },
        function() {
          $log.error('error posting report');
        });
     */
    };
  });
