'use strict';

angular.module('citizendeskFrontendApp')
  .controller('LoginCtrl', function ($scope, $modal, auth, $location, session) {
    $scope.watcher = function() { return session.token; };
    $scope.$watch($scope.watcher, function(token) {
      $scope.identity = session.identity;
      $scope.username = session.identity ? session.identity.username : null;
      $scope.password = null;
      if (!token) {
        $scope.modal = $modal.open({
          templateUrl: 'views/modals/login.html',
          keyboard: false, // do not close when user press `Esc`
          backdrop: 'static'
        });
      }
    });
    $scope.logout = auth.logout;
  });
