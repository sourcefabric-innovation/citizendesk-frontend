'use strict';
/* jshint newcap: false */

angular.module('citizendeskFrontendApp')
  .controller('ConfigureStepsCtrl', ['$scope', 'resource', 'prefix', 'api', function ($scope, resource, prefix, api) {
    var res = resource(prefix + '/steps/:id');
    api
      .steps
      .query()
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
