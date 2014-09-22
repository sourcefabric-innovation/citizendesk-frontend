'use strict';

angular.module('citizendeskFrontendApp')
  .controller('IngestFromLocationCtrl', function ($scope, $http, config, $window, Report, session, $timeout) {
    var messageTimeout;
    $scope.cancel = function() {
      $window.history.back();
    };
    function successMessage() {
      // when the `repeat` flag is set and the user is adding several
      // links one after each other, we do not want that the success
      // of a previous action hides the success of the next
      // one. not a big deal anyway
      if (messageTimeout) {
        $timeout.cancel(messageTimeout);
      }
      $scope.showConfirm = true;
      messageTimeout = $timeout(function() {
        $scope.showConfirm = false;
      }, 2000);
      return messageTimeout;
    }
    $scope.submit = function() {
      $http
        .post(config.server.url + 'proxy/ingest_from_location/', {
          location: $scope.location,
          user_id: session.identity._id
        })
        .then(function() {
          if ($scope.repeat) {
            $scope.location = '';
          }
          return successMessage();
        })
        .then(function() {
          if (!$scope.repeat) {
            $window.history.back();
          }
        });
    };
  });
