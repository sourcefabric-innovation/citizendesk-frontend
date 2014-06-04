'use strict';
/* jshint newcap: false */

angular.module('citizendeskFrontendApp')
  .controller('ConfigureStepsCtrl', ['$scope', 'resource', 'prefix', function ($scope, resource, prefix) {
    var res = resource(prefix + '/steps/:id');
    res
      .query()
      .$promise
      .then(function(data) {
        $scope.steps = data;
      });
    $scope.status = {};
    $scope.add = function() {
      var step = new res({ description: '' });
      $scope.steps.push(step);
    };
    $scope.save = function(step) {
      $scope.status[step._id] = 'disabled';
      step
        .$save()
        .then(function() {
          $scope.status[step._id] = '';
        })
        .catch(function() {
          $scope.status[step._id] = 'error';
        });
    };
  }]);
