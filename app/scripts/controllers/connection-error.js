'use strict';

angular.module('citizendeskFrontendApp')
  .controller('ConnectionErrorCtrl', ['$scope', 'Application', '$window', function ($scope, Application, $window) {
    $scope.application = Application;
    $scope.reload = function() {
      $window.location.reload();
    };
  }]);
