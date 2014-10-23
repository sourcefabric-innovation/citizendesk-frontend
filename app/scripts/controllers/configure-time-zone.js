'use strict';

angular.module('citizendeskFrontendApp')
  .controller('ConfigureTimeZoneCtrl', function ($scope) {
    $scope.getOffset = function() {
      return (new Date()).getTimezoneOffset();
    };
    $scope.watcher = function() {
      var negativeOffsetInMinutes = $scope.getOffset(),
          offsetInMinutes = - negativeOffsetInMinutes;
      $scope.offset = offsetInMinutes / 60;
      if ($scope.offset > 0) {
        $scope.offsetString = '+' + $scope.offset;
      } else if ($scope.offset === 0) {
        $scope.offsetString = '';
      } else {
        $scope.offsetString = String($scope.offset);
      }
    };
    $scope.$watch($scope.watcher);
  });
