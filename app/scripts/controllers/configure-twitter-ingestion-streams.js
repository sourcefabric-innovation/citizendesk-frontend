'use strict';

angular.module('citizenfrontApp')
  .controller('ConfigureTwitterIngestionStreamsCtrl', ['$scope', '$sails', function ($scope, $sails) {
    $sails
      .get('/twt_streams')
      .success(function(data) {
        $scope.twtStreams = data;
      });
  }]);
