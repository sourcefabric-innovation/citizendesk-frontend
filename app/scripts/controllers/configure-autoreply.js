'use strict';

angular.module('citizendeskFrontendApp')
  .controller('ConfigureAutoreplyCtrl', ['$scope', 'Raven', 'Resources', '$q', '$timeout', function ($scope, Raven, Resources, $q, $timeout) {
    $scope.status = 'success';
    $scope.alert = '';
    function promiseError(reason) {
      $scope.disabled = false;
      $scope.status = 'error';
      $scope.alert = reason;
    }
    function success() {
      $scope.disabled = false;
      $scope.alert = 'success';
      $scope.status = 'success';
      $timeout(function() {
        $scope.alert = '';
      }, 1000);
    }
    Resources.settings.bool.query({key: 'autoreply enabled'}, function(resp) {
      if (resp.length > 0 ) {
        $scope.enabled = resp.pop();
      } else {
        $scope.enabled = new Resources.settings.bool({
          key: 'autoreply enabled',
          value: false
        });
      }
    }, promiseError);
    Resources.settings.string.query({key: 'autoreply text'}, function(resp) {
      if (resp.length > 0) {
        $scope.text = resp.pop();
      } else {
        $scope.text = new Resources.settings.string({
          key: 'autoreply text',
          value: 'Thank you for your report'
        });
      }
    }, Raven.promiseError);
    Resources.settings.int.query({key: 'autoreply timeout'}, function(resp) {
      if (resp.length > 0) {
        $scope.timeout = resp.pop();
      } else {
        $scope.timeout = new Resources.settings.int({
          key: 'autoreply timeout',
          value: 5
        });
      }
    }, promiseError);
    $scope.disabled = false;
    $scope.submit = function() {
      $scope.disabled = true;
      $q
        .all([
          $scope.timeout.$save().$promise,
          $scope.text.$save().$promise,
          $scope.enabled.$save().$promise
        ])
        .then(success)
        .catch(promiseError);
    };
  }]);
