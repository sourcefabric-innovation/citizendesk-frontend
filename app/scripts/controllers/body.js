'use strict';

angular.module('citizendeskFrontendApp')
  .controller('BodyCtrl', function ($scope, Body) {
    $scope.service = Body;
  });
