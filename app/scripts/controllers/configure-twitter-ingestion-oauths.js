'use strict';
/* jshint camelcase: false */

angular.module('citizendeskFrontendApp')
  .controller('ConfigureTwitterIngestionOauthsCtrl', function (api, $scope, session) {
    api.twt_oauths
      .query({
        where: JSON.stringify({
          user_id: session.identity._id
        })
      })
      .then(function(response) {
        $scope.key = response._items.pop();
        if (!$scope.key) {
          $scope.noKey = true;
        } else {
          $scope.disabled = true;
        }
      });
    $scope.add = function() {
      $scope.key = {
        user_id: session.identity._id,
        spec: {}
      };
      $scope.noKey = false;
      $scope.edit();
    };
    $scope.edit = function() {
      $scope.disabled = false;
      $scope.copy = angular.copy($scope.key);
      $scope.editing = true;
      /* we cannot reuse the displayed data when the user wants to edit,
       because they are masked. so that section of the document has to be
       reset */
      $scope.key.spec = {};
    };
    $scope.cancelEdit = function() {
      $scope.disabled = true;
      $scope.editing = false;
      $scope.key = $scope.copy;
    };
    $scope.save = function() {
      $scope.disabled = true;
      api.twt_oauths
        .save($scope.key)
        .then(function() {
          $scope.disabled = false;
          $scope.editing = false;
        });
    };
  });
