'use strict';

angular.module('citizendeskFrontendApp')
  .controller('LoginCtrl', function ($scope, $modal, auth, $location, session, $window, $http) {
    $scope.modal = $modal({
      template: 'views/modals/login.html',
      show: false
    });
    $scope.$watch(function() {
      return session.token;
    }, function(token) {
      $scope.identity = session.identity;
      $scope.username = session.identity ? session.identity.username : null;
      $scope.password = null;
      if (!token) {
        $scope.modal.$promise.then($scope.modal.show);
      }
    });
    $scope.logout = function() {

      function clear() {
        session.clear();
      }

      var sessionHref = session.getSessionHref();
      if (sessionHref) {
        $http['delete'](sessionHref).then(clear, clear);
      } else {
        clear();
      }
    };
  });
