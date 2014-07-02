'use strict';
/* jshint newcap: false */

angular.module('citizendeskFrontendApp')
  .controller('ConfigureStepsCtrl', ['$scope', 'resource', 'prefix', 'api', 'lodash', function ($scope, resource, prefix, api, _) {
    var oldRes = resource(prefix + '/steps/:id');
    var res = api.steps;
    res
      .query()
      .then(function(data) {
        $scope.steps = data._items;
      });
    $scope.endpoint = api.steps;
    $scope.status = {};
    $scope.add = function() {
      var step = new oldRes({ description: '' });
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
    $scope.remove = function(step) {
      res.remove(step)
        .then(function() {
          _.remove($scope.steps, step);
          $scope.status[step._id] = '';
        })
        .catch(function() {
          $scope.status[step._id] = 'error';
        });
    };
  }]);
