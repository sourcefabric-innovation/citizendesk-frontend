'use strict';

angular.module('citizendeskFrontendApp')
  .controller('IngestFromLocationCtrl', function ($scope, $http, config, $window, Report, session) {
    $scope.cancel = function() {
      $window.history.back();
    };
    $scope.submit = function() {
      $http
        .post(config.server.url + 'proxy/ingest_from_location/', {
          location: $scope.location,
          user_id: session.identity._id
        })
        .then(function() {
          if ($scope.repeat) {
            $scope.location = '';
          } else {
            $window.history.back();
          }
        });
    };
  });
