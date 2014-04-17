'use strict';

angular.module('citizenfrontApp')
  .controller('ConfigureAutoreplyCtrl', ['$scope', '$sails', 'Raven', '$timeout', function ($scope, $sails, Raven, $timeout) {
    function saved() {
      $scope.alert = 'saved';
      $scope.status = 'success';
      $timeout(function() {
        $scope.alert = '';
      }, 1000);
    }
    function save(key, endpoint) {
      var id = $scope[key].id;
      if(typeof id === 'undefined') {
        $sails
          .post(endpoint, $scope[key])
          .success(function(id) {
            $scope[key].id = id;
            saved();
          })
          .error(function(response) {
            $scope.alert = Raven.captureSocketError(response);
            $scope.status = 'danger';
          });
      } else {
        $sails
          .put(endpoint+id, $scope[key])
          .success(function() {
            saved();
          })
          .error(function(response) {
            $scope.alert = Raven.captureSocketError(response);
            $scope.status = 'danger';
          });
      }
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
      save('enabled', '/settings-bool/');
      save('text', '/settings-string/');
      save('timeout', '/settings-int/');
    };
  }]);
