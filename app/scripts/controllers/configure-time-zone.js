'use strict';

angular.module('citizendeskFrontendApp')
  .controller('ConfigureTimeZoneCtrl', function ($scope) {
    $scope.$watch(function() {
      var negativeOffsetInMinutes = (new Date()).getTimezoneOffset(),
          offsetInMinutes = - negativeOffsetInMinutes;
      $scope.offset = offsetInMinutes / 60;
      if ($scope.offset > 0) {
        $scope.offsetString = '+' + $scope.offset;
      } else {
        $scope.offsetString = String($scope.offset);
      }
    });
  });
