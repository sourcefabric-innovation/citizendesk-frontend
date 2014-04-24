'use strict';

angular.module('citizendeskFrontendApp')
  .controller('ConfigureAutoreplyCtrl', ['$scope', '$sails', 'Raven', '$timeout', 'SocketsHelpers', function ($scope, $sails, Raven, $timeout, SocketsHelpers) {
    function saved() {
      $scope.alert = 'saved';
      $scope.status = 'success';
      $timeout(function() {
        $scope.alert = '';
      }, 1000);
    }
    $sails
      .get('/settings-bool?key=autoreply%20enabled')
      .success(function(data) {
        if(data.length) {
          $scope.enabled = data[0];
        } else {
          $scope.enabled = {
            key: 'autoreply enabled',
            value: false
          };
        }
      });
    $sails
      .get('/settings-string?key=autoreply%20text')
      .success(function(data) {
        if(data.length) {
          $scope.text = data[0];
        } else {
          $scope.text = {
            key: 'autoreply text',
            value: 'Thank you for your report'
          };
        }
      });
    $sails
      .get('/settings-int?key=autoreply%20timeout')
      .success(function(data) {
        if(data.length) {
          $scope.timeout = data[0];
        } else {
          $scope.timeout = {
            key: 'autoreply timeout',
            value: 5
          };
        }
      });
    $scope.disabled = false;
    $scope.submit = function() {
      SocketsHelpers.save($scope.enabled, '/settings-bool/')
        .success(function() {
          saved();
        })
        .error(function(response) {
          $scope.alert = Raven.parseSocketError(response);
          $scope.status = 'danger';
        });
      SocketsHelpers.save($scope.text, '/settings-string/')
        .success(function() {
          saved();
        })
        .error(function(response) {
          $scope.alert = Raven.parseSocketError(response);
          $scope.status = 'danger';
        });
      SocketsHelpers.save($scope.timeout, '/settings-int/')
        .success(function() {
          saved();
        })
        .error(function(response) {
          $scope.alert = Raven.parseSocketError(response);
          $scope.status = 'danger';
        });
    };
  }]);
