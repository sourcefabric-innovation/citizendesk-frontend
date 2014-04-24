'use strict';
/* jshint camelcase:false */

angular.module('citizendeskFrontendApp')
  .controller('ConfigureTwitterIngestionStreamsCtrl', ['$scope', '$sails', 'SocketsHelpers', function ($scope, $sails, SocketsHelpers) {
    $sails
      .get('/twt_filters')
      .success(function(data) {
        $scope.twtFilters = data;
      });
    $sails
      .get('/twt_streams')
      .success(function(data) {
        $scope.twtStreams = data;
        data.forEach(function(stream) {
          delete stream.disabled;
          delete stream.error;
        });
      });
    $scope.saveStream = function(original) {
      var stream = angular.copy(original);
      original.disabled = true;
      SocketsHelpers
        .save(stream, '/twt_streams/')
        .success(function () {
          original.disabled = false;
        })
        .error(function () {
          original.disabled = false;
          original.error = true;
        });
    };
  }]);
