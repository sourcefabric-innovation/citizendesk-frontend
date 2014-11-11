'use strict';

angular.module('citizendeskFrontendApp')
  .controller('LoginModalCtrl', function ($scope, auth) {
    $scope.username = '';
    $scope.password = '';
    $scope.messages = {
    };
    $scope.onCredentialsChange = function(newVal, oldVal) {
      if (newVal !== oldVal) {
        $scope.messages = {};
      }
    };
    $scope.$watchGroup(['username', 'password'], $scope.onCredentialsChange);
    $scope.submit = function() {
      auth.login($scope.username, $scope.password)
        .then(function() {
          $scope.$close();
        })
        .catch(function(messages){
          messages.forEach(function(message) {
            $scope.messages[message] = true;
          });
        });
    };
  });
