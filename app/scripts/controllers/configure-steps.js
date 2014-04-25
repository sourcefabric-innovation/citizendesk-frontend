'use strict';

angular.module('citizendeskFrontendApp')
  .controller('ConfigureStepsCtrl', ['$scope', 'SocketsHelpers', '$sails', function ($scope, SocketsHelpers, $sails) {
    $sails
      .get('/steps')
      .success(function(data) {
        $scope.steps = data;
      });
    $scope.add = function() {
      $scope.steps.push({
        description: ''
      });
    };
    $scope.save = function(original) {
      var step = angular.copy(original);
      original.disabled = true;
      SocketsHelpers
        .save(step, '/steps/')
        .success(function () {
          original.disabled = false;
        })
        .error(function () {
          original.disabled = false;
          original.error = true;
        });
    };
  }]);
