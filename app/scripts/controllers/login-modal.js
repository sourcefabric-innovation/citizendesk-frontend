'use strict';

angular.module('citizendeskFrontendApp')
  .controller('LoginModalCtrl', function ($scope, auth) {
    $scope.errors = {
      service: false
    };
    $scope.submit = function() {
      auth.login($scope.username, $scope.password)
        .then(function() {
          $scope.$hide();
        })
        .catch(function() {
          $scope.errors.service = true;
        });
    };
  });
