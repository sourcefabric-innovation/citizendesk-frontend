'use strict';

angular.module('citizendeskFrontendApp')
  .controller('ConfigureAccountCtrl', function ($scope, $window, auth, session, $timeout, api) {
    $scope.messages = {};
    $scope.cancel = $window.history.back;
    $scope.watch = function() {
      var mismatch = $scope.newPassword !== $scope.confirmPassword;
      $scope.messages.passwordMismatch = mismatch;
      $scope.mismatch = mismatch;
      var mis = $scope.mismatch,
          loa = $scope.loading;
      $scope.disableSubmit = mis || loa;
    };
    $scope.watchNew = function(newValue, oldValue) {
      if (newValue !== oldValue) {
        $scope.messages.shortPassword = false;
      }
    };
    $scope.$watch($scope.watch);
    $scope.$watch('newPassword', $scope.watchNew);
    $scope.submit = function() {
      $scope.messages = {};
      $scope.loading = true;
      auth
        .login(session.identity.username, $scope.currentPassword)
        .then(function() {
          api.users
            .update(session.identity, {
              password: $scope.newPassword
            })
            .then(function() {
              $scope.messages.success = true;
              $scope.loading = false;
              $timeout(function() {
                $window.history.back();
              }, 2 * 1000);
            }, function(errorMessages) {
              // errorMessages as returned by the `ErrorPolice` in the
              // http error interceptor
              errorMessages.forEach(function(key) {
                $scope.messages[key] = true;
              });
              $scope.loading = false;
            });
        })
        .catch(function(errorMessages) {
          // errorMessages as returned by the `ErrorPolice` in the
          // http error interceptor
          errorMessages.forEach(function(key) {
            $scope.messages[key] = true;
          });
          if ('authenticationFailure' in $scope.messages) {
            $timeout(function() {
              auth.logout();
            }, 5 * 1000);
          }
          $scope.loading = false;
        });
    };
  });
