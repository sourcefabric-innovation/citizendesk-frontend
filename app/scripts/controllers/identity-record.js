'use strict';

angular.module('citizendeskFrontendApp')
  .controller('IdentityRecordCtrl', function ($scope, $window, $routeParams, api) {
    $scope.disabled = true;
    $scope.deleteDisabled = true;
    $scope.cancel = function() {
      $window.history.back();
    };
    function saveAndGoBack() {
      $scope.disabled = true;
      api.identity_records
        .save($scope.identity)
        .then(function() {
          $scope.disabled = false;
          $window.history.back();
        });
    }
    $scope.submit = function() {
      saveAndGoBack();
    };
    $scope.delete = function() {
      $scope.identity.deleted = true;
      saveAndGoBack();
    };
    if ($routeParams.id) {
      api.identity_records
        .getById($routeParams.id)
        .then(function (identity) {
          $scope.identity = identity;
          $scope.disabled = false;
        });
      api.citizen_aliases
        .query({
          where: JSON.stringify({
            identity_record_id: $routeParams.id
          })
        })
        .then(function (response) {
          var aliases = response._items;
          $scope.aliases = aliases;
          // the following does not guarantee that another alias could
          // be eventually added. i would need transactions on the
          // client side. this is why i just set a property instead of
          // actually deleting
          if (aliases.length===0) {
            $scope.deleteDisabled = false;
          }
        });
    } else {
      $scope.identity = {};
      $scope.disabled = false;
      $scope.hideDelete = true;
    }
  });
