'use strict';

angular.module('citizenfrontApp')
  .controller('ConfigureTwitterIngestionOauthsCtrl', ['$scope', '$sails', function ($scope, $sails) {
    $sails
      .get('/twt_oauths')
      .success(function(data) {
        $scope.twtOauths = data;
      });
  }]);
