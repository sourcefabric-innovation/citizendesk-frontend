'use strict';
/* jshint camelcase: false */

angular.module('citizendeskFrontendApp')
  .controller('ConfigureAutoreplyCtrl', function ($scope, api) {
    $scope.disabled = true;
    api.core_config
      .query({ where: '{"type":"sms"}'})
      .then(function(response) {
        $scope.config = response._items.pop();
        $scope.disabled = false;
      });
    $scope.save = function() {
      $scope.disabled = true;
      api.core_config
        .save($scope.config)
        .then(function(){
          $scope.disabled = false;
        });
    };
  });
