'use strict';

angular.module('citizendeskFrontendApp')
  .controller('BodyCtrl', function ($scope, Body, screenSize) {
    $scope.service = Body;
    $scope.navCollapsed = true;
    $scope.clickNavigation = function(){
      if (screenSize.is('xs')) {
        $scope.navCollapsed = true;
      }
    };
  });
