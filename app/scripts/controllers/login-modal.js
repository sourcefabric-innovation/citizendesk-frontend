'use strict';

angular.module('citizendeskFrontendApp')
  .controller('LoginModalCtrl', function ($scope, auth) {
    $scope.username = '';
    $scope.password = '';
    $scope.errors = {
      service: false
    };
    $scope.submit = function() {
      auth.login($scope.username, $scope.password)
        .then(function() {
          $scope.$close();
        })
        .catch(function() {
          $scope.errors.service = true;
        });
    };
  });
