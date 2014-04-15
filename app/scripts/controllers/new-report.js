'use strict';

angular.module('citizenfrontApp')
  .controller('NewReportCtrl', ['$scope', '$sails', '$log', function ($scope, $sails, $log) {
    $scope.content = '';
    $scope.submit = function() {
      $sails.post('/reports', {
        texts: [$scope.content],
        created: (new Date()).toISOString()
      }, function() {
        $log.debug('report posted');
      }, function() {
        $log.error('error posting report');
      });
    };
  }]);
