'use strict';
/* jshint camelcase:false */

angular.module('citizendeskFrontendApp')
  .controller('ConfigureTwitterIngestionStreamsCtrl', ['$scope', '$sails', 'SocketsHelpers', 'prefix', '$http', 'Raven', function ($scope, $sails, SocketsHelpers, prefix, $http, Raven) {
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
    $scope.restartDisabled = {};
    $scope.restartError = {};
    $scope.restart = function(stream, index) {
      var id = stream.id;
      var path = prefix + '/twt_streams';
      $scope.restartDisabled[index] = true;
      $http
        .get(path + '/stop?id='+id)
        .success(function() {
          $http
            .get(path + '/start?id='+id)
            .success(function() {
              $scope.restartDisabled[index] = false;
              $scope.restartError[index] = false;
            })
            .error(function() {
              Raven.raven.captureMessage('error starting stream');
              $scope.restartDisabled[index] = false;
              $scope.restartError[index] = true;
            });
        })
        .error(function() {
          Raven.raven.captureMessage('error stopping stream');
          $scope.restartDisabled[index] = false;
          $scope.restartError[index] = true;
        });
    };
  }]);
