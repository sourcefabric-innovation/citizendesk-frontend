'use strict';
/* jshint camelcase: false */

angular.module('citizendeskFrontendApp')
  .controller('SessionCtrl', function ($scope, api, $routeParams, $http, config, session, addNewValues, PagePolling) {
    $scope.reports = [];
    $scope.replies = {};
    $scope.editingId = $routeParams.editingId;
    $scope.startReply = function(id) {
      $scope.editingId = id;
    };
    $scope.cancelReply = function() {
      $scope.editingId = null;
    };
    $scope.sendReply = function(data) {
      data.user_id = session.identity._id;
      data.sensitive = false;
      data.language = 'en';
      $http
        .post(config.server.url + 'proxy/mobile-reply/', data)
        .then(function() {
          $scope.editingId = null;
          fetch(1);
        });
    };

    function fetch(page) {
      api.reports
        .query({
          where: JSON.stringify({
            'session': $routeParams.session
          }),
          page: page
        })
        .then(function(response) {
          addNewValues($scope.reports, response._items);
          if (response._links.next) {
            fetch(page + 1);
          }
        });
    }
    fetch(1);
    PagePolling.setInterval(function() { fetch(1); }, 10 * 1000);
  });
